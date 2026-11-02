// Opening animation: a perfume bottle falls from the sky, lands with a golden
// ripple, golden mist rises and the brand name appears. Click to skip.
import { useEffect, useState } from 'react';
import Bottle from './Bottle';

export default function Intro({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 4200);
    const t2 = setTimeout(onDone, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const brand = 'TUANA'.split('');

  return (
    <div className={`intro ${leaving ? 'leaving' : ''}`} onClick={onDone}>
      <div className="intro-pattern" />

      <div className="intro-stage">
        {/* golden mist */}
        <div className="intro-mist">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} style={{ '--x': `${(i - 7) * 14}px`, '--d': `${1.3 + (i % 5) * 0.15}s` }} />
          ))}
        </div>

        <div className="intro-ring" />
        <div className="intro-ring ring2" />

        <div className="intro-bottle">
          <Bottle color="#6B4226" size={190} />
        </div>
        <div className="intro-shadow" />
      </div>

      <h1 className="intro-brand">
        {brand.map((c, i) => (
          <span key={i} style={{ animationDelay: `${1.9 + i * 0.12}s` }}>{c}</span>
        ))}
      </h1>
      <p className="intro-ar">توانا للعطور</p>
      <p className="intro-tag">Profumi d'Oriente</p>
    </div>
  );
}
