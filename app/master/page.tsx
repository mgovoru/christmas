'use client';
import { Button } from 'antd';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Master() {
  const videoRef = useRef(null);
  const router = useRouter();
  

  useEffect(() => {
    const video = videoRef.current as unknown as HTMLVideoElement;
    if (video) {
      // Попытка воспроизведения при загрузке
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Видео запущено');
          })
          .catch((error) => {
            console.log('Автозапуск заблокирован:', error);
            // Fallback: запустить после первого клика пользователя
            document.addEventListener(
              'click',
              () => {
                video.play();
              },
              { once: true }
            );
          });
      }
    }
  }, []);
  const movePresents = () => { router.push('/presents') };

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload='metadata'
        src='/Elves_Presents.mp4'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          zIndex: -1,
        }}
      />
      <div className='relative min-h-screen flex items-center justify-center font-sanos'>
        <Button
          type='primary'
          style={{
            color: '#fff',
            fontWeight: '700',
            fontSize: '16px',
            backgroundColor: 'blue',
            height: '36px',
            position: 'absolute',
            bottom: '200px',
          }}
          onClick={ movePresents}
        >
          Смотри, что тебе приготовили эльфы!
        </Button>
      </div>
    </>
  );
}
