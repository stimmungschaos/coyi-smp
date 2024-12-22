'use server'

import { ApiResponse } from '@/types/api';

export async function getServerStatus(): Promise<ApiResponse> {
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

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Fehler bei der Server-Abfrage'
    };
  }
} 