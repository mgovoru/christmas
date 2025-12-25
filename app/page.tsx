'use client';

import FormLogin from '@/components/login/page';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [isLandscape, setIsLandscape] = useState(false);
  const [showLandscapePrompt, setShowLandscapePrompt] = useState(true);
  const [videoStarted, setVideoStarted] = useState(false); // видео уже запущено?
  const videoRef = useRef<HTMLVideoElement>(null);

  // Принудительный запуск видео
  const startVideo = () => {
    const video = videoRef.current;
    if (video && !videoStarted) {
      video
        .play()
        .then(() => {
          setVideoStarted(true);
        })
        .catch((err) => {
          console.warn('Не удалось запустить видео:', err);
          // setVideoStarted(true); // всё равно считаем, что "попытались"
        });
    }
  };

  useEffect(() => {
    const checkOrientation = () => {
      const isLandscapeNow = window.innerWidth > window.innerHeight;
      setIsLandscape(isLandscapeNow);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);

    // Через 8 секунд убираем подсказку
    const timeout = setTimeout(() => {
      setShowLandscapePrompt(false);
    }, 8000);

    // Попытка автозапуска (на десктопе может сработать)
    startVideo();

    return () => {
      window.removeEventListener('resize', checkOrientation);
      clearTimeout(timeout);
    };
  }, []);

  // Решение: показываем либо подсказку, либо основной контент
  const showPrompt = !isLandscape && showLandscapePrompt;

  return (
    <>
      {/* Видео */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload='metadata'
        src='/Santa_Claus.mp4'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />

      {/* 🔥 Триггер запуска видео — поверх всего */}
      {!videoStarted && (
        <div
          onClick={startVideo}
          onTouchStart={startVideo}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            background: 'transparent', // можно сделать слегка затемнённым для UX
            cursor: 'pointer',
          }}
        />
      )}

      {/* Подсказка "поверните устройство" */}
      {showPrompt && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: '#fff',
            textAlign: 'center',
            padding: '20px',
            fontSize: '24px',
            zIndex: 9998, // ниже триггера, чтобы триггер работал поверх подсказки
          }}
        >
          <div>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>📱</div>
            <p>Кристина, пожалуйста, поверните телефончик</p>
            <p style={{ marginTop: '10px', opacity: 0.7 }}>
              для лучшего просмотра. И если картинка не оживает, касайся экрана!
              Тогда сразу же всё оживёт!
            </p>
            <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.5 }}>
              Через несколько секунд откроется автоматически...
            </p>
          </div>
        </div>
      )}

      {/* Основной контент — форма */}
      <div className='flex items-center justify-center min-h-screen'>
        <FormLogin />
      </div>
    </>
  );
}
