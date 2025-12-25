'use client';

import { Button, Carousel } from 'antd';

import Image from 'next/image';

import { useRouter } from 'next/navigation';

export default function Photoes() {
  const router = useRouter();

  const movePresents = () => {
    router.push('/presents');
  };

  return (
    <div className='carousel'>
      <Button
        type='primary'
        style={{
          color: '#fff',
          fontWeight: '700',
          fontSize: '16px',
          backgroundColor: 'blue',
          height: '36px',
          width: '350px',
          marginBottom: '8px'
        }}
        onClick={movePresents}
      >
        К подаркам эльфов!
      </Button>
      <Carousel autoplay>
        <div>
          <Image src={'/car1.jpg'} alt='photo' width='350' height='450' />
        </div>
        <div>
          <Image src={'/car2.jpg'} alt='photo' width='350' height='450' />
        </div>
        <div>
          <Image src={'/car3.jpg'} alt='photo' width='350' height='450' />
        </div>
        <div>
          <Image src={'/car4.jpg'} alt='photo' width='350' height='450' />
        </div>
      </Carousel>
    </div>
  );
}
