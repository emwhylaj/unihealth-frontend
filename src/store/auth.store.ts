import { create } from "zustand";
import type { AuthState, AuthResponse } from "@/types";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,   // true once initFromStorage has run on the client
  hasProfile: false,
  profileName: null,

  setProfileName: (name: string) => set({ profileName: name }),

  setAuth: (data: AuthResponse) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Keep the cookie in sync for middleware
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=86400`;
    }
    set({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
      isAuthenticated: true,
      isInitialized: true,
    });
  },

  setHasProfile: (value: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hasProfile", value ? "true" : "false");
    }
    set({ hasProfile: value });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("hasProfile");
      document.cookie = "accessToken=; path=/; max-age=0";
    }
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isInitialized: true,
      hasProfile: false,
      profileName: null,
    });
  },

  initFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const userStr = localStorage.getItem("user");
      const hasProfile = localStorage.getItem("hasProfile") === "true";
      const user = userStr ? JSON.parse(userStr) : null;

      if (accessToken && user) {
        set({ accessToken, refreshToken, user, isAuthenticated: true, isInitialized: true, hasProfile });
      } else {
        // No valid session — clear any stale cookie
        document.cookie = "accessToken=; path=/; max-age=0";
        set({ isAuthenticated: false, isInitialized: true });
      }
    } catch {
      document.cookie = "accessToken=; path=/; max-age=0";
      set({ isAuthenticated: false, isInitialized: true });
    }
  },
}));
