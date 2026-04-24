import { api } from './api';

export interface AnalyticsStats {
  byStatus: { label: string; value: number }[];
  byPriority: { label: string; value: number }[];
  trend: { date: string; count: number }[];
  avgResponseTimeHours: number;
}

export const analyticsApi = {
  getStats: (): Promise<AnalyticsStats> => api.get('/analytics/stats'),
};
