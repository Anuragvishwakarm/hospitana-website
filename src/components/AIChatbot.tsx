"use client";

/**
 * AIChatbot — floating editorial chatbot for the Hospitana website.
 *
 * Design intent: feels like an extension of the editorial home page
 * (Fraunces serif accents, Manrope body, cream/teal/clay palette) rather
 * than a generic vendor widget. Refined, warm, hospital-appropriate.
 *
 * Wire-up: drop <AIChatbot /> into app/layout.tsx (or any single page).
 * It reads/writes its own session id via lib/rag-api.ts.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { askHospitana, resetHospitanaSession, type ChatResponse } from "@/lib/rag-api";

// -------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------
type Role = "user" | "assistant" | "system";

interface Message {
  id: string;
  role: Role;
  text: string;
  citations?: ChatResponse["citations"];
  isError?: boolean;
}

// -------------------------------------------------------------------------
// Suggestion chips — shown on first open
// -------------------------------------------------------------------------
const SUGGESTIONS = [
  "Do you have a cardiologist?",
  "Are ICU beds available right now?",
  "Price of Paracetamol?",
  "How much is a CBC test?",
  "What are the visiting hours?",
];

// -------------------------------------------------------------------------
// Component
// -------------------------------------------------------------------------
export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Auto-focus input when opening
  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 220);
    }
  }, [open]);

  // Auto-grow textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const send = useCallback(
    async (questionText?: string) => {
      const q = (questionText ?? input).trim();
      if (!q || loading) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        text: q,
      };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const res = await askHospitana(q);
        setMessages((m) => [
          ...m,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            text: res.answer,
            citations: res.citations,
          },
        ]);
        if (!open) setUnread(true);
      } catch (err) {
        setMessages((m) => [
          ...m,
          {
            id: `e-${Date.now()}`,
            role: "assistant",
            isError: true,
            text:
              "Sorry — I'm having trouble reaching the hospital system right now. " +
              "Please call reception at +91 084299 33131.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, open]
  );

  const clearChat = useCallback(async () => {
    setMessages([]);
    await resetHospitanaSession();
  }, []);

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------
  return (
    <>
      {/* Floating launcher button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Hospitana Assistant"
          className="
            fixed bottom-6 right-6 z-[60]
            group flex items-center gap-3
            pl-4 pr-5 py-3
            bg-[#0f4c4a] text-[#fdf8ef]
            rounded-full shadow-[0_10px_40px_-12px_rgba(15,76,74,0.55)]
            hover:shadow-[0_18px_50px_-12px_rgba(15,76,74,0.7)]
            hover:-translate-y-0.5 active:translate-y-0
            transition-all duration-300
            border border-[#0f4c4a]/20
          "
        >
          <span
            className="
              relative grid place-items-center
              h-9 w-9 rounded-full
              bg-[#fdf8ef]/15 ring-1 ring-[#fdf8ef]/20
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-9 8.38 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8 8.38 8.38 0 0 1 8.4-8.4 8.38 8.38 0 0 1 8.6 8.4z" />
            </svg>
            {unread && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#c97b4a] ring-2 ring-[#0f4c4a]" />
            )}
          </span>
          <span className="text-sm font-medium tracking-wide">
            Ask Hospital
          </span>
        </button>
      )}

      {/* Chat panel */}
      <div
        role="dialog"
        aria-label="Hospitana Assistant"
        aria-hidden={!open}
        className={`
          fixed bottom-6 right-6 z-[60]
          w-[min(420px,calc(100vw-2rem))]
          h-[min(620px,calc(100vh-3rem))]
          flex flex-col
          bg-[#fdf8ef]
          rounded-2xl
          shadow-[0_25px_70px_-15px_rgba(15,42,52,0.35)]
          border border-[#e8dfc9]
          overflow-hidden
          transition-all duration-300 ease-out
          ${
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }
        `}
      >
        {/* Header */}
        <header
          className="
            relative px-5 pt-5 pb-4
            bg-gradient-to-br from-[#0f4c4a] via-[#0f4c4a] to-[#0a3a38]
            text-[#fdf8ef]
          "
        >
          {/* Decorative grain dots */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#fdf8ef 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }}
          />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#fdf8ef]/60 mb-1">
                Sahara Hospital · Bhadohi
              </p>
              <h2
                className="text-xl leading-tight"
                style={{ fontFamily: "var(--font-fraunces, Fraunces), serif" }}
              >
                Hospital Assistant
              </h2>
              <p className="text-xs text-[#fdf8ef]/70 mt-1">
                Doctors · beds · pharmacy · appointments
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                aria-label="Clear conversation"
                title="Clear conversation"
                className="
                  p-2 rounded-full text-[#fdf8ef]/70 hover:text-[#fdf8ef]
                  hover:bg-[#fdf8ef]/10 transition-colors
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="
                  p-2 rounded-full text-[#fdf8ef]/70 hover:text-[#fdf8ef]
                  hover:bg-[#fdf8ef]/10 transition-colors
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="
            flex-1 overflow-y-auto
            px-4 py-5
            bg-gradient-to-b from-[#fdf8ef] to-[#f7eed7]/60
            scroll-smooth
          "
          style={{ fontFamily: "var(--font-manrope, Manrope), sans-serif" }}
        >
          {messages.length === 0 ? (
            <Welcome onPick={(q) => send(q)} />
          ) : (
            <ul className="space-y-3.5">
              {messages.map((m) => (
                <li key={m.id}>
                  <Bubble msg={m} />
                </li>
              ))}
              {loading && (
                <li>
                  <TypingBubble />
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Composer */}
        <div className="px-3 pt-2 pb-3 bg-[#fdf8ef] border-t border-[#e8dfc9]">
          <div
            className="
              flex items-end gap-2
              bg-white border border-[#e8dfc9] rounded-2xl
              px-3 py-2
              focus-within:border-[#0f4c4a]/40
              focus-within:ring-2 focus-within:ring-[#0f4c4a]/10
              transition-all
            "
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Ask about doctors, beds, medicines…"
              disabled={loading}
              className="
                flex-1 resize-none bg-transparent outline-none
                text-[14px] leading-snug text-[#0f2a34] placeholder:text-[#0f2a34]/40
                min-h-[24px] max-h-[120px] py-1
              "
              style={{
                fontFamily: "var(--font-manrope, Manrope), sans-serif",
              }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="
                shrink-0 grid place-items-center
                h-9 w-9 rounded-xl
                bg-[#0f4c4a] text-[#fdf8ef]
                disabled:opacity-30 disabled:cursor-not-allowed
                hover:bg-[#0a3a38] active:scale-95
                transition-all
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 -rotate-45 translate-x-[1px] -translate-y-[1px]"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-[#0f2a34]/40 text-center mt-2 tracking-wide">
            AI assistant · for emergencies call{" "}
            <span className="font-medium text-[#0f2a34]/60">
              +91 084299 33131
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------------------
// Sub-components
// -------------------------------------------------------------------------

function Welcome({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-5">
        <p
          className="text-[#0f2a34]/80 text-[15px] leading-relaxed"
          style={{ fontFamily: "var(--font-fraunces, Fraunces), serif" }}
        >
          Hello. How can I help you today?
        </p>
        <p className="text-[#0f2a34]/55 text-[13px] leading-relaxed mt-2">
          I can look up doctors, check bed availability, pharmacy stock,
          lab prices, and answer questions about the hospital.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#0f2a34]/45 mb-2">
          Try asking
        </p>
        {SUGGESTIONS.map((s, i) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="
              w-full text-left
              px-3.5 py-2.5
              bg-white/70 hover:bg-white
              border border-[#e8dfc9]
              rounded-xl
              text-[13px] text-[#0f2a34]/80 hover:text-[#0f2a34]
              transition-all
              hover:border-[#0f4c4a]/30
              hover:translate-x-0.5
            "
            style={{
              animationDelay: `${i * 60}ms`,
            }}
          >
            <span className="text-[#c97b4a] mr-2">→</span>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[85%] px-3.5 py-2.5
          text-[14px] leading-relaxed
          ${
            isUser
              ? "bg-[#0f4c4a] text-[#fdf8ef] rounded-2xl rounded-br-md"
              : msg.isError
              ? "bg-[#c97b4a]/10 text-[#7a3e1a] border border-[#c97b4a]/30 rounded-2xl rounded-bl-md"
              : "bg-white text-[#0f2a34] border border-[#e8dfc9] rounded-2xl rounded-bl-md"
          }
        `}
      >
        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
        {msg.citations && msg.citations.length > 0 && (
          <div className="mt-2 pt-2 border-t border-[#e8dfc9]/70">
            <p className="text-[10px] uppercase tracking-wide text-[#0f2a34]/45 mb-1">
              Sources
            </p>
            <ul className="text-[11px] text-[#0f2a34]/60 space-y-0.5">
              {msg.citations.map((c, i) => (
                <li key={i}>
                  · {c.source}
                  {c.page ? `, page ${c.page}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-[#e8dfc9] rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-[#0f4c4a]/30 animate-bounce"
              style={{ animationDelay: `${i * 140}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
