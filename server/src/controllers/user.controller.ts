import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendResponse } from '../utils/response';

export class UserController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      sendResponse(res, 200, true, 'Users fetched', users);
    } catch (error) {
      next(error);
    }
  }
}
