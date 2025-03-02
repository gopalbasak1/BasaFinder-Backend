import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: string;
        role: 'admin' | 'landlord' | 'tenant';
        email?: string;
        phoneNumber?: string;
      };
    }
  }
}
