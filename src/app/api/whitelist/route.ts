import { NextResponse } from 'next/server';
import { createPool } from 'mysql2/promise';
import crypto from 'crypto';

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Funktion zum Hashen der IP
function hashIP(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + process.env.COOKIE_SECRET)
    .digest('hex');
}

export async function POST(request: Request) {
  const { minecraftName, discordName } = await request.json();
  const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
  const ipHash = hashIP(ipAddress);
  
  // Prüfe den Cookie
  const cookies = request.headers.get('cookie');
  const whitelistCookie = cookies?.split(';').find(c => c.trim().startsWith('whitelist_hash='));
  const existingHash = whitelistCookie?.split('=')[1];

  if (existingHash === ipHash) {
    return NextResponse.json(
      { message: 'Du hast bereits einen Whitelist-Eintrag erstellt.' },
      { status: 409 }
    );
  }

  // Füge neuen Eintrag hinzu
  await pool.execute(
    'INSERT INTO whitelist (minecraft_name, discord_name) VALUES (?, ?)',
    [minecraftName, discordName]
  );

  // Erstelle Response mit Cookie
  const response = NextResponse.json({ message: 'Erfolgreich zur Whitelist hinzugefügt' });
  
  // Setze Cookie mit 30 Tagen Gültigkeit
  response.cookies.set('whitelist_hash', ipHash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60, // 30 Tage
    path: '/'
  });

  return response;
} 