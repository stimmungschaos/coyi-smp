'use client';

import { useState, useEffect } from 'react';

function TypeWriter({ text, onComplete, shouldStart }: { text: string; onComplete?: () => void; shouldStart: boolean }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!shouldStart) {
      setDisplayText('');
      setCurrentIndex(0);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete, shouldStart]);

  return (
    <span className="text-white">
      {displayText}
    </span>
  );
}

function BashPrompt({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono">
      <div className="flex items-center gap-1 text-sm">
        <span className="text-green-400">[</span>
        <span className="text-cyan-400">player</span>
        <span className="text-green-400">@</span>
        <span className="text-purple-400">minecraft</span>
        <span className="text-green-400">]</span>
        <span className="text-yellow-400">$</span>
        <span className="ml-2">{children}</span>
      </div>
    </div>
  );
}

export default function BasePage() {
  const [step, setStep] = useState(0);
  const [showCopied, setShowCopied] = useState(false);
  const coordinates = { x: 8.23, y: 68, z: -847.658 };
  const tpCommand = `/tp ${coordinates.x} ${coordinates.y} ${coordinates.z}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tpCommand);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Base Koordinaten</h1>

        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-gray-300 mb-4">Base Koordinaten:</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">X</p>
                  <p className="text-2xl font-bold text-green-500">{coordinates.x}</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Y</p>
                  <p className="text-2xl font-bold text-green-500">{coordinates.y}</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Z</p>
                  <p className="text-2xl font-bold text-green-500">{coordinates.z}</p>
                </div>
              </div>
            </div>

            {/* Terminal Window */}
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm border border-gray-700">
              <div className="flex flex-col gap-2">
                <BashPrompt>
                  <TypeWriter 
                    text="ls"
                    shouldStart={step >= 0}
                  />
                </BashPrompt>
                {step >= 1 && <div className="text-blue-400 ml-8">coordinates.txt</div>}
                
                <BashPrompt>
                  <TypeWriter 
                    text="cat coordinates.txt"
                    shouldStart={step >= 1}
                  />
                </BashPrompt>
                {step >= 2 && (
                  <div className="text-gray-300 ml-8">
                    Base Location:
                    <br />
                    X: <span className="text-yellow-400">{coordinates.x}</span>
                    <br />
                    Y: <span className="text-yellow-400">{coordinates.y}</span>
                    <br />
                    Z: <span className="text-yellow-400">{coordinates.z}</span>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <BashPrompt>
                    <TypeWriter 
                      text={tpCommand}
                      shouldStart={step >= 2}
                    />
                  </BashPrompt>
                  {step >= 3 && (
                    <button
                      onClick={handleCopy}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 
                        ${showCopied 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-gray-700 hover:bg-gray-600'
                        } 
                        text-gray-100 rounded-md text-xs 
                        transition-all duration-200 ease-in-out
                        border border-gray-600 hover:border-gray-500
                        shadow-sm hover:shadow-md
                        transform hover:-translate-y-0.5
                      `}
                      title="Command kopieren"
                    >
                      {showCopied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Kopiert!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          <span>Kopieren</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                {step >= 3 && (
                  <div className="text-green-400 ml-8">
                    Teleporting to coordinates...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 