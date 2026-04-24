import { Request, Response, NextFunction } from 'express';

export const requireRole = (role: 'admin' | 'agent') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if ((req as any).user.role !== role && (req as any).user.role !== 'admin') { // Admins can do anything
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};
