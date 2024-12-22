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
  const { minecraft_name, consents, ipAddress } = data;
  const hashedIP = hashIP(ipAddress);

  try {
    if (consents) {
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
          hashedIP
        ]
      );

      return {
        success: true,
        message: 'Deine Einstellungen wurden aktualisiert!'
      };
    }

    // Neuer Eintrag
    await pool.execute(
      `INSERT INTO grieflist 
        (minecraft_name, ip_hash) 
      VALUES (?, ?)`,
      [minecraft_name, hashedIP]
    );

    return {
      success: true,
      message: 'Erfolgreich registriert!'
    };
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

    return {
      success: true,
      data: rows as GrieflistEntry[]
    };
  } catch (error) {
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
  const { minecraft_name, ipAddress } = data;
  const hashedIP = hashIP(ipAddress);

  try {
    // Prüfe ob der Spieler existiert
    const [rows] = await pool.execute(
      'SELECT id, ip_hash FROM grieflist WHERE minecraft_name = ?',
      [minecraft_name]
    );

    const exists = (rows as any[]).length > 0;

    if (exists) {
      // Prüfe ob die IP übereinstimmt
      const entry = (rows as any[])[0];
      if (entry.ip_hash !== hashedIP) {
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