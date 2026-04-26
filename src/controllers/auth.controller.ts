import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/response';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, user } = await AuthService.login(req.body);
      
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // Always true for cross-site cookies
        sameSite: 'none', // Required for cross-site cookies
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
      });

      sendResponse(res, 200, true, 'Login successful', user);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie('jwt', '', { 
        httpOnly: true, 
        expires: new Date(0),
        secure: true,
        sameSite: 'none',
      });
      sendResponse(res, 200, true, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getMe((req as any).user!.userId);
      sendResponse(res, 200, true, 'User fetched', user);
    } catch (error) {
      next(error);
    }
  }
}
