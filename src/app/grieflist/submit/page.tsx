'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ConsentOptions {
  pvp: boolean;
  griefing: boolean;
  stealing: boolean;
  trapping: boolean;
  petKilling: boolean;
  nothingAllowed: boolean;
}

export default function GrieflistSubmitPage() {
  const [minecraftName, setMinecraftName] = useState('');
  const [consents, setConsents] = useState<ConsentOptions>({
    pvp: false,
    griefing: false,
    stealing: false,
    trapping: false,
    petKilling: false,
    nothingAllowed: false
  });
  const [cookieConsent, setCookieConsent] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleConsentChange = (key: keyof ConsentOptions) => {
    if (key === 'nothingAllowed') {
      setConsents(prev => ({
        pvp: false,
        griefing: false,
        stealing: false,
        trapping: false,
        petKilling: false,
        nothingAllowed: !prev.nothingAllowed
      }));
    } else {
      setConsents(prev => ({
        ...prev,
        [key]: !prev[key],
        nothingAllowed: false
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('grieflist_token');
    if (!token) {
      router.push('/grieflist/login');
      return;
    }

    try {
      console.log('Sending data:', { consents });
      
      const response = await fetch('/api/grieflist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ consents })
      });

      const data = await response.json();
      console.log('Response:', data);
      
      if (response.ok) {
        setMessage(data.message);
        router.push('/grieflist/list');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Grief-Einverständnis</h1>
        
        <div className="mb-8 bg-gray-800 p-6 rounded-lg text-gray-300">
          <p>
            Hier könnt ihr angeben, womit ihr einverstanden seid. Beachtet: Wenn ihr einer Aktion nicht zustimmt, 
            dürft ihr diese auch nicht bei anderen ausführen. Wählt alle Aktionen aus, die ihr erlaubt.
          </p>
          <p className="mt-4 text-yellow-400/90">
            <span className="font-semibold">Wichtiger Hinweis:</span> Um Missbrauch zu verhindern, wird ein Hash deiner IP-Adresse gespeichert. 
            Dies ermöglicht es dir, deine Einstellungen nur von dem Gerät aus zu verwalten, von dem du dich registriert hast.
            Der Hash kann nicht zu deiner IP-Adresse zurückverfolgt werden.
          </p>
        </div>

        <div className="mb-12">
          <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Dein Minecraft Name</label>
              <input
                type="text"
                value={minecraftName}
                onChange={(e) => setMinecraftName(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 mb-4">Ich erlaube folgende Aktionen auf meinem Grundstück:</label>
              <div className="space-y-3 bg-gray-700 p-4 rounded">
                <label className="flex items-center text-white cursor-pointer hover:text-blue-300 border-b border-gray-600 pb-2 mb-2">
                  <input
                    type="checkbox"
                    checked={consents.nothingAllowed}
                    onChange={() => handleConsentChange('nothingAllowed')}
                    className="mr-2 w-4 h-4"
                  />
                  Nix davon erlauben (Friedlicher Spieler)
                </label>
                
                <label className={`flex items-center text-white cursor-pointer hover:text-blue-300 ${
                  consents.nothingAllowed ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  <input
                    type="checkbox"
                    checked={consents.pvp}
                    onChange={() => handleConsentChange('pvp')}
                    className="mr-2 w-4 h-4"
                    disabled={consents.nothingAllowed}
                  />
                  PvP (Kampf gegen andere Spieler)
                </label>
                <label className={`flex items-center text-white cursor-pointer hover:text-blue-300 ${
                  consents.nothingAllowed ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  <input
                    type="checkbox"
                    checked={consents.griefing}
                    onChange={() => handleConsentChange('griefing')}
                    className="mr-2 w-4 h-4"
                    disabled={consents.nothingAllowed}
                  />
                  Griefing (Zerstörung von Gebäuden/Grundstück)
                </label>
                <label className={`flex items-center text-white cursor-pointer hover:text-blue-300 ${
                  consents.nothingAllowed ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  <input
                    type="checkbox"
                    checked={consents.stealing}
                    onChange={() => handleConsentChange('stealing')}
                    className="mr-2 w-4 h-4"
                    disabled={consents.nothingAllowed}
                  />
                  Items klauen
                </label>
                <label className={`flex items-center text-white cursor-pointer hover:text-blue-300 ${
                  consents.nothingAllowed ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  <input
                    type="checkbox"
                    checked={consents.trapping}
                    onChange={() => handleConsentChange('trapping')}
                    className="mr-2 w-4 h-4"
                    disabled={consents.nothingAllowed}
                  />
                  Trapping (Fallen stellen)
                </label>
                <label className={`flex items-center text-white cursor-pointer hover:text-blue-300 ${
                  consents.nothingAllowed ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  <input
                    type="checkbox"
                    checked={consents.petKilling}
                    onChange={() => handleConsentChange('petKilling')}
                    className="mr-2 w-4 h-4"
                    disabled={consents.nothingAllowed}
                  />
                  Haustiere töten
                </label>
              </div>
            </div>

            <div className="mb-6 bg-yellow-900/30 border border-yellow-500/50 p-4 rounded">
              <div className="mb-3 text-yellow-200/90">
                <p>
                  <span className="text-yellow-400 font-semibold">Hinweis:</span> Wir speichern einen Cookie, um zu verhindern, 
                  dass mehrere Einträge von der gleichen Person erstellt werden. Der Cookie enthält keine 
                  persönlichen Daten und wird für einen Monat gespeichert.
                </p>
              </div>
              <label className="flex items-center text-yellow-100 cursor-pointer hover:text-yellow-200">
                <input
                  type="checkbox"
                  checked={cookieConsent}
                  onChange={(e) => setCookieConsent(e.target.checked)}
                  className="mr-2 w-4 h-4 accent-yellow-500"
                  required
                />
                Ich stimme der Verwendung des Cookies und der Speicherung meiner IP Adresse in Hash Form  zu
              </label>
            </div>

            <button 
              type="submit" 
              className={`w-full py-2 rounded-lg transition-colors ${
                cookieConsent 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!cookieConsent}
            >
              Einverständnis speichern
            </button>
          </form>
          {message && (
            <div className={`mt-4 p-4 rounded text-center text-white ${
              message.includes('Fehler') ? 'bg-red-800' : 'bg-gray-800'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 