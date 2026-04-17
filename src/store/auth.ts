"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PatientUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role?: string;
};

type AuthState = {
  token: string | null;
  user: PatientUser | null;
  hydrated: boolean;
  setAuth: (token: string, user: PatientUser) => void;
  logout: () => void;
  markHydrated: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "hospitana-auth",
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);
