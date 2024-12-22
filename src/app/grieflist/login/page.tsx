'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GrieflistLoginPage() {
  const [minecraftName, setMinecraftName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/grieflist/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ minecraft_name: minecraftName }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('grieflist_token', data.token);
        // Wenn neuer Benutzer, zum Formular, sonst zur Übersicht
        router.push(data.isNewUser ? '/grieflist/submit' : '/grieflist/list');
      } else {
        setError(data.error || 'Login fehlgeschlagen');
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Mit Minecraft-Namen anmelden
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Gib deinen Minecraft-Namen ein, um deine Grief-Einstellungen zu verwalten
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="minecraft-name" className="sr-only">
              Minecraft Name
            </label>
            <input
              id="minecraft-name"
              type="text"
              required
              value={minecraftName}
              onChange={(e) => setMinecraftName(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Dein Minecraft Name"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Anmelden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 