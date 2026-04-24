import { api } from './api';
import type { LoginInput, UserResponse } from '@helpdesk/shared';

export const authApi = {
  login: (data: LoginInput): Promise<UserResponse> => api.post('/auth/login', data),
  logout: (): Promise<void> => api.post('/auth/logout'),
  getMe: (): Promise<UserResponse> => api.get('/auth/me'),
};
