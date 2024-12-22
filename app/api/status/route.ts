import { NextResponse } from 'next/server';

// Verwenden Sie MINECRAFT_SERVER_IP anstelle von MC_SERVER_IP
const SERVER_IP = process.env.MINECRAFT_SERVER_IP;

export async function GET() {
  if (!SERVER_IP) {
    return NextResponse.json(
      { error: 'Server IP nicht konfiguriert' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
    const data = await response.json();
    
    return NextResponse.json({
      online: data.online,
      players: data.players,
      version: data.version,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Abrufen des Server-Status' },
      { status: 500 }
    );
  }
} 