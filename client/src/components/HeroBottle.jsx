// The big bottle in the opening animation and in the hero.
// Put your own photo in client/public/images/hero-bottle.png (a PNG with a transparent
// background looks best) and it will be used automatically. Without it, the drawn bottle shows.
import { useState } from 'react';
import Bottle from './Bottle';

const HERO_PHOTO = import.meta.env.BASE_URL + 'images/hero-bottle.png';

export default function HeroBottle({ size = 300 }) {
  const [hasPhoto, setHasPhoto] = useState(true);

  if (!hasPhoto) return <Bottle color="var(--hero-bottle)" size={size} />;
  return <img className="hero-photo" src={HERO_PHOTO} style={{ height: size }} alt="TUANA" onError={() => setHasPhoto(false)} />;
}
