'use server'

import { createPool } from 'mysql2/promise';
import { ApiResponse, WhitelistEntry } from '@/types/api';

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function getWhitelistEntries(): Promise<ApiResponse<WhitelistEntry[]>> {
  try {
    const [rows] = await pool.execute(
      'SELECT id, minecraft_name, discord_name, created_at FROM whitelist ORDER BY id DESC'
    );

    return {
      success: true,
      data: rows as WhitelistEntry[]
    };
  } catch (error) {
    return {
      success: false,
      error: 'Fehler beim Laden der Liste'
    };
  }
}

export async function deleteWhitelistEntry(id: number): Promise<ApiResponse> {
  try {
    await pool.execute('DELETE FROM whitelist WHERE id = ?', [id]);
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

export async function updateWhitelistEntry(id: number, data: {
  minecraft_name: string;
  discord_name: string;
}): Promise<ApiResponse> {
  try {
    await pool.execute(
      'UPDATE whitelist SET minecraft_name = ?, discord_name = ? WHERE id = ?',
      [data.minecraft_name, data.discord_name, id]
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

export async function deleteWhitelistByCondition(data: {
  condition: string;
  field: 'minecraft_name' | 'discord_name' | 'created_at';
}): Promise<ApiResponse> {
  try {
    const { condition, field } = data;
    
    const [result] = await pool.execute(
      `DELETE FROM whitelist WHERE ${field} LIKE ?`,
      [`%${condition}%`]
    );

    const typedResult = result as { affectedRows: number };
    
    return {
      success: true,
      message: `${typedResult.affectedRows} Einträge wurden gelöscht.`,
      data: { deletedCount: typedResult.affectedRows }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Fehler beim Löschen der Einträge'
    };
  }
}

export async function reorderWhitelistIds(): Promise<ApiResponse> {
  try {
    // Temporäre Tabelle erstellen und Daten kopieren
    await pool.execute('CREATE TEMPORARY TABLE temp_whitelist SELECT minecraft_name, discord_name, created_at FROM whitelist ORDER BY id');
    
    // Originaltabelle leeren
    await pool.execute('TRUNCATE TABLE whitelist');
    
    // Daten mit neuen IDs zurück kopieren
    await pool.execute('INSERT INTO whitelist (minecraft_name, discord_name, created_at) SELECT minecraft_name, discord_name, created_at FROM temp_whitelist');
    
    // Temporäre Tabelle löschen
    await pool.execute('DROP TEMPORARY TABLE temp_whitelist');

    return {
      success: true,
      message: 'IDs wurden erfolgreich neu sortiert'
    };
  } catch (error) {
    console.error('Fehler beim Neusortieren:', error);
    return {
      success: false,
      error: 'Fehler beim Neusortieren der IDs'
    };
  }
} 