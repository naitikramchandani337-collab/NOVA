// src/services/authService.ts
import { api } from './api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserInfo {
  id: string;
  email: string;
  username: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/login', { email, password });
    return response.data;
  },

  async register(email: string, username: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/register', {
      email,
      username,
      password,
    });
    return response.data;
  },

  async getMe(): Promise<UserInfo> {
    const response = await api.get<UserInfo>('/api/auth/me');
    return response.data;
  },
};
