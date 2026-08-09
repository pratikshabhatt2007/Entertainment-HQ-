import React, { useEffect, useState } from 'react';

const cache = new Map();

export default function ArtistImage({ artist, alt, className = '', fallback = '' }) {
  const [source, setSource] = useState(() => cache.get(artist) || fallback);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setFailed(false);
    setSource(cache.get(artist) || fallback);
    if (cache.get(artist)) return undefined;
    const findArtistImage = async () => {
      try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artist)}`);
        if (response.ok) {
          const data = await response.json();
          const image = data.originalimage?.source || data.thumbnail?.source;
          if (image) return image;
        }
      } catch { /* Try the search API below. */ }
      const response = await fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(artist)}&gsrlimit=1&prop=pageimages&pithumbsize=1200`);
      if (!response.ok) return '';
      const data = await response.json();
      return Object.values(data.query?.pages || {})[0]?.thumbnail?.source || '';
    };
    findArtistImage()
      .then((image) => {
        if (active && image) { cache.set(artist, image); setSource(image); }
        if (active && !image) setFailed(true);
      })
      .catch(() => active && setFailed(true));
    return () => { active = false; };
  }, [artist, fallback]);

  if (!source) return <div className={`flex items-end bg-gradient-to-br from-fuchsia-800 via-indigo-950 to-black p-5 ${className}`} role="img" aria-label={alt}><span className="text-xl font-black text-white">{artist}</span></div>;
  return <img src={source} alt={alt} className={className} onError={() => { if (source !== fallback && fallback) setSource(fallback); else setFailed(true); }} referrerPolicy="no-referrer" />;
}
