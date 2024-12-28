'use client';
import { useState, useEffect } from 'react';

interface PlayerSample {
  uuid: string;
  name: string;
}

interface ServerStatus {
  online: boolean;
  server: {
    name: string;
    protocol: number;
  };
  players: {
    max: number;
    now: number;
    sample: PlayerSample[];
  };
  motd: string;
  motd_json: string;
}

export default function PlayerListPage() {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/minecraft');
        const data = await response.json();
        setServerStatus(data);
      } catch (error) {
        console.error('Fehler beim Laden der Spielerliste:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Lade Spielerliste...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Spielerliste</h1>
        
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
          {/* Server Info */}
          <div className="mb-8 text-center">
            <div className="text-gray-400 mb-2">Server Version</div>
            <div className="text-white mb-4">{serverStatus?.server.name}</div>
            <div className="text-2xl text-white">
              {serverStatus?.players.now || 0} / {serverStatus?.players.max || 0} Spieler Online
            </div>
          </div>

          {/* Players List */}
          <div className="grid gap-4">
            {serverStatus?.players.sample && serverStatus.players.sample.length > 0 ? (
              serverStatus.players.sample.map((player) => (
                <div 
                  key={player.uuid} 
                  className="bg-gray-700 rounded-lg p-4 flex items-center space-x-4"
                >
                  <img 
                    src={`https://crafatar.com/avatars/${player.uuid}?size=48&overlay`}
                    alt={`${player.name}'s Avatar`}
                    className="w-12 h-12 rounded"
                  />
                  <span className="text-white text-lg">{player.name}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                Keine Spieler online
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Aktualisieren
          </button>
        </div>
      </div>
    </div>
  );
} 