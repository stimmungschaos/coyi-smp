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

interface WhitelistEntry {
  uuid: string;
  name: string;
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as WhitelistEntry[];
    
    // Validiere die Daten
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { message: 'Ungültiges Datenformat' },
        { status: 400 }
      );
    }

    // Überprüfe, ob alle erforderlichen Felder vorhanden sind
    const isValid = data.every(entry => 
      typeof entry.uuid === 'string' && 
      typeof entry.name === 'string'
    );

    if (!isValid) {
      return NextResponse.json(
        { message: 'Ungültige Einträge in den Daten' },
        { status: 400 }
      );
    }

    // Füge die Daten in die Datenbank ein
    const values = data.map(entry => [entry.name, null, entry.uuid]);
    const [result] = await pool.execute(
      'INSERT INTO whitelist (minecraft_name, discord_name, minecraft_uuid) VALUES ?',
      [values]
    );

    return NextResponse.json({ 
      message: 'Whitelist erfolgreich importiert',
      success: true 
    });

  } catch (error) {
    console.error('Whitelist Import Error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
} 