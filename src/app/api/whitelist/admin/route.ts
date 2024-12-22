import { NextResponse } from 'next/server';
import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function POST(request: Request) {
  try {
    const { minecraft_name, discord_name } = await request.json();
    
    const [result] = await pool.execute(
      'INSERT INTO whitelist (minecraft_name, discord_name) VALUES (?, ?)',
      [minecraft_name, discord_name]
    );

    // Hole den neu erstellten Eintrag für die Rückgabe
    const [newEntry] = await pool.execute(
      'SELECT id, minecraft_name, discord_name, created_at FROM whitelist WHERE id = ?',
      [(result as any).insertId]
    );

    return NextResponse.json((newEntry as any)[0]);
  } catch (error) {
    return NextResponse.json(
      { message: 'Fehler beim Hinzufügen' },
      { status: 500 }
    );
  }
} 