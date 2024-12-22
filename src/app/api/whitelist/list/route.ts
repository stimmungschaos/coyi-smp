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



export async function GET() {
  try {
    const [rows] = await pool.execute(
      'SELECT id, minecraft_name, discord_name, created_at FROM whitelist ORDER BY id DESC'
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Whitelist List Error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
} 
