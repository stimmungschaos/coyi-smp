'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

interface EditingEntry {
  id: number;
  minecraft_name: string;
  consents: Consents;
}

export default function AdminGrieflistPage() {
  const [entries, setEntries] = useState<GrieflistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEntry, setEditingEntry] = useState<EditingEntry | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) {
      router.push('/grieflist/admin');
      return;
    }

    fetchEntries();
  }, [router]);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/grieflist');
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

  const handleDelete = async (id: number) => {
    if (!confirm('Möchtest du diesen Eintrag wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/grieflist/admin/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEntries();
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    router.push('/grieflist/admin');
  };

  const filteredEntries = entries.filter(entry => 
    entry.minecraft_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (entry: GrieflistEntry) => {
    setEditingEntry({
      id: entry.id,
      minecraft_name: entry.minecraft_name,
      consents: { ...entry.consents }
    });
  };

  const handleSave = async () => {
    if (!editingEntry) return;

    try {
      const response = await fetch(`/api/grieflist/admin/${editingEntry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          minecraft_name: editingEntry.minecraft_name,
          consents: editingEntry.consents
        }),
      });

      if (response.ok) {
        setEditingEntry(null);
        fetchEntries();
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
    }
  };

  const handleConsentChange = (key: keyof Consents) => {
    if (!editingEntry) return;

    if (key === 'nothingAllowed') {
      setEditingEntry(prev => ({
        ...prev!,
        consents: {
          pvp: false,
          griefing: false,
          stealing: false,
          trapping: false,
          petKilling: false,
          nothingAllowed: !prev!.consents.nothingAllowed
        }
      }));
    } else {
      setEditingEntry(prev => ({
        ...prev!,
        consents: {
          ...prev!.consents,
          [key]: !prev!.consents[key],
          nothingAllowed: false
        }
      }));
    }
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Grieflist Verwaltung</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Abmelden
          </button>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Suchen..."
            className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
          />
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="grid gap-4">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-white">
                      <span className="text-gray-400">Minecraft:</span> {entry.minecraft_name}
                    </p>
                    <div>
                      <p className="text-gray-400 mb-1">Erlaubte Aktionen:</p>
                      <div className="space-y-1">
                        {entry.consents.nothingAllowed ? (
                          <span className="text-red-500">Erlaubt keine Aktionen</span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {entry.consents.pvp && (
                              <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded">PvP</span>
                            )}
                            {entry.consents.griefing && (
                              <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded">Griefing</span>
                            )}
                            {entry.consents.stealing && (
                              <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded">Items klauen</span>
                            )}
                            {entry.consents.trapping && (
                              <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded">Trapping</span>
                            )}
                            {entry.consents.petKilling && (
                              <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded">Haustiere töten</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      {new Date(entry.last_updated).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleEdit(entry)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">Eintrag bearbeiten</h2>
            
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Minecraft Name</label>
              <input
                type="text"
                value={editingEntry.minecraft_name}
                onChange={(e) => setEditingEntry(prev => ({ ...prev!, minecraft_name: e.target.value }))}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-gray-400 mb-2">Erlaubte Aktionen</label>
              
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingEntry.consents.nothingAllowed}
                  onChange={() => handleConsentChange('nothingAllowed')}
                  className="mr-2"
                />
                Nix davon erlauben (Friedlicher Spieler)
              </label>

              <label className={`flex items-center text-white cursor-pointer ${
                editingEntry.consents.nothingAllowed ? 'opacity-50' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={editingEntry.consents.pvp}
                  onChange={() => handleConsentChange('pvp')}
                  disabled={editingEntry.consents.nothingAllowed}
                  className="mr-2"
                />
                PvP
              </label>

              <label className={`flex items-center text-white cursor-pointer ${
                editingEntry.consents.nothingAllowed ? 'opacity-50' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={editingEntry.consents.griefing}
                  onChange={() => handleConsentChange('griefing')}
                  disabled={editingEntry.consents.nothingAllowed}
                  className="mr-2"
                />
                Griefing
              </label>

              <label className={`flex items-center text-white cursor-pointer ${
                editingEntry.consents.nothingAllowed ? 'opacity-50' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={editingEntry.consents.stealing}
                  onChange={() => handleConsentChange('stealing')}
                  disabled={editingEntry.consents.nothingAllowed}
                  className="mr-2"
                />
                Items klauen
              </label>

              <label className={`flex items-center text-white cursor-pointer ${
                editingEntry.consents.nothingAllowed ? 'opacity-50' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={editingEntry.consents.trapping}
                  onChange={() => handleConsentChange('trapping')}
                  disabled={editingEntry.consents.nothingAllowed}
                  className="mr-2"
                />
                Trapping
              </label>

              <label className={`flex items-center text-white cursor-pointer ${
                editingEntry.consents.nothingAllowed ? 'opacity-50' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={editingEntry.consents.petKilling}
                  onChange={() => handleConsentChange('petKilling')}
                  disabled={editingEntry.consents.nothingAllowed}
                  className="mr-2"
                />
                Haustiere töten
              </label>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingEntry(null)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 