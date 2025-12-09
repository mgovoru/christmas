import FormLogin from '@/components/login/page';

export default function Home() {
  return (
    <div className='relative flex min-h-screen items-center justify-center font-sanos w-[100vw] overflow-hidden'>
      {/* Видео-фон */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className='absolute top-0 left-0 w-full h-full object-cover z-[-1]'
      >
        <source src='/Santa_Claus.mp4' type='video/mp4' />
      </video>

      <div className='flex items-center justify-center'>
        {' '}
        <FormLogin />
      </div>
    </div>
  );
}
