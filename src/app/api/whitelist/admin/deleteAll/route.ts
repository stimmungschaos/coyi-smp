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

export async function DELETE(request: Request) {
  try {
    const { condition, field } = await request.json();

    // Validiere die erlaubten Felder
    const allowedFields = ['minecraft_name', 'discord_name', 'created_at'];
    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { message: 'Ungültiges Feld für die Bedingung' },
        { status: 400 }
      );
    }

    // Führe das DELETE mit dem spezifizierten Feld aus
    const [result] = await pool.execute(
      `DELETE FROM whitelist WHERE ${field} LIKE ?`,
      [`%${condition}%`]
    );

    const typedResult = result as { affectedRows: number };
    
    return NextResponse.json({ 
      message: `${typedResult.affectedRows} Einträge wurden gelöscht.`,
      deletedCount: typedResult.affectedRows
    });
  } catch (error) {
    console.error('Fehler beim Löschen der Einträge:', error);
    return NextResponse.json(
      { message: 'Fehler beim Löschen der Einträge' },
      { status: 500 }
    );
  }
} 