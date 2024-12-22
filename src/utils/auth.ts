import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export function hashIP(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + process.env.COOKIE_SECRET)
    .digest('hex');
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    return decoded.role === 'admin';
  } catch {
    return false;
  }
} 