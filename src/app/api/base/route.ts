import { NextResponse } from 'next/server';

const BASE_COORDINATES = {
  x: 8.230000,
  y: 68.000000,
  z: -847.658000
};

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Ungültiges Passwort' }, { status: 401 });
    }

    return NextResponse.json(BASE_COORDINATES);
  } catch (error) {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
} 