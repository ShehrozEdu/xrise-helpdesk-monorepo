import { api } from './api';
import type { UserResponse } from '@helpdesk/shared';

export const userApi = {
  getAll: (): Promise<UserResponse[]> => api.get('/users'),
};
