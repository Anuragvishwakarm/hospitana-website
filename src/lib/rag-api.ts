/**
 * Hospitana RAG API client
 *
 * Thin wrapper around POST /api/v1/rag/chat with:
 *  - Persistent session_id in localStorage (so multi-turn memory works
 *    across page navigations).
 *  - Optional Bearer token (auto-attached when the user is logged in).
 *  - Typed responses matching the backend Pydantic schemas.
 *  - Friendly fallback message on network failure.
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const SESSION_KEY = "hospitana_rag_session_id";

// ----- Types ----------------------------------------------------------------

export interface Citation {
  kind: "policy" | string;
  source?: string | null;
  page?: number | null;
}

export interface ToolTraceItem {
  tool: string;
  args: Record<string, unknown>;
  ok: boolean;
  elapsed_ms: number;
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
  tool_trace: ToolTraceItem[];
  elapsed_ms: number;
  model: string;
  session_id: string;
}

// ----- Session id helpers ---------------------------------------------------

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const fresh =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(SESSION_KEY, fresh);
  return fresh;
}

export function resetSessionId(): string {
  if (typeof window === "undefined") return "";
  localStorage.removeItem(SESSION_KEY);
  return getOrCreateSessionId();
}

// ----- Auth helper ----------------------------------------------------------

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1. Plain key (what most pages save directly).
  const direct =
    localStorage.getItem("access_token") ?? localStorage.getItem("token");
  if (direct) return direct;

  // 2. Zustand persist store (the v6 `useAuth` store usually persists
  //    under "auth-storage" with shape { state: { token: "..." }, version }).
  for (const storeKey of ["auth-storage", "auth", "user-storage"]) {
    const raw = localStorage.getItem(storeKey);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      const tok =
        parsed?.state?.token ??
        parsed?.state?.access_token ??
        parsed?.token ??
        parsed?.access_token;
      if (tok) return tok as string;
    } catch {
      /* ignore parse errors */
    }
  }

  return null;
}

// ----- Main API call --------------------------------------------------------

export async function askHospitana(question: string): Promise<ChatResponse> {
  const sessionId = getOrCreateSessionId();
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/v1/rag/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      question,
      session_id: sessionId,
    }),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  return res.json();
}

/** Clear server-side conversation memory for the current session. */
export async function resetHospitanaSession(): Promise<void> {
  const sessionId = getOrCreateSessionId();
  try {
    await fetch(`${API_URL}/api/v1/rag/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    });
  } catch {
    /* non-fatal */
  }
  resetSessionId();
}
