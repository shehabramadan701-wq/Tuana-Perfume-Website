// The big perfume in the opening animation and at the top of the home page.
// It shows client/public/images/hero.jpg (replace it with your own photo, same name).
// If the photo is missing, the drawn bottle shows instead.
import { useState } from 'react';
import Bottle from './Bottle';

const HERO_PHOTO = import.meta.env.BASE_URL + 'images/hero.jpg';

// framed = photo inside a small gold arch (used by the falling animation)
// otherwise the photo fills the big arch on the home page
export default function HeroBottle({ size = 300, framed = false }) {
  const [hasPhoto, setHasPhoto] = useState(true);

  if (!hasPhoto) return <Bottle color="var(--hero-bottle)" size={size} />;

  const img = <img src={HERO_PHOTO} alt="TUANA" onError={() => setHasPhoto(false)} />;
  if (framed) return <div className="photo-arch" style={{ height: size, width: size * 0.72 }}>{img}</div>;
  return <div className="hero-arch-photo">{img}</div>;
}
