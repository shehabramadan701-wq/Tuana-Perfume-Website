// Small floating button to try the color palettes (online preview only)
import { useState } from 'react';
import { useLang } from '../i18n/LanguageContext';
import { palettes, applyPalette, SHOW_PICKER } from '../palettes';

export default function PalettePicker() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(document.documentElement.dataset.palette);

  if (!SHOW_PICKER) return null;

  function choose(id) {
    applyPalette(id);
    setCurrent(id);
  }

  return (
    <div className="palette-picker">
      {open && (
        <div className="palette-list">
          {palettes.map((p) => (
            <button key={p.id} className={current === p.id ? 'active' : ''} onClick={() => choose(p.id)}>
              <span className="swatch" style={{ background: `linear-gradient(135deg, ${p.swatch[0]} 50%, ${p.swatch[1]} 50%)` }} />
              {lang === 'ar' ? p.ar : p.en}
            </button>
          ))}
        </div>
      )}
      <button className="palette-toggle" onClick={() => setOpen(!open)}>
        🎨 {lang === 'ar' ? 'جرّب الألوان' : 'Try the colors'}
      </button>
    </div>
  );
}
