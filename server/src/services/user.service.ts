import { User } from '../models/user.model';

export class UserService {
  static async getAllUsers() {
    return User.find({}, '-password').sort({ name: 1 });
  }
}
