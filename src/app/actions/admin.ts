'use server'

import { createPool } from 'mysql2/promise';
import { ApiResponse } from '@/types/api';

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function deleteEntry(id: number): Promise<ApiResponse> {
  try {
    await pool.execute('DELETE FROM grieflist WHERE id = ?', [id]);
    return {
      success: true,
      message: 'Eintrag gelöscht'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Fehler beim Löschen'
    };
  }
}

export async function updateEntry(id: number, data: any): Promise<ApiResponse> {
  try {
    const { minecraft_name, consents } = data;

    await pool.execute(
      `UPDATE grieflist SET 
        minecraft_name = ?,
        pvp = ?,
        griefing = ?,
        stealing = ?,
        trapping = ?,
        pet_killing = ?,
        nothing_allowed = ?,
        last_updated = NOW()
      WHERE id = ?`,
      [
        minecraft_name,
        consents.pvp ? 1 : 0,
        consents.griefing ? 1 : 0,
        consents.stealing ? 1 : 0,
        consents.trapping ? 1 : 0,
        consents.petKilling ? 1 : 0,
        consents.nothingAllowed ? 1 : 0,
        id
      ]
    );

    return {
      success: true,
      message: 'Eintrag aktualisiert'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Fehler beim Aktualisieren'
    };
  }
} 