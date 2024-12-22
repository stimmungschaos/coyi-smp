'use client';
import { useState, useEffect } from 'react';
import { WhitelistEntry } from '@/types/api';
import { 
  getWhitelistEntries, 
  deleteWhitelistEntry, 
  updateWhitelistEntry,
  deleteWhitelistByCondition 
} from '@/app/actions/whitelist-admin';

export default function AdminWhitelistPage() {
  const [entries, setEntries] = useState<WhitelistEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEntry, setEditingEntry] = useState<WhitelistEntry | null>(null);
  const [editMinecraftName, setEditMinecraftName] = useState('');
  const [editDiscordName, setEditDiscordName] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });
  const [skipDeleteConfirm, setSkipDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchEntries();

    const interval = setInterval(() => {
      fetchEntries();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchEntries = async () => {
    const result = await getWhitelistEntries();
    if (result.success && result.data) {
      setEntries(result.data);
    }
  };

  const handleDeleteClick = (id: number) => {
    if (skipDeleteConfirm) {
      handleDelete(id);
    } else {
      setDeleteDialog({ show: true, id });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteWhitelistEntry(id);
      if (result.success) {
        fetchEntries();
        setDeleteDialog({ show: false, id: null });
      } else {
        alert(result.error || 'Fehler beim Löschen');
      }
    } catch (err) {
      console.error('Fehler:', err);
      alert('Fehler beim Löschen des Eintrags');
    }
  };

  const handleEdit = (entry: WhitelistEntry) => {
    setEditingEntry(entry);
    setEditMinecraftName(entry.minecraft_name);
    setEditDiscordName(entry.discord_name);
  };

  const handleSaveEdit = async () => {
    if (!editingEntry) return;

    try {
      const result = await updateWhitelistEntry(editingEntry.id, {
        minecraft_name: editMinecraftName,
        discord_name: editDiscordName,
      });

      if (result.success) {
        fetchEntries();
        setEditingEntry(null);
      } else {
        alert(result.error || 'Fehler beim Aktualisieren');
      }
    } catch (err) {
      console.error('Fehler:', err);
      alert('Fehler beim Aktualisieren des Eintrags');
    }
  };

  const filteredEntries = entries.filter(entry => 
    entry.minecraft_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.discord_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.reload(); // Seite neu laden, um zum Login zurückzukehren
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Whitelist Einträge</h1>
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

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-gray-300">ID</th>
                <th className="px-6 py-3 text-gray-300">Minecraft Name</th>
                <th className="px-6 py-3 text-gray-300">Discord Name</th>
                <th className="px-6 py-3 text-gray-300">Erstellt am</th>
                <th className="px-6 py-3 text-gray-300">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="border-t border-gray-700">
                  <td className="px-6 py-4 text-white">{entry.id}</td>
                  <td className="px-6 py-4 text-white">{entry.minecraft_name}</td>
                  <td className="px-6 py-4 text-white">{entry.discord_name}</td>
                  <td className="px-6 py-4 text-white">
                    {new Date(entry.created_at).toLocaleString('de-DE')}
                  </td>
                  <td className="px-6 py-4 text-white">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Bearbeiten"
                      >
                        <i className="fas fa-pen"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(entry.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Löschen"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lösch-Dialog */}
        {deleteDialog.show && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">Eintrag löschen</h2>
              <p className="text-gray-300 mb-6">
                Bist du sicher, dass du diesen Eintrag löschen möchtest?
              </p>
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="checkbox"
                  id="skip-confirm"
                  checked={skipDeleteConfirm}
                  onChange={(e) => setSkipDeleteConfirm(e.target.checked)}
                  className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="skip-confirm" className="text-gray-300 text-sm">
                  Nicht erneut nachfragen
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteDialog({ show: false, id: null })}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingEntry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">Eintrag bearbeiten</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Minecraft Name</label>
                  <input
                    type="text"
                    value={editMinecraftName}
                    onChange={(e) => setEditMinecraftName(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Discord Name</label>
                  <input
                    type="text"
                    value={editDiscordName}
                    onChange={(e) => setEditDiscordName(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setEditingEntry(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 