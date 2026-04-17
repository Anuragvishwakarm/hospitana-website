export type Doctor = {
  id: number;
  name: string;
  specialization: string;
  department: string;
  qualification: string;
  experience_years: number;
  consultation_fee: number;
  languages: string[];
  available_days: string[];
  photo_url: string;
  bio: string;
  rating: number;
  consultations: number;
};

export type Bed = {
  id: number;
  bed_number: string;
  is_occupied: boolean;
};

export type Ward = {
  id: number;
  name: string;
  type: "general" | "semi-private" | "private" | "deluxe" | "icu" | "emergency";
  description: string;
  daily_charge: number;
  amenities: string[];
  total_beds: number;
  available_beds: number;
  beds: Bed[];
};

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 1,
    name: "Dr. Anjali Mishra",
    specialization: "Senior Cardiologist",
    department: "Cardiology",
    qualification: "MBBS, MD (Medicine), DM (Cardiology) — KGMU Lucknow",
    experience_years: 18,
    consultation_fee: 800,
    languages: ["Hindi", "English", "Bhojpuri"],
    available_days: ["Mon", "Tue", "Thu", "Fri"],
    photo_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80",
    bio:
      "Dr. Mishra leads our cath lab and runs a weekly rural-outreach clinic in Gopiganj. Special interest in hypertension management and preventive cardiology for patients above 40.",
    rating: 4.9,
    consultations: 14200,
  },
  {
    id: 2,
    name: "Dr. Rakesh Tripathi",
    specialization: "Orthopaedic Surgeon",
    department: "Orthopaedics",
    qualification: "MBBS, MS (Orthopaedics) — BHU Varanasi",
    experience_years: 22,
    consultation_fee: 700,
    languages: ["Hindi", "English"],
    available_days: ["Mon", "Wed", "Fri", "Sat"],
    photo_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&auto=format&fit=crop&q=80",
    bio:
      "Performs 600+ joint replacement surgeries annually. Known across Bhadohi and Mirzapur for his carpet-weaver hand reconstruction work.",
    rating: 4.8,
    consultations: 18900,
  },
  {
    id: 3,
    name: "Dr. Priya Srivastava",
    specialization: "Consultant — OBGY",
    department: "Gynaecology",
    qualification: "MBBS, MS (Obstetrics & Gynaecology)",
    experience_years: 14,
    consultation_fee: 600,
    languages: ["Hindi", "English", "Awadhi"],
    available_days: ["Tue", "Wed", "Thu", "Sat"],
    photo_url: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&auto=format&fit=crop&q=80",
    bio:
      "High-risk pregnancy specialist. Runs our free anaemia-screening camp for expecting mothers every second Saturday.",
    rating: 4.9,
    consultations: 9800,
  },
  {
    id: 4,
    name: "Dr. Imran Ahmed",
    specialization: "Consultant Paediatrician",
    department: "Paediatrics",
    qualification: "MBBS, MD (Paediatrics) — AMU Aligarh",
    experience_years: 11,
    consultation_fee: 500,
    languages: ["Hindi", "English", "Urdu"],
    available_days: ["Mon", "Tue", "Wed", "Fri", "Sat"],
    photo_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80",
    bio:
      "Vaccination-schedule expert. Warm with kids — our youngest patients usually ask for him by name.",
    rating: 4.9,
    consultations: 12100,
  },
  {
    id: 5,
    name: "Dr. Vikram Yadav",
    specialization: "General & Laparoscopic Surgeon",
    department: "General Surgery",
    qualification: "MBBS, MS (General Surgery), FMAS",
    experience_years: 16,
    consultation_fee: 750,
    languages: ["Hindi", "English", "Bhojpuri"],
    available_days: ["Mon", "Thu", "Fri", "Sat"],
    photo_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80",
    bio:
      "Performs minimally-invasive gallbladder, hernia, and appendix surgeries. Most patients go home within 24 hours.",
    rating: 4.7,
    consultations: 10400,
  },
  {
    id: 6,
    name: "Dr. Neha Agarwal",
    specialization: "Dermatologist & Cosmetologist",
    department: "Dermatology",
    qualification: "MBBS, MD (Dermatology, Venereology & Leprosy)",
    experience_years: 9,
    consultation_fee: 600,
    languages: ["Hindi", "English"],
    available_days: ["Mon", "Wed", "Fri"],
    photo_url: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&auto=format&fit=crop&q=80",
    bio:
      "Chemical peels, chronic eczema, hair-fall, and skin-allergy specialist. Morning slots fill up within hours.",
    rating: 4.8,
    consultations: 6700,
  },
  {
    id: 7,
    name: "Dr. Sanjay Pandey",
    specialization: "ENT Surgeon",
    department: "ENT",
    qualification: "MBBS, MS (ENT) — SGPGI Lucknow",
    experience_years: 20,
    consultation_fee: 700,
    languages: ["Hindi", "English"],
    available_days: ["Tue", "Thu", "Sat"],
    photo_url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&auto=format&fit=crop&q=80",
    bio:
      "Endoscopic sinus and microscopic ear surgeries. Handles Bhadohi district's highest referral volume.",
    rating: 4.7,
    consultations: 13500,
  },
  {
    id: 8,
    name: "Dr. Shalini Verma",
    specialization: "Consultant Physician — Diabetes",
    department: "General Medicine",
    qualification: "MBBS, MD (General Medicine)",
    experience_years: 13,
    consultation_fee: 500,
    languages: ["Hindi", "English"],
    available_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    bio:
      "Runs our diabetes day-care programme. Free glucose monitoring for patients enrolled in long-term care.",
    rating: 4.8,
    consultations: 15200,
  },
];

