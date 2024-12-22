'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isUpdateDay } from '@/app/utils/dates';

interface Consents {
  pvp: boolean;
  griefing: boolean;
  stealing: boolean;
  trapping: boolean;
  petKilling: boolean;
  nothingAllowed: boolean;
}

interface GrieflistEntry {
  id: number;
  minecraft_name: string;
  consents: Consents;
  last_updated: string;
}

export default function GrieflistPage() {
  const [entries, setEntries] = useState<GrieflistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('grieflist_token');
    if (token) {
      // Token dekodieren um den Minecraft-Namen zu erhalten
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      setLoggedInUser(payload.minecraft_name);
    }
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('grieflist_token');
      const response = await fetch('/api/grieflist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Einträge:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderConsents = (consents: Consents) => {
    if (consents.nothingAllowed) {
      return (
        <span className="text-red-500">
          Erlaubt keine Aktionen (Friedlicher Spieler)
        </span>
      );
    }

    const allowedActions = [];
    if (consents.pvp) allowedActions.push('PvP');
    if (consents.griefing) allowedActions.push('Griefing');
    if (consents.stealing) allowedActions.push('Items klauen');
    if (consents.trapping) allowedActions.push('Trapping');
    if (consents.petKilling) allowedActions.push('Haustiere töten');

    return allowedActions.length > 0 ? (
      <div className="space-y-1">
        {allowedActions.map((action, index) => (
          <span key={index} className="inline-block bg-green-900/30 text-green-400 px-2 py-1 rounded mr-2 mb-2">
            {action}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-yellow-500">Keine Aktionen ausgewählt</span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Lade Griefliste...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white">Grief-Liste</h1>
          {loggedInUser && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  localStorage.removeItem('grieflist_token');
                  router.push('/grieflist/login');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
              >
                Abmelden
              </button>
            </div>
          )}
          {!loggedInUser && (
            <Link 
              href="/grieflist/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500"
            >
              Anmelden
            </Link>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-8">
          <div className="grid gap-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-white">
                      <span className="text-gray-400">Minecraft:</span> {entry.minecraft_name}
                      {entry.minecraft_name === loggedInUser && (
                        <span className="ml-2 text-blue-400 text-sm">(Du)</span>
                      )}
                    </p>
                    <div>
                      <p className="text-gray-400 mb-1">Erlaubte Aktionen:</p>
                      {renderConsents(entry.consents)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {entry.minecraft_name === loggedInUser && isUpdateDay() && (
                      <button
                        onClick={() => router.push('/grieflist/submit')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    )}
                    <span className="text-sm text-gray-400">
                      {new Date(entry.last_updated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 