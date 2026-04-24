import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { sendResponse } from '../utils/response';

export class AnalyticsController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AnalyticsService.getStats();
      sendResponse(res, 200, true, 'Analytics fetched', stats);
    } catch (error) {
      next(error);
    }
  }
}
