import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export function hashIP(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + process.env.COOKIE_SECRET)
    .digest('hex');
}

export function generateToken(payload: any, expiresIn: string = '7d') {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

export function verifyAdminToken(token: string): boolean {
  const decoded = verifyToken(token);
  return decoded?.role === 'admin';
} 