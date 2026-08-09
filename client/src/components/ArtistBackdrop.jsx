import React, { useEffect, useState } from 'react';
import { ARTIST_PHOTOS } from '../data/artistPhotos';

export default function ArtistBackdrop() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % ARTIST_PHOTOS.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
      {ARTIST_PHOTOS.map((photo, index) => (
        <img
          key={photo}
          src={photo}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1800ms] ${index === active ? 'opacity-20' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/65 via-[#050507]/90 to-[#050507]" />
    </div>
  );
}
