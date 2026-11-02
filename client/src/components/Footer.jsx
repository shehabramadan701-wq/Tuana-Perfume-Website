import { useLang } from '../i18n/LanguageContext';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer" id="contact">
      <div className="logo">
        <span className="logo-en">TUANA</span>
        <span className="logo-ar">توانا</span>
      </div>
      <p>{t('footer.text')}</p>
      <div className="footer-contact">
        <a href="tel:+201000000000">+20 100 000 0000</a>
        <a href="mailto:hello@tuana.com">hello@tuana.com</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
      </div>
      <small>© {new Date().getFullYear()} TUANA — {t('footer.rights')}</small>
    </footer>
  );
}
