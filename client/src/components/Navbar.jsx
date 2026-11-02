import { useLang } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { t, lang, toggleLang } = useLang();
  const { count, setOpen } = useCart();

  return (
    <header className="navbar">
      <a href="/" className="logo">
        <span className="logo-en">TUANA</span>
        <span className="logo-ar">توانا</span>
      </a>

      <nav className="nav-links">
        <a href="#collection">{t('nav.collection')}</a>
        <a href="#story">{t('nav.story')}</a>
        <a href="#contact">{t('nav.contact')}</a>
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
