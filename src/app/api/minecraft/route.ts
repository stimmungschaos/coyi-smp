import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Implementierung der Minecraft-Server-Abfrage
    const data = {
      online: true, // Beispieldaten
      server: {
        name: "Paper 1.20.4",
        protocol: 765
      },
      players: {
        max: 20,
        now: 0,
        sample: []
      },
      motd: "Willkommen beim coyi SMP",
      motd_json: "Willkommen beim coyi SMP"
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Fehler bei der Server-Abfrage:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 