import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <header className="fixed w-full z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
      <nav className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-white">Coyi SMP</div>
          <div>
            <ul className="flex space-x-6">
              <li><Link href="/#about" className="text-gray-300 hover:text-white transition-colors">Start</Link></li>
              <li><Link href="/#about" className="text-gray-300 hover:text-white transition-colors">Über uns</Link></li>
              <li><Link href="/#how-to-join" className="text-gray-300 hover:text-white transition-colors">Mitmachen</Link></li>
              <li><Link href="/status" className="text-gray-300 hover:text-white transition-colors">Status</Link></li>
              <li><Link href="/playerlist" className="text-gray-300 hover:text-white transition-colors">Spielerliste</Link></li>
              <li>
                <div className="relative group">
                  <button className="text-gray-300 hover:text-white transition-colors">
                    Grief-System
                    <i className="fas fa-chevron-down ml-1 text-xs"></i>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link href="/grieflist/submit" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Einverständnis
                    </Link>
                    <Link href="/grieflist/list" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Übersicht
                    </Link>
                  </div>
                </div>
              </li>
              <li><Link href="/#socials" className="text-gray-300 hover:text-white transition-colors">Social</Link></li>
              <li><Link href="/#contact" className="text-gray-300 hover:text-white transition-colors">Kontakt</Link></li>
              <li><Link href="/whitelist" className="text-gray-300 hover:text-white transition-colors">Whitelist</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 