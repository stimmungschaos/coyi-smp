'use server'

import { cookies } from 'next/headers';
import mysql from 'mysql2/promise';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ApiResponse, GrieflistEntry } from '@/types/api';
import { isUpdateDay } from '@/utils/dates';

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
  return crypto.createHash('sha256')
    .update(ip + process.env.IP_SALT)
    .digest('hex');
}

export async function submitGrieflist(data: {
  minecraft_name: string;
  consents: any;
  ipAddress: string;
}): Promise<ApiResponse> {
  const { minecraft_name, consents } = data;
  
  // Hole IP-Hash aus dem Cookie
  const cookieStore = cookies();
  const ipHashCookie = cookieStore.get('grieflist_hash');
  
  if (!ipHashCookie?.value) {
    // Wenn kein Cookie existiert, erstelle einen neuen Hash und setze Cookie
    const hashedIP = hashIP(data.ipAddress);
    cookieStore.set('grieflist_hash', hashedIP, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60, // 1 Jahr
      path: '/'
    });
  }

  const ipHash = ipHashCookie?.value || hashIP(data.ipAddress);

  try {
    const [existingRows] = await pool.execute(
      'SELECT id FROM grieflist WHERE minecraft_name = ?',
      [minecraft_name]
    );
    const exists = (existingRows as any[]).length > 0;

    if (exists) {
      if (!isUpdateDay()) {
        return {
          success: false,
          error: 'Updates sind nur freitags möglich.'
        };
      }

      await pool.execute(
        `UPDATE grieflist SET 
          pvp = ?,
          griefing = ?,
          stealing = ?,
          trapping = ?,
          pet_killing = ?,
          nothing_allowed = ?,
          last_updated = NOW()
        WHERE minecraft_name = ? AND ip_hash = ?`,
        [
          consents.pvp ? 1 : 0,
          consents.griefing ? 1 : 0,
          consents.stealing ? 1 : 0,
          consents.trapping ? 1 : 0,
          consents.petKilling ? 1 : 0,
          consents.nothingAllowed ? 1 : 0,
          minecraft_name,
          ipHash
        ]
      );

      return {
        success: true,
        message: 'Deine Einstellungen wurden aktualisiert!'
      };
    } else {
      await pool.execute(
        `INSERT INTO grieflist 
          (minecraft_name, ip_hash, pvp, griefing, stealing, trapping, pet_killing, nothing_allowed) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          minecraft_name, 
          ipHash,
          consents.pvp ? 1 : 0,
          consents.griefing ? 1 : 0,
          consents.stealing ? 1 : 0,
          consents.trapping ? 1 : 0,
          consents.petKilling ? 1 : 0,
          consents.nothingAllowed ? 1 : 0
        ]
      );

      return {
        success: true,
        message: 'Erfolgreich registriert!'
      };
    }
  } catch (error) {
    console.error('Grieflist Error:', error);
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten'
    };
  }
}

export async function getGrieflist(): Promise<ApiResponse<GrieflistEntry[]>> {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM grieflist ORDER BY last_updated DESC'
    );

    // Formatiere die Daten korrekt
    const formattedEntries = (rows as any[]).map(row => ({
      id: row.id,
      minecraft_name: row.minecraft_name,
      last_updated: row.last_updated,
      consents: {
        pvp: Boolean(row.pvp),
        griefing: Boolean(row.griefing),
        stealing: Boolean(row.stealing),
        trapping: Boolean(row.trapping),
        petKilling: Boolean(row.pet_killing),
        nothingAllowed: Boolean(row.nothing_allowed)
      }
    }));

    return {
      success: true,
      data: formattedEntries
    };
  } catch (error) {
    console.error('Grieflist Error:', error);
    return {
      success: false,
      error: 'Fehler beim Laden der Liste'
    };
  }
}

export async function loginGrieflist(data: {
  minecraft_name: string;
  ipAddress: string;
}): Promise<ApiResponse> {
  const { minecraft_name } = data;
  
  // Hole IP-Hash aus dem Cookie
  const cookieStore = cookies();
  const ipHashCookie = cookieStore.get('grieflist_hash');
  
  if (!ipHashCookie?.value) {
    return {
      success: false,
      error: 'Bitte registriere dich zuerst.'
    };
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, ip_hash FROM grieflist WHERE minecraft_name = ?',
      [minecraft_name]
    );

    const exists = (rows as any[]).length > 0;

    if (exists) {
      const entry = (rows as any[])[0];
      if (entry.ip_hash !== ipHashCookie.value) {
        return {
          success: false,
          error: 'Du kannst dich nur von dem Gerät anmelden, von dem aus du dich registriert hast.'
        };
      }
    }

    const token = jwt.sign(
      { minecraft_name },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return {
      success: true,
      data: { token, isNewUser: !exists }
    };
  } catch (error) {
    console.error('Login Fehler:', error);
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten.'
    };
  }
} 