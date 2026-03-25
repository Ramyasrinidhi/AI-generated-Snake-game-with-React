import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Drive (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cybernetic Pulse (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Digital Horizon (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto w-full gap-4 font-pixel">
      <div className="flex items-center gap-4 w-full md:w-1/3">
        <div className="w-12 h-12 shrink-0 bg-magenta-500 flex items-center justify-center shadow-[4px_4px_0px_#00ffff]">
          <Music className="text-black" size={24} strokeWidth={3} />
        </div>
        <div className="min-w-0">
          <h3 className="text-magenta-500 font-bold text-xs truncate uppercase glitch-cyan">
            {currentTrack.title}
          </h3>
          <p className="text-[10px] text-cyan-500/60 truncate uppercase">SIGNAL_STRENGTH: 100%</p>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-1/3 justify-center">
        <button 
          onClick={prevTrack} 
          className="text-cyan-500 hover:text-magenta-500 transition-colors"
        >
          <SkipBack size={24} strokeWidth={3} />
        </button>
        <button
          onClick={togglePlay}
          className="w-12 h-12 shrink-0 bg-cyan-500 text-black flex items-center justify-center hover:bg-magenta-500 transition-all shadow-[4px_4px_0px_#ff00ff] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          {isPlaying ? (
            <Pause size={24} strokeWidth={3} />
          ) : (
            <Play size={24} strokeWidth={3} className="ml-1" />
          )}
        </button>
        <button 
          onClick={nextTrack} 
          className="text-cyan-500 hover:text-magenta-500 transition-colors"
        >
          <SkipForward size={24} strokeWidth={3} />
        </button>
      </div>

      <div className="flex items-center gap-3 w-full md:w-1/3 justify-end">
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className="text-magenta-500 hover:text-cyan-400 transition-colors"
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={20} strokeWidth={3} />
          ) : (
            <Volume2 size={20} strokeWidth={3} />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-24 accent-magenta-500 cursor-pointer h-2 bg-cyan-900 appearance-none border border-cyan-500"
        />
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}
