'use client';
import { useState, useEffect } from 'react';

interface ServerStatus {
  online: boolean;
  server: {
    name: string;
    protocol: number;
  };
  players: {
    max: number;
    now: number;
    sample: any[];
  };
  motd: string;
  motd_json: string;
}

// Neue Hilfsfunktion zur Überprüfung des Release-Status
function isServerReleased(): boolean {
  const releaseDate = new Date('2024-12-27T00:00:00');
  const now = new Date();
  return now >= releaseDate;
}

export default function StatusPage() {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/minecraft');
        const data = await response.json();
        
        const formattedData = {
          online: data.online,
          server: {
            name: data.server?.name || 'Unknown',
            protocol: data.server?.protocol || 0
          },
          players: {
            max: data.players?.max || 0,
            now: data.players?.now || 0,
            sample: data.players?.sample || []
          },
          motd: data.motd || '',
          motd_json: data.motd_json || ''
        };
        
        setServerStatus(formattedData);
      } catch (error) {
        console.error('Fehler beim Laden des Server-Status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // IP-Anzeige Komponente
  const ServerIPDisplay = () => {
    if (!isServerReleased()) {
      return (
        <div className="border-b border-gray-700 pb-4">
          <h2 className="text-lg text-gray-400 mb-2">Server IP</h2>
          <div className="flex items-center space-x-2">
            <p className="text-gray-500 italic">Wird am 27.12.2024 enthüllt</p>
            <span className="animate-pulse text-yellow-500">
              <i className="fas fa-clock"></i>
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="border-b border-gray-700 pb-4">
        <h2 className="text-lg text-gray-400 mb-2">Server IP</h2>
        <p className="text-white">minecraft.chaosly.de</p>
      </div>
    );
  };

  // IP-Kopier-Button Komponente
  const CopyIPButton = () => {
    if (!isServerReleased()) {
      return null; // Button wird nicht angezeigt vor Release
    }

    return (
      <button
        onClick={() => {
          navigator.clipboard.writeText('minecraft.chaosly.de');
          alert('Server IP kopiert!');
        }}
        className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
      >
        <i className="fas fa-copy mr-2"></i>
        IP kopieren
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Lade Server-Status...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Server Status</h1>
        
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
          {/* Status Indicator */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl text-white">Server Status</span>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${serverStatus?.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`${serverStatus?.online ? 'text-green-500' : 'text-red-500'}`}>
                {serverStatus?.online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Server Info */}
          <div className="grid gap-6">
            <div className="border-b border-gray-700 pb-4">
              <h2 className="text-lg text-gray-400 mb-2">Server Version</h2>
              <p className="text-white">{serverStatus?.server.name}</p>
            </div>

            <div className="border-b border-gray-700 pb-4">
              <h2 className="text-lg text-gray-400 mb-2">Spieler Online</h2>
              <p className="text-white">
                {serverStatus?.players.now} / {serverStatus?.players.max}
              </p>
            </div>

            <ServerIPDisplay />

            <div className="border-b border-gray-700 pb-4">
              <h2 className="text-lg text-gray-400 mb-2">Server Description</h2>
              <p className="text-white whitespace-pre-line">
                {serverStatus?.motd_json 
                  ? "Willkommen beim coyi SMP"
                  : 'Keine Nachricht verfügbar'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="https://discord.gg/3r9uytYK8c"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#5865F2] text-white px-6 py-3 rounded-lg hover:bg-[#4752C4] transition-colors"
          >
            <i className="fab fa-discord mr-2"></i>
            Discord beitreten
          </a>
          <CopyIPButton />
        </div>
      </div>
    </div>
  );
} 