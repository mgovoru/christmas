// app/santa-puzzle/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

const TARGET_IMAGE = [
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
];

type CellState = 'empty' | 'filled' | 'marked';

const generateClues = (line: number[]): number[] => {
  const clues: number[] = [];
  let count = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === 1) {
      count++;
    } else if (count > 0) {
      clues.push(count);
      count = 0;
    }
  }
  if (count > 0) clues.push(count);
  return clues.length ? clues : [0];
};

const rowClues = TARGET_IMAGE.map((row) => generateClues(row));
const colClues = TARGET_IMAGE[0].map((_, colIndex) =>
  generateClues(TARGET_IMAGE.map((row) => row[colIndex]))
);

export default function SantaNonogram() {
  const [grid, setGrid] = useState<CellState[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill('empty'))
  );
  const [won, setWon] = useState(false);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tapCountRef = useRef<{ [key: string]: number }>({});

  const handleCellTap = (r: number, c: number) => {
    if (won) return;

    const key = `${r}-${c}`;
    const currentCount = tapCountRef.current[key] || 0;

    // Очистить предыдущий таймер
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    if (currentCount === 0) {
      // Первый тап — планируем закраску через 300ms
      tapCountRef.current[key] = 1;
      tapTimeoutRef.current = setTimeout(() => {
        // Одиночный тап — закрасить
        setGrid((prev) => {
          const newGrid = prev.map((row) => [...row]);
          const current = newGrid[r][c];
          newGrid[r][c] = current === 'filled' ? 'empty' : 'filled';
          return newGrid;
        });
        // Сброс счётчика
        delete tapCountRef.current[key];
      }, 300);
    } else if (currentCount === 1) {
      // Второй тап в течение 300ms — двойной клик
      delete tapCountRef.current[key];
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = null;
      }

      // Двойной тап — поставить/снять метку
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        const current = newGrid[r][c];
        newGrid[r][c] = current === 'marked' ? 'empty' : 'marked';
        return newGrid;
      });
    }
  };

  useEffect(() => {
    let correct = true;
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const target = TARGET_IMAGE[r][c];
        const current = grid[r][c];
        if (
          (target === 1 && current !== 'filled') ||
          (target === 0 && current === 'filled')
        ) {
          correct = false;
          break;
        }
      }
      if (!correct) break;
    }
    if (correct) setWon(true);
  }, [grid]);

  const reset = () => {
    setGrid(
      Array(10)
        .fill(null)
        .map(() => Array(10).fill('empty'))
    );
    setWon(false);
    tapCountRef.current = {};
  };

  const CELL_SIZE = 32;
  const MAX_CLUE_LINES = Math.max(...colClues.map((cl) => cl.length));

  return (
    <>
      <div style={{ padding: '30px 20px', fontFamily: 'Arial, sans-serif' }}>
        <h1
          style={{
            textAlign: 'center',
            color: '#c62828',
            fontSize: '28px',
            marginBottom: '30px',
          }}
        >
          🎅 Нонограмма: Собери Санту!
        </h1>

        {won && (
          <div
            style={{
              textAlign: 'center',
              margin: '20px 0 30px',
              padding: '12px',
              background: '#e8f5e9',
              borderRadius: '10px',
            }}
          >
            <h2 style={{ color: '#2e7d32', fontSize: '22px' }}>
              Поздравляем! Ты открыл Санту! 🎄
            </h2>
            <button
              onClick={reset}
              style={{
                marginTop: '12px',
                padding: '8px 20px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Играть снова
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {/* Левые подсказки */}
          <div
            style={{
              marginRight: '12px',
              display: 'flex',
              flexDirection: 'column',
              marginTop: `${MAX_CLUE_LINES * 18}px`,
            }}
          >
            {rowClues.map((clues, r) => (
              <div
                key={r}
                style={{
                  height: `${CELL_SIZE}px`,
                  width: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#333',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {clues.map((n, i) => (
                  <span key={i} style={{ margin: '0 2px' }}>
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Сетка */}
          <div>
            <div
              style={{ display: 'flex', height: `${MAX_CLUE_LINES * 18}px` }}
            >
              {colClues.map((clues, c) => (
                <div
                  key={c}
                  style={{
                    width: `${CELL_SIZE}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#333',
                    paddingBottom: '4px',
                  }}
                >
                  {clues.map((n, i) => (
                    <span key={i} style={{ lineHeight: '18px' }}>
                      {n}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <div>
              {grid.map((row, r) => (
                <div key={r} style={{ display: 'flex' }}>
                  {row.map((cell, c) => (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleCellTap(r, c)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        // Для ПК: правый клик — метка
                        setGrid((prev) => {
                          const newGrid = prev.map((row) => [...row]);
                          const current = newGrid[r][c];
                          newGrid[r][c] =
                            current === 'marked' ? 'empty' : 'marked';
                          return newGrid;
                        });
                      }}
                      style={{
                        width: `${CELL_SIZE}px`,
                        height: `${CELL_SIZE}px`,
                        border: '1px solid #999',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        userSelect: 'none',
                        backgroundColor:
                          cell === 'filled'
                            ? '#000'
                            : cell === 'marked'
                            ? '#ffeb3b'
                            : '#fff',
                        color: cell === 'marked' ? '#000' : 'transparent',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        touchAction: 'manipulation', // убирает задержку 300ms на iOS
                      }}
                    >
                      {cell === 'marked' ? '?' : ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p
        style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '14px',
          color: '#555',
        }}
      >
        На телефоне: <strong>1 тап</strong> — закрасить, <strong>2 тапа</strong>{' '}
        — «?»
        <br />
        На компьютере: <strong>ЛКМ</strong> — закрасить, <strong>ПКМ</strong> —
        «?»
      </p>
    </>
  );
}
