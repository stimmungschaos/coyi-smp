// src/app/page.tsx
import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img 
              src="https://cdn.7tv.app/emote/01FMAFD278000D6HG894PC5VQA/4x.webp" 
              alt="Coyi SMP" 
              className="w-20 h-20 rounded-xl shadow-lg"
            />
            <h1 className="text-6xl font-bold text-white">Coyi SMP</h1>
          </div>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto">
            Made with <img 
              src="https://cdn.7tv.app/emote/01J2Y6HF3R000103G6KJYE1PGR/2x.webp" 
              alt="heart"
              className="w-6 h-6 inline-block mx-1"
            />  by @stimmungschaos__
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a href="#about" className="bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-800 transition-colors shadow-lg">
              Mehr erfahren
            </a>
            <a href="#how-to-join" className="bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-800 transition-colors shadow-lg">
              Jetzt mitmachen
            </a>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-32 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">Über das Projekt</h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-10"></div>
          <p className="mt-6 text-xl text-center text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Dieser SMP ist ein Minecraft Projekt, wo das Herzblut mehrerer Entwickler drinsteckt. Die grundsätzliche Idee, den SMP zu starten, kam von 2coyi selber. stimmungschaos__ hat sich dazu bereit erklärt, den Server zu hosten, zu verwalten etc. Weitere Helfer sind weiter unten zu finden
          </p>
        </div>
      </section>

      {/* How to Join Section */}
      <section id="how-to-join" className="py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">Wie kannst du mitmachen?</h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-10"></div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Discord beitreten</h3>
              <p className="text-gray-600">Um weitere Infos zum SMP zu bekommen, musst du dem DC Server joinen (weiter unten zu finden) </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Whitelist Antrag stellen</h3>
              <p className="text-gray-600">
                Bitte stelle den Antrag auf dieser Website. Link dazu:     
                <a 
                  href="/whitelist" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-400 ml-1"
                >
                  Whitelist
                </a>
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Hast du Fragen oder gibt es Probleme?</h3>
              <p className="text-gray-600">Du kannst bei Problemen jederzeit ein Ticket auf dem Discord Server erstellen.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl text-green-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Viel Spaß!</h3>
              <p className="text-gray-600">Wir wünschen dir viel Spaß auf dem Server!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Server Discord Section */}
      <section id="discord" className="py-32 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Unserem Server folgen</h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-10"></div>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Für weitere Infos zum Event und vieles mehr, joine dem Discord Server:
          </p>
          <a href="https://discord.gg/3r9uytYK8c" target="_blank" rel="noopener noreferrer" 
             className="inline-flex items-center bg-[#5865F2] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#4752C4] transition-colors shadow-lg">
            <i className="fab fa-discord text-2xl mr-3"></i>
            Discord beitreten
          </a>
        </div>
      </section>

      {/* Developer Socials Section */}
      <section id="socials" className="py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Unsere Entwickler</h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-10"></div>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Entwickler 1 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
              <img 
                src="https://cdn.7tv.app/emote/01GS34DQJR0009FP5N7E0RZJNT/3x.avif"
                alt="Entwickler 1" 
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-white mb-2">stimmungschaos__</h3>
              <p className="text-gray-400 mb-6">Serverhoster, Creator der Website und Admin der Community</p>
              <div className="flex justify-center gap-4">
                <a href="https://chaosly.de" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-400 hover:text-green-400 transition-colors">
                  <img 
                    src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/linktree-logo-icon.png"
                    alt="Linktree"
                    className="w-6 h-6 transition-all filter brightness-75 hover:brightness-100"
                  />
                </a>
              </div>
            </div>
            
            {/* Entwickler 2 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
              <img 
                src="https://cdn.7tv.app/user/01FBVFYMSG0009J6BJAGW1W7RT/profile-picture/01J99AB7WR0005R4VD1W8N1FM7/3x.avif" 
                alt="2coyi" 
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-white mb-2">2coyi</h3>
              <p className="text-gray-400 mb-6">Broadcasterin des Events, Anpassungen etc.</p>
              <div className="flex justify-center gap-4">
                <a href="https://linktr.ee/2coyi" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-400 hover:text-white transition-colors">
                  <img 
                    src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/linktree-logo-icon.png"
                    alt="Linktree"
                    className="w-6 h-6 transition-all filter brightness-75 hover:brightness-100"
                  />
                </a>
              </div>
            </div>

            {/* Entwickler 3 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
              <img 
                src="https://cdn.7tv.app/emote/01JE6S7YZ4C5QF5ERHR9S9BQW6/4x.webp"
                alt="Entwickler 3" 
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-white mb-2">okayyfiona</h3>
              <p className="text-gray-400 mb-6">Plugin Entwicklerin </p>
              <div className="flex justify-center gap-4">
                <a href="https://www.twitch.tv/okayyfiona/" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitch text-2xl"></i>
                </a>
              </div>
            </div>

            {/* Entwickler 4 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
              <img 
                src="https://cdn.7tv.app/emote/01G8NN2EP0000927RGPZYET95N/3x.avif"
                alt="einssystemlukas" 
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-white mb-2">einssystemlukas</h3>
              <p className="text-gray-400 mb-6">Ohne ihn würde das ganze Projekt nicht existieren</p>
              <div className="flex justify-center gap-4">
                <a href="https://linktr.ee/systemlukas" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-400 hover:text-white transition-colors">
                  <img 
                    src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/linktree-logo-icon.png"
                    alt="Linktree"
                    className="w-6 h-6 transition-all filter brightness-75 hover:brightness-100"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Kontakt</h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-10"></div>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
            Hast du Fragen oder möchtest du mehr erfahren? Tritt unserem Discord Server bei!
          </p>
          <div className="mt-10">
            <a href="https://discord.gg/3r9uytYK8c" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center bg-[#5865F2] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#4752C4] transition-colors shadow-lg">
              <i className="fab fa-discord text-2xl mr-3"></i>
              Discord beitreten
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">&copy; 2024/25 Coyi SMP. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
