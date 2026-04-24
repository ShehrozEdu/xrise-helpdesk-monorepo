import { User } from '../models/user.model';
import { LoginInput } from '../shared';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export class AuthService {
  static async login(data: LoginInput) {
    const user = await User.findOne({ email: data.email.toLowerCase() });
    if (!user) throw { statusCode: 401, message: 'Invalid credentials' };

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) throw { statusCode: 401, message: 'Invalid credentials' };

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  static async getMe(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) throw { statusCode: 404, message: 'User not found' };
    return user;
  }
}
