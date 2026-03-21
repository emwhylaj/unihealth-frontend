import apiClient from "./api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  GoogleAuthRequest,
  AppleAuthRequest,
  RefreshTokenRequest,
} from "@/types";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/login",
      data
    );
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/register",
      data
    );
    return response.data;
  },

  async loginWithGoogle(data: GoogleAuthRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/google",
      data
    );
    return response.data;
  },

  async loginWithApple(data: AppleAuthRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/apple",
      data
    );
    return response.data;
  },

  async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/refresh",
      data
    );
    return response.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post("/api/v1/auth/logout", { refreshToken });
  },
};
