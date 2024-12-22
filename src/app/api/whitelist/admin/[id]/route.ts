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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Hole die User-Daten vor dem Löschen
    const [entry] = await pool.execute(
      'SELECT minecraft_name, discord_name FROM whitelist WHERE id = ?',
      [params.id]
    );

    await pool.execute('DELETE FROM whitelist WHERE id = ?', [params.id]);

    return NextResponse.json({ message: 'Eintrag gelöscht' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Fehler beim Löschen' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { minecraft_name, discord_name } = await request.json();

    await pool.execute(
      'UPDATE whitelist SET minecraft_name = ?, discord_name = ? WHERE id = ?',
      [minecraft_name, discord_name, params.id]
    );

    return NextResponse.json({ message: 'Eintrag aktualisiert' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Fehler beim Aktualisieren' },
      { status: 500 }
    );
  }
} 