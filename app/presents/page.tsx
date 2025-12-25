'use client';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

export default function Presents() {
  const router = useRouter();
  const moveGame = () => {
    router.push('game');
  };
  const movePhotoes = () => {
    router.push('photoes');
  };
  const moveLetter = () => {
    router.push('letter');
  };

  return (
    <div
      className='h-[100vh]  p-16 w-[100vw]'
      style={{
        backgroundImage: `url('/presents.jpg')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className='flex flex-col gap-16 justify-center items-center h-[100%] w-[100%]'>
        <Button
          type='primary'
          style={{
            fontWeight: '700',
            fontSize: '16px',
            height: '36px',
            backgroundColor: 'white',
            color: 'blue',
            width: '390px',
          }}
          onClick={moveGame}
        >
          Игра от Санты
        </Button>
        <Button
          type='primary'
          style={{
            fontWeight: '700',
            fontSize: '16px',
            height: '36px',
            backgroundColor: 'white',
            color: 'blue',
            width: '390px',
          }}
          onClick={movePhotoes}
        >
          Твои фото, которые понравились Санте
        </Button>
        <Button
          type='primary'
          style={{
            fontWeight: '700',
            fontSize: '16px',
            height: '36px',
            backgroundColor: 'white',
            color: 'blue',
            width: '390px',
          }}
          onClick={moveLetter}
        >
          Письмо от Санты
        </Button>
      </div>
    </div>
  );
}