const makeBeds = (prefix: string, total: number, occupiedCount: number): Bed[] =>
  Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    bed_number: `${prefix}-${String(i + 1).padStart(2, "0")}`,
    is_occupied: i < occupiedCount,
  }));

export const MOCK_WARDS: Ward[] = [
  {
    id: 1,
    name: "Emergency / Casualty",
    type: "emergency",
    description:
      "24×7 triage, trauma bay, and two resuscitation beds. Nearest ambulance reaches within 12 minutes across Bhadohi municipality.",
    daily_charge: 0,
    amenities: ["Trauma ready", "24×7 doctor", "Defibrillator", "Ambulance bay"],
    total_beds: 8,
    available_beds: 5,
    beds: makeBeds("EM", 8, 3),
  },
  {
    id: 2,
    name: "Intensive Care Unit (ICU)",
    type: "icu",
    description:
      "Critical care with ventilators, cardiac monitors, and 1:1 nursing. Our intensivist is present on-site 18 hours a day.",
    daily_charge: 8500,
    amenities: ["Ventilator", "Central monitoring", "Isolation bay", "1:1 Nursing"],
    total_beds: 10,
    available_beds: 2,
    beds: makeBeds("ICU", 10, 8),
  },
  {
    id: 3,
    name: "General Ward",
    type: "general",
    description:
      "Shared 6-bed ward for routine admissions. Nurse call-bell, oxygen points, and attendant seating by every bed.",
    daily_charge: 900,
    amenities: ["AC", "Oxygen outlet", "Nurse call", "Attendant chair"],
    total_beds: 24,
    available_beds: 11,
    beds: makeBeds("GW", 24, 13),
  },
  {
    id: 4,
    name: "Semi-Private Room",
    type: "semi-private",
    description:
      "Two-bed rooms with partition curtain, television, and an en-suite attached washroom. Popular for planned surgeries.",
    daily_charge: 1800,
    amenities: ["AC", "TV", "Attached washroom", "Attendant bed"],
    total_beds: 14,
    available_beds: 4,
    beds: makeBeds("SPR", 14, 10),
  },
  {
    id: 5,
    name: "Private Room",
    type: "private",
    description:
      "Single occupancy with a recliner for family, mini-fridge, and daily housekeeping. Quiet wing away from the OPD traffic.",
    daily_charge: 3200,
    amenities: ["AC", "TV", "Fridge", "Attendant recliner", "Wi-Fi"],
    total_beds: 12,
    available_beds: 6,
    beds: makeBeds("PR", 12, 6),
  },
  {
    id: 6,
    name: "Deluxe Suite",
    type: "deluxe",
    description:
      "Suite with a private waiting area for family, premium bedding, and a dedicated care coordinator during your stay.",
    daily_charge: 5500,
    amenities: ["Suite layout", "Sofa", "Fridge", "Wi-Fi", "Care coordinator", "Meal service"],
    total_beds: 4,
    available_beds: 3,
    beds: makeBeds("DX", 4, 1),
  },
  {
    id: 7,
    name: "Maternity Ward",
    type: "semi-private",
    description:
      "Mother-and-baby care with lactation support, a paediatrician on call, and adjoining NICU access when needed.",
    daily_charge: 2200,
    amenities: ["NICU access", "Lactation support", "Baby cot", "24×7 Paediatrician"],
    total_beds: 10,
    available_beds: 4,
    beds: makeBeds("MAT", 10, 6),
  },
];

export const MOCK_STATS = {
  doctors: 24,
  beds: 82,
  departments: 14,
  years_serving: 17,
  patients_served_yearly: 48000,
  surgeries_yearly: 3200,
};

export const DEPARTMENTS = [
  "Cardiology",
  "Orthopaedics",
  "Gynaecology",
  "Paediatrics",
  "General Surgery",
  "Dermatology",
  "ENT",
  "General Medicine",
];
