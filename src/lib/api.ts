import axios from "axios";
import { MOCK_DOCTORS, MOCK_WARDS, MOCK_STATS, type Doctor, type Ward } from "./mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

// Auto-attach JWT
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("hospitana-auth");
      if (raw) {
        const { state } = JSON.parse(raw);
        if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch { /* no-op */ }
  }
  return config;
});

/* ─── Doctor mapping ───────────────────────────────────────────────────── */
function mapDoctor(raw: any): Doctor {
  if (raw && typeof raw.name === "string" && raw.department) return raw as Doctor;
  const first = raw.first_name ?? "";
  const last = raw.last_name ?? "";
  const fullName = `${first} ${last}`.trim();
  const profile = raw.profile ?? {};
  const spec = profile.specialization || "General Practitioner";

  // Prefer uploaded photo from backend, fall back to generated avatar
  const uploadedPhoto = raw.photo_url || profile.photo_url;
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName.replace(/^dr\.?\s*/i, ""),
  )}&background=0F4C4A&color=FAF6EF&size=512&bold=true&format=png`;

  return {
    id: raw.id, name: fullName, specialization: spec, department: spec,
    qualification: profile.qualification || "MBBS",
    experience_years: profile.experience_years ?? 0,
    consultation_fee: Number(profile.consultation_fee ?? 0),
    bio: profile.bio || "Experienced specialist at Sahara Hospital.",
    languages: ["Hindi", "English"],
    available_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    photo_url: uploadedPhoto || fallbackAvatar,
    rating: 4.8, consultations: 0,
  };
}

function mapWard(raw: any): Ward {
  const beds = raw.beds ?? [];
  return {
    id: raw.id, name: raw.name,
    type: raw.type || raw.ward_type || "general",
    description: raw.description || "",
    daily_charge: Number(raw.daily_charge ?? 0),
    amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
    total_beds: raw.total_beds ?? beds.length,
    available_beds: raw.available_beds ?? beds.filter((b: any) => !b.is_occupied).length,
    beds: beds.map((b: any) => ({
      id: b.id, bed_number: b.bed_number, is_occupied: !!b.is_occupied,
    })),
    // Gallery photos uploaded via HMS; backend returns them as an array of URL paths
    photos: Array.isArray(raw.photos) ? raw.photos : [],
  };
}

/* ─── Public reads ─────────────────────────────────────────────────────── */
export async function getDoctors(params?: { department?: string; search?: string }): Promise<Doctor[]> {
  try {
    const { data } = await api.get("/public/doctors", { params });
    return Array.isArray(data) ? data.map(mapDoctor) : [];
  } catch {
    let list = [...MOCK_DOCTORS];
    if (params?.department && params.department !== "all") {
      list = list.filter((d) => d.department.toLowerCase() === params.department!.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q));
    }
    return list;
  }
}
export async function getDoctor(id: string): Promise<Doctor | null> {
  try {
    const { data } = await api.get(`/public/doctors/${id}`);
    return mapDoctor(data);
  } catch { return MOCK_DOCTORS.find((d) => d.id === Number(id)) || null; }
}
export async function getWards(): Promise<Ward[]> {
  try {
    const { data } = await api.get("/public/wards");
    return Array.isArray(data) ? data.map(mapWard) : [];
  } catch { return MOCK_WARDS; }
}
export async function getHospitalStats() {
  try { const { data } = await api.get("/public/stats"); return data; }
  catch { return MOCK_STATS; }
}

/* ─── Hospital photo gallery (about / home page) ───────────────────────── */
export type HospitalPhoto = {
  id: number;
  photo_url: string;
  caption?: string | null;
  category?: string | null;
};

export async function getHospitalPhotos(category?: string): Promise<HospitalPhoto[]> {
  try {
    const { data } = await api.get("/public/hospital-photos", {
      params: category ? { category } : {},
    });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/* ─── Auth ─────────────────────────────────────────────────────────────── */
export type AuthPayload = {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role?: string;
    uhid?: string;
  };
};

export async function registerPatient(payload: {
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  password: string;
  dob?: string;
  gender?: string;
  blood_group?: string;
  address?: string;
}): Promise<AuthPayload> {
  const { data } = await api.post("/public/auth/register", payload);
  return data;
}

export async function loginPatient(
  identifier: { email?: string; phone?: string },
  password: string,
): Promise<AuthPayload> {
  const { data } = await api.post("/public/auth/login", { ...identifier, password });
  return data;
}

export async function changePassword(current_password: string, new_password: string) {
  const { data } = await api.put("/public/auth/password", {
    current_password,
    new_password,
  });
  return data;
}

/* ─── Patient profile — binds to YOUR existing /patients endpoints ─────── */

export type PatientProfileData = {
  id?: number;
  user_id?: number;
  uhid?: string;
  dob?: string | null;
  gender?: string | null;
  blood_group?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  allergies?: string | null;
  existing_conditions?: string | null;
};

export type PatientRecord = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  profile: PatientProfileData | null;
};

/** GET /patients/me  — your existing endpoint */
export async function getMyRecord(): Promise<PatientRecord> {
  const { data } = await api.get("/patients/me");
  return data;
}

/** PUT /patients/{id}/profile  — your existing endpoint */
export async function updateMyProfile(
  patient_id: number,
  payload: PatientProfileData,
): Promise<PatientProfileData> {
  const { data } = await api.put(`/patients/${patient_id}/profile`, payload);
  return data;
}

/** PUT /patients/{id}  — query-string params per your router signature */
export async function updateMyBasicInfo(
  patient_id: number,
  fields: { first_name?: string; last_name?: string; phone?: string },
): Promise<PatientRecord> {
  const { data } = await api.put(`/patients/${patient_id}`, null, { params: fields });
  return data;
}

/* ─── Appointments — existing endpoints ─────────────────────────────────── */
export type AvailableSlot = { time: string; available: boolean };

export async function getAvailableSlots(
  doctor_id: number,
  apt_date: string,
): Promise<AvailableSlot[]> {
  const { data } = await api.get("/appointments/available-slots", {
    params: { doctor_id, apt_date },
  });
  return data?.slots ?? [];
}

export async function bookAppointment(payload: {
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  reason?: string;
}) {
  const { data } = await api.post("/appointments", payload);
  return data;
}

export type Appointment = {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason?: string;
  notes?: string;
  token_number?: number;
  patient_name?: string;
  doctor_name?: string;
  created_at?: string;
};

export async function myAppointments(): Promise<Appointment[]> {
  const { data } = await api.get("/appointments");
  return data;
}

export async function cancelAppointment(id: number) {
  const { data } = await api.put(`/appointments/${id}/cancel`);
  return data;
}