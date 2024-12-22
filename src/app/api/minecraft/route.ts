import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://mcapi.us/server/status?ip=minecraft.chaosly.de');
    const mcapiResult = await response.json();
    
    console.log('mcapi.us response:', mcapiResult);
    
    const data = {
      online: mcapiResult.online,
      server: {
        name: mcapiResult.server?.name || "Purpur 1.21.1",
        protocol: mcapiResult.server?.protocol || 767
      },
      players: {
        max: mcapiResult.players?.max || 75,
        now: mcapiResult.players?.now || 0,
        sample: mcapiResult.players?.sample || []
      },
      motd: mcapiResult.motd || "Willkommen beim coyi SMP",
      favicon: mcapiResult.favicon || ""
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Fehler bei der Server-Abfrage:', error);
    return NextResponse.json({
      online: false,
      server: {
        name: "Purpur 1.21.1",
        protocol: 767
      },
      players: {
        max: 75,
        now: 0,
        sample: []
      },
      motd: "Server offline",
      favicon: ""
    });
  }
} 