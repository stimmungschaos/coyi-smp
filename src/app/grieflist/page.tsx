import Link from 'next/link';

export default function GrieflistPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Grief-Liste</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Link 
            href="/grieflist/submit"
            className="bg-gray-800 p-8 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Grief-Einverständnis</h2>
            <p className="text-gray-400">
              Trage dich ein und gib an, ob du mit Griefing einverstanden bist.
            </p>
          </Link>
          
          <Link 
            href="/grieflist/list"
            className="bg-gray-800 p-8 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Liste anzeigen</h2>
            <p className="text-gray-400">
              Siehe die Liste aller Spieler und deren Grief-Einverständnis.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
} 