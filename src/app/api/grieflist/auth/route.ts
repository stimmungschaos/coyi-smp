import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { username, role: 'admin' },
        JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return NextResponse.json({ 
        authenticated: true,
        token 
      });
    }

    return NextResponse.json(
      { message: 'Ungültige Anmeldedaten' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
} 