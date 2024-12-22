'use server'

import jwt from 'jsonwebtoken';
import { AuthResponse } from '@/types/api';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

export async function adminLogin(credentials: { 
  username: string; 
  password: string;
}): Promise<AuthResponse> {
  try {
    const { username, password } = credentials;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { username, role: 'admin' },
        JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return { 
        success: true,
        token 
      };
    }

    return {
      success: false,
      error: 'Ungültige Anmeldedaten'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten'
    };
  }
} 