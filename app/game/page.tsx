// app/game/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

type FallingItem = {
  id: number;
  x: number;
  y: number;
  type: 'present' | 'snowflake';
};

export default function CatchGame() {
  const [presentsCaught, setPresentsCaught] = useState(0); // сколько подарков поймано
  const [snowflakesCaught, setSnowflakesCaught] = useState(0); // сколько снежинок поймано
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 минуты
  const [items, setItems] = useState<FallingItem[]>([]);
  const [playerX, setPlayerX] = useState(50);
  const [gameEnded, setGameEnded] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const lastSpawnTimeRef = useRef(0);
  const itemIdRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number>(0);

  // Таймер
  const router = useRouter();

  const movePresents = () => {
    router.push('/presents');
  };

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameActive, timeLeft]);

  // Управление с клавиатуры
  useEffect(() => {
    if (!gameActive) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPlayerX((x) => Math.max(0, x - 5));
      if (e.key === 'ArrowRight') setPlayerX((x) => Math.min(100, x + 5));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameActive]);

  // Управление с тача
  const handleTouch = useCallback(
    (e: React.TouchEvent) => {
      if (!gameActive || !gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      const percent = (touchX / rect.width) * 100;
      setPlayerX(Math.max(0, Math.min(100, percent)));
    },
    [gameActive]
  );

  const endGame = () => {
    setGameActive(false);
    setGameEnded(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Игровой цикл
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (
        gameActive &&
        timestamp - lastSpawnTimeRef.current > 900 + Math.random() * 400
      ) {
        lastSpawnTimeRef.current = timestamp;
        const isPresent = Math.random() > 0.4;
        const newItem: FallingItem = {
          id: itemIdRef.current++,
          x: Math.random() * 100,
          y: 0,
          type: isPresent ? 'present' : 'snowflake',
        };

        setItems((prev) => {
          const updated = [...prev, newItem];
          return updated.length > 10 ? updated.slice(-10) : updated;
        });
      }

      setItems((prev) =>
        prev
          .map((item) => ({ ...item, y: item.y + 0.8 }))
          .filter((item) => item.y < 110)
      );

      setItems((prev) => {
        const remaining = prev.filter((item) => {
          const caught = Math.abs(item.x - playerX) < 8 && item.y > 85;
          if (caught) {
            if (item.type === 'present') {
              setPresentsCaught((c) => c + 1);
            } else {
              setSnowflakesCaught((c) => c + 1);
            }
            return false;
          }
          return true;
        });
        return remaining;
      });

      if (gameActive) {
        animationRef.current = requestAnimationFrame(gameLoop);
      }
    },
    [gameActive, playerX]
  );

  useEffect(() => {
    if (gameActive) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameActive, gameLoop]);

  const startGame = () => {
    setPresentsCaught(0);
    setSnowflakesCaught(0);
    setTimeLeft(120);
    setItems([]);
    setPlayerX(50);
    setGameActive(true);
    setGameEnded(false);
    lastSpawnTimeRef.current = 0;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Итоговый результат: подарки минус снежинки (но не меньше 0)
  const finalPresents = Math.max(0, presentsCaught - snowflakesCaught);

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 flex flex-col items-center justify-center p-4 text-white'>

      <Button
        type='primary'
        style={{
          color: '#fff',
          fontWeight: '700',
          fontSize: '16px',
          backgroundColor: 'blue',
          height: '36px',
          width: '350px',
          marginBottom: '28px'
        }}
        onClick={movePresents}
      >
        К подаркам эльфов!
      </Button>
      <h1 className='text-3xl font-bold mb-2'>🎅 Поймай подарки! Снежинки не лови!</h1>

      {gameActive && (
        <div className='flex gap-6 mb-4 text-xl'>
          <div>
            Время:{' '}
            <span className='text-red-300 font-bold'>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      )}

      {!gameActive && !gameEnded ? (
        <Button
          type='primary'
          size='large'
          onClick={startGame}
          style={{
            fontSize: '20px',
            height: '50px',
            backgroundColor: 'red',
            borderColor: 'red',
          }}
        >
          Начать игру (2 минуты)!
        </Button>
      ) : gameEnded ? (
        <div className='bg-white/10 backdrop-blur rounded-xl p-6 max-w-md text-center'>
          <h2 className='text-2xl font-bold text-yellow-300 mb-3'>
            🎁 Ты поймал
          </h2>
          <div className='text-5xl font-bold my-2 text-green-300'>
            {finalPresents}
          </div>
          <p className='text-lg'>подарков!</p>

          {snowflakesCaught > 0 && (
            <p className='mt-3 text-white/80'>
              (Поймано 🎁 {presentsCaught} подарков, но ❄️ {snowflakesCaught}{' '}
              снежинок их унесли!)
            </p>
          )}

          <Button
            onClick={startGame}
            className='mt-6'
            style={{
              backgroundColor: 'red',
              borderColor: 'red',
              color: 'white',
            }}
          >
            Сыграть ещё
          </Button>
        </div>
      ) : null}

      {gameActive && (
        <>
          <div
            ref={gameAreaRef}
            className='relative w-full max-w-md h-[500px] bg-blue-800/30 rounded-xl overflow-hidden border-2 border-white/20 mt-4'
            onTouchMove={handleTouch}
          >
            <div
              className='absolute bottom-4 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl'
              style={{ left: `calc(${playerX}% - 2rem)` }}
            >
              🎅
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className='absolute text-3xl'
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none',
                }}
              >
                {item.type === 'present' ? '🎁' : '❄️'}
              </div>
            ))}
          </div>
          <div className='mt-3 text-white/70 text-sm'>
            ← → или касание — двигать Санту
          </div>
        </>
      )}
    </div>
  );
}
