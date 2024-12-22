'use server'

import { createPool } from 'mysql2/promise';
import crypto from 'crypto';
import { cookies } from 'next/headers';

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

export async function submitWhitelist(formData: { 
  minecraftName: string, 
  discordName: string,
  ipAddress: string 
}) {
  const { minecraftName, discordName, ipAddress } = formData;
  const ipHash = hashIP(ipAddress);
  
  // Prüfe den Cookie
  const cookieStore = cookies();
  const existingHash = cookieStore.get('whitelist_hash')?.value;

  if (existingHash === ipHash) {
    return {
      success: false,
      error: 'Du hast bereits einen Whitelist-Eintrag erstellt.'
    };
  }

  try {
    // Füge neuen Eintrag hinzu
    await pool.execute(
      'INSERT INTO whitelist (minecraft_name, discord_name) VALUES (?, ?)',
      [minecraftName, discordName]
    );

    // Setze Cookie
    cookieStore.set('whitelist_hash', ipHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 Tage
      path: '/'
    });

    return {
      success: true,
      message: 'Erfolgreich zur Whitelist hinzugefügt'
    };
  } catch (error) {
    console.error('Whitelist Fehler:', error);
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten'
    };
  }
} 