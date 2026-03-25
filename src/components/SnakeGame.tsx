import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Pause as PauseIcon, Gamepad2 } from 'lucide-react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const BASE_SPEED = 150;

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef<Point>(INITIAL_DIRECTION);
  const lastProcessedDirection = useRef<Point>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    const availableSpots: Point[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!currentSnake.some(segment => segment.x === x && segment.y === y)) {
          availableSpots.push({ x, y });
        }
      }
    }
    if (availableSpots.length === 0) return { x: 0, y: 0 };
    return availableSpots[Math.floor(Math.random() * availableSpots.length)];
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    lastProcessedDirection.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused) return;

      const currentDir = lastProcessedDirection.current;
      let newDir = currentDir;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) newDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) newDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) newDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) newDir = { x: 1, y: 0 };
          break;
      }
      directionRef.current = newDir;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const dir = directionRef.current;
      lastProcessedDirection.current = dir;
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };

      // Check collision with walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [moveSnake, gameOver, isPaused, score]);

  return (
    <div className="flex flex-col items-center gap-4 font-pixel">
      <div className="flex items-center justify-between w-full px-2">
        <div className="flex items-center gap-2 text-2xl font-bold text-magenta-500 glitch-cyan">
          <Trophy size={24} strokeWidth={3} />
          <span>SCORE:{score}</span>
        </div>
        {isPaused && !gameOver && (
          <div className="flex items-center gap-2 text-lg font-bold text-yellow-400 animate-pulse">
            <PauseIcon size={20} strokeWidth={3} />
            <span>HALTED</span>
          </div>
        )}
      </div>

      <div
        className="relative bg-black border-4 border-cyan-500 shadow-[4px_4px_0px_#ff00ff] overflow-hidden"
        style={{
          width: GRID_SIZE * 20,
          height: GRID_SIZE * 20,
        }}
      >
        {/* Grid lines - more aggressive */}
        <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
        }} />

        {/* Food - Square pixel */}
        <div
          className="absolute bg-magenta-500 shadow-[0_0_10px_#ff00ff]"
          style={{
            width: 16,
            height: 16,
            left: food.x * 20 + 2,
            top: food.y * 20 + 2,
          }}
        />

        {/* Snake - Square pixels */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${
                isHead
                  ? 'bg-cyan-400 shadow-[0_0_15px_#00ffff] z-10'
                  : 'bg-cyan-900 border border-cyan-400/30'
              }`}
              style={{
                width: 18,
                height: 18,
                left: segment.x * 20 + 1,
                top: segment.y * 20 + 1,
              }}
            />
          );
        })}

        {/* Game Over Overlay - Aggressive Glitch */}
        {gameOver && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20 border-8 border-magenta-500 animate-pulse">
            <h2 
              className="text-4xl font-black text-magenta-500 mb-4 glitch-cyan uppercase"
            >
              SYSTEM_FAILURE
            </h2>
            <p className="text-cyan-400 text-xl mb-8 font-bold">DATA_LOST: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-magenta-500 text-black font-black hover:bg-cyan-400 transition-colors uppercase shadow-[4px_4px_0px_#00ffff] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              REBOOT_OS
            </button>
          </div>
        )}
      </div>

      <div className="text-cyan-500/60 text-[10px] flex flex-col items-center gap-1 font-bold uppercase tracking-tighter">
        <div className="flex gap-4">
          <span>[WASD] NAVIGATE</span>
          <span>[SPACE] INTERRUPT</span>
        </div>
        <div className="text-magenta-500/40">KERNEL_VERSION: 0.1.2-BETA</div>
      </div>
    </div>
  );
}
