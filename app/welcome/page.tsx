'use client';
import Model from '@/components/model/page';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Welcome() {
  const [videoStarted, setVideoStarted] = useState(false); // видео уже запущено?
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

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
    startVideo();
  }, []);

  const movePage = () => {
    router.push('master');
  };

  return (
    <>
      {/* Видео */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload='metadata'
        src='/Snow_Winter.mp4'
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

      <div className='flex items-center justify-center flex-col gap-8'>
        {' '}
        <Model />
        <p
          style={{
            color: 'red',
            fontWeight: '700',
            fontSize: '16px',
          }}
        >
          Санта вращается касанием
        </p>
        <Button
          type='primary'
          style={{
            color: '#fff',
            fontWeight: '700',
            fontSize: '16px',
            backgroundColor: 'red',
            height: '36px',
          }}
          onClick={movePage}
        >
          <p>Нажимай на кнопку, чтобы увидеть куда прилетит Санта </p>
        </Button>
      </div>
    </>
  );
}
