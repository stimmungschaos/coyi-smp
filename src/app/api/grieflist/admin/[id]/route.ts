import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
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
    await pool.execute('DELETE FROM grieflist WHERE id = ?', [params.id]);
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
    const { minecraft_name, consents } = await request.json();

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
        params.id
      ]
    );

    return NextResponse.json({ message: 'Eintrag aktualisiert' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Fehler beim Aktualisieren' },
      { status: 500 }
    );
  }
} 