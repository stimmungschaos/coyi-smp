'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitWhitelist } from '../actions/whitelist';
import { ApiResponse } from '@/types/api';

export default function WhitelistPage() {
  const [minecraftName, setMinecraftName] = useState('');
  const [discordName, setDiscordName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cookieAccepted) {
      setError('Bitte akzeptiere die Cookie-Nutzung');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await submitWhitelist({
        minecraftName,
        discordName,
        ipAddress: window.location.hostname
      });

      if (result.success) {
        setSuccess(result.message);
        setMinecraftName('');
        setDiscordName('');
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError('Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Whitelist Antrag</h1>
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-4">{error}</div>}
        {success && <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded-lg mb-4">{success}</div>}
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="minecraft" className="block text-gray-300 mb-2">Minecraft Username</label>
              <input
                type="text"
                id="minecraft"
                value={minecraftName}
                onChange={(e) => setMinecraftName(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
                placeholder="Dein Minecraft Username"
              />
            </div>
            <div>
              <label htmlFor="discord" className="block text-gray-300 mb-2">Discord Username</label>
              <input
                type="text"
                id="discord"
                value={discordName}
                onChange={(e) => setDiscordName(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
                placeholder="Dein Discord Username (z.B. username#1234)"
              />
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cookie-consent"
                  checked={cookieAccepted}
                  onChange={(e) => setCookieAccepted(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="cookie-consent">
                  Ich akzeptiere, dass ein Cookie gesetzt wird, um doppelte Einträge zu verhindern. 
                  Dieses Cookie enthält keine persönlichen Daten und wird für 30 Tage gespeichert.
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !cookieAccepted}
              className={`w-full bg-green-600 text-white py-3 rounded-lg font-medium 
                ${(loading || !cookieAccepted) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'} 
                transition-colors`}
            >
              {loading ? 'Wird bearbeitet...' : 'Whitelist beantragen'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 