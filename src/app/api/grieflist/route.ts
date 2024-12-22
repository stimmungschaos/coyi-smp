import { NextResponse } from 'next/server';
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

// Hilfsfunktion um zu prüfen ob heute der Update-Tag ist
function isUpdateDay(): boolean {
  const today = new Date();
  return today.getDay() === 5; // 5 = Freitag
}

// Gleiche Hash-Funktion wie in der Submit-Route
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT).digest('hex');
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Nicht angemeldet' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { minecraft_name: string };
      const minecraftName = decoded.minecraft_name;
      
      const body = await request.json();
      const { consents } = body;

      if (!minecraftName) {
        return NextResponse.json(
          { error: 'Bitte gib deinen Minecraft Namen ein.' },
          { status: 400 }
        );
      }

      const formattedMinecraft = minecraftName.trim();

      // Prüfe ob der Eintrag bereits existiert
      const [existing] = await pool.execute(
        'SELECT id, ip_hash FROM grieflist WHERE minecraft_name = ?',
        [formattedMinecraft]
      );

      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const hashedIP = hashIP(ip);

      // Wenn es ein Update ist
      if ((existing as any[]).length > 0) {
        const entry = (existing as any[])[0];
        
        // Prüfe ob der User berechtigt ist, diesen Eintrag zu bearbeiten
        if (entry.ip_hash !== hashedIP) {
          return NextResponse.json(
            { error: 'Du kannst nur deinen eigenen Eintrag bearbeiten.' },
            { status: 403 }
          );
        }

        // Wenn Consents gesendet wurden, ist es ein Update
        if (consents) {
          // Prüfe ob heute der Update-Tag ist
          if (!isUpdateDay()) {
            return NextResponse.json(
              { error: 'Updates sind nur freitags möglich.' },
              { status: 400 }
            );
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
              formattedMinecraft,
              hashedIP // Zusätzliche Sicherheit: Nur der eigene Eintrag kann bearbeitet werden
            ]
          );

          return NextResponse.json({ 
            message: 'Deine Einstellungen wurden aktualisiert!' 
          });
        }
        
        // Bei Login: Prüfe ob es der eigene Eintrag ist
        if (entry.ip_hash !== hashedIP) {
          return NextResponse.json(
            { error: 'Du kannst dich nur mit deinem eigenen Account einloggen.' },
            { status: 403 }
          );
        }

        return NextResponse.json({ 
          message: 'Erfolgreich angemeldet' 
        });
      }

      // Bei Neuregistrierung - immer erlaubt
      await pool.execute(
        `INSERT INTO grieflist (
          minecraft_name, 
          pvp,
          griefing,
          stealing,
          trapping,
          pet_killing,
          nothing_allowed,
          last_updated,
          ip_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
        [
          formattedMinecraft,
          consents.pvp ? 1 : 0,
          consents.griefing ? 1 : 0,
          consents.stealing ? 1 : 0,
          consents.trapping ? 1 : 0,
          consents.petKilling ? 1 : 0,
          consents.nothingAllowed ? 1 : 0,
          hashedIP
        ]
      );

      const response = NextResponse.json({ 
        message: 'Dein Eintrag wurde erfolgreich hinzugefügt!' 
      });

      return response;
    } catch {
      return NextResponse.json(
        { error: 'Ungültiger Token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Grieflist Fehler:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        minecraft_name,
        pvp,
        griefing,
        stealing,
        trapping,
        pet_killing as petKilling,
        nothing_allowed as nothingAllowed,
        last_updated
      FROM grieflist
      ORDER BY last_updated DESC
    `);

    const entries = (rows as any[]).map(row => ({
      id: row.id,
      minecraft_name: row.minecraft_name,
      consents: {
        pvp: Boolean(row.pvp),
        griefing: Boolean(row.griefing),
        stealing: Boolean(row.stealing),
        trapping: Boolean(row.trapping),
        petKilling: Boolean(row.petKilling),
        nothingAllowed: Boolean(row.nothingAllowed)
      },
      last_updated: row.last_updated
    }));

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Fehler beim Laden der Einträge:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Einträge' },
      { status: 500 }
    );
  }
} 