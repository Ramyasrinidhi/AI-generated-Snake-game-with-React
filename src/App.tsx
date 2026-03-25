/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col font-pixel selection:bg-magenta-500/50 overflow-hidden relative">
      {/* Glitch Overlays */}
      <div className="crt-overlay" />
      <div className="static-noise" />

      <header className="p-8 text-center shrink-0 border-b-4 border-magenta-500 tear relative z-10">
        <h1 
          className="text-5xl md:text-7xl font-bold tracking-tighter text-magenta-500 glitch-cyan uppercase"
        >
          SNAKE_OS_v0.1
        </h1>
        <div className="flex justify-center gap-4 mt-2 text-xs opacity-70">
          <span className="animate-pulse">STATUS: CRITICAL</span>
          <span>MEMORY: 64KB</span>
          <span className="text-magenta-500">ENCRYPTION: BROKEN</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 min-h-[500px] relative z-10">
        <div className="border-4 border-cyan-500 p-2 bg-black/40 backdrop-blur-sm shadow-[8px_8px_0px_#ff00ff]">
          <SnakeGame />
        </div>
      </main>

      <footer className="shrink-0 border-t-4 border-cyan-500 bg-black p-4 z-50 relative">
        <div className="max-w-5xl mx-auto border-2 border-magenta-500 p-2 bg-magenta-500/5">
          <MusicPlayer />
        </div>
      </footer>
    </div>
  );
}
