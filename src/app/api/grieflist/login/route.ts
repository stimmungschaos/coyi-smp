import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT).digest('hex');
}

export async function POST(request: Request) {
  try {
    const { minecraft_name } = await request.json();
    
    // Prüfe ob der Spieler existiert
    const [rows] = await pool.execute(
      'SELECT id, ip_hash FROM grieflist WHERE minecraft_name = ?',
      [minecraft_name]
    );

    const exists = (rows as any[]).length > 0;
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const hashedIP = hashIP(ip);

    if (exists) {
      // Prüfe ob die IP übereinstimmt
      const entry = (rows as any[])[0];
      if (entry.ip_hash !== hashedIP) {
        return NextResponse.json(
          { error: 'Du kannst dich nur von dem Gerät anmelden, von dem aus du dich registriert hast.' },
          { status: 403 }
        );
      }

      // Wenn der User existiert und die IP stimmt
      const token = jwt.sign(
        { minecraft_name },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return NextResponse.json({ token, isNewUser: false });
    }

    // Wenn es ein komplett neuer User ist
    const token = jwt.sign(
      { minecraft_name },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return NextResponse.json({ token, isNewUser: true });
  } catch (error) {
    console.error('Login Fehler:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
} 