'use client';

import Image from 'next/image';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=90',
    alt: 'Santorini',
  },
  {
    src: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=90',
    alt: 'Bali Temple',
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90',
    alt: 'Clouds and Sky',
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=90',
    alt: 'Beach Resort',
  },
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=90',
    alt: 'Mountains Lake',
  },
];

export default function ImageGrid() {
  return (
    <div className="relative w-full h-[520px]">
      {/* Decorative wifi/signal lines top-right */}
      <svg
        className="absolute -top-2 right-8 w-12 h-12 text-accent-400 z-30"
        viewBox="0 0 48 48"
        fill="none"
      >
        <path d="M30 18c4 2 7 6 8 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M33 12c6 3 10 9 12 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M36 6c8 4 14 12 16 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      {/* CSS Grid Collage */}
      <div
        className="grid gap-3 h-full w-full"
        style={{
          gridTemplateColumns: '1fr 0.8fr 0.6fr',
          gridTemplateRows: '1fr 0.8fr 1fr',
        }}
      >
        {/* Image 1 - Santorini (top-left, spans 1 row) */}
        <div className="rounded-2xl overflow-hidden shadow-md row-span-1 col-span-1">
          <Image
            src={images[0].src}
            alt={images[0].alt}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image 2 - Clouds (top-center, spans 2 rows) */}
        <div className="rounded-2xl overflow-hidden shadow-md row-span-2 col-span-1">
          <Image
            src={images[2].src}
            alt={images[2].alt}
            width={400}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image 3 - Mountains (top-right, spans 3 rows, D-shape) */}
        <div
          className="overflow-hidden shadow-md row-span-3 col-span-1"
          style={{ borderRadius: '20px 100px 100px 20px' }}
        >
          <Image
            src={images[4].src}
            alt={images[4].alt}
            width={300}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image 4 - Bali Temple (middle-left, spans 2 rows) */}
        <div className="rounded-2xl overflow-hidden shadow-md row-span-2 col-span-1">
          <Image
            src={images[1].src}
            alt={images[1].alt}
            width={400}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image 5 - Beach (bottom-center) */}
        <div className="rounded-2xl overflow-hidden shadow-md row-span-1 col-span-1">
          <Image
            src={images[3].src}
            alt={images[3].alt}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
