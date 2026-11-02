import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { scrollToId } from '../api';

export default function Navbar() {
  const { t, lang, toggleLang } = useLang();
  const { count, setOpen } = useCart();

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span className="logo-en">TUANA</span>
        <span className="logo-ar">توانا</span>
      </Link>

      <nav className="nav-links">
        <a href="#collection" onClick={(e) => scrollToId(e, 'collection')}>{t('nav.collection')}</a>
        <a href="#story" onClick={(e) => scrollToId(e, 'story')}>{t('nav.story')}</a>
        <a href="#contact" onClick={(e) => scrollToId(e, 'contact')}>{t('nav.contact')}</a>
      </nav>

      <div className="nav-actions">
        <button className="lang-btn" onClick={toggleLang}>{lang === 'ar' ? 'EN' : 'ع'}</button>
        <button className="bag-btn" onClick={() => setOpen(true)}>
          {t('nav.bag')} <span className="bag-count">{count}</span>
        </button>
      </div>
    </header>
  );
}
