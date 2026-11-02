// ===== Landing page =====
import { useEffect, useState } from 'react';
import Intro from '../components/Intro';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import ProductCard from '../components/ProductCard';
import Bottle from '../components/Bottle';
import Ornament from '../components/Ornament';
import Footer from '../components/Footer';
import { useLang } from '../i18n/LanguageContext';
import useConfig from '../context/useConfig';
import { api, scrollToId } from '../api';

const categories = ['all', 'oud', 'khumra', 'perfume', 'bakhoor'];

export default function Home() {
  const { t } = useLang();
  const { currency } = useConfig();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  // the intro shows once per visit
  const [showIntro, setShowIntro] = useState(!sessionStorage.getItem('tuana_intro'));

  useEffect(() => {
    api('/products').then(setProducts).catch(console.error);
  }, []);

  function closeIntro() {
    sessionStorage.setItem('tuana_intro', '1');
    setShowIntro(false);
  }

  const shown = category === 'all' ? products : products.filter((p) => p.category === category);

  return (
    <>
      {showIntro && <Intro onDone={closeIntro} />}
      <Navbar />
      <CartDrawer currency={currency} />

      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero-text">
          <span className="eyebrow">{t('hero.eyebrow')}</span>
          <h1>{t('hero.title')}</h1>
          <Ornament />
          <p>{t('hero.text')}</p>
          <div className="hero-buttons">
            <a href="#collection" className="btn" onClick={(e) => scrollToId(e, 'collection')}>{t('hero.cta')}</a>
            <a href="#story" className="btn btn-outline" onClick={(e) => scrollToId(e, 'story')}>{t('hero.cta2')}</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="arch">
            <div className="arch-inner">
              <div className="float"><Bottle color="#6B4226" size={300} /></div>
            </div>
          </div>
          <div className="hero-badge">
            <strong>Oud</strong>
            <span>Reale</span>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="features">
        {['feat.1', 'feat.2', 'feat.3', 'feat.4'].map((key, i) => (
          <div className="feature" key={key}>
            <span className="feature-icon">{['✦', '❖', '❦', '◈'][i]}</span>
            {t(key)}
          </div>
        ))}
      </section>

      {/* ---------- COLLECTION ---------- */}
      <section className="section" id="collection">
        <div className="section-head">
          <span className="eyebrow">{t('col.eyebrow')}</span>
          <h2>{t('col.title')}</h2>
          <Ornament />
        </div>

        <div className="tabs">
          {categories.map((c) => (
            <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>
              {t('cat.' + c)}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {shown.map((p) => <ProductCard key={p.id} product={p} currency={currency} />)}
        </div>
      </section>

      {/* ---------- STORY ---------- */}
      <section className="section story" id="story">
        <div className="story-visual">
          <div className="arch arch-small">
            <div className="arch-inner">
              <div className="story-bottles">
                <Bottle color="#8C3B2E" size={170} />
                <Bottle color="#B8893B" size={210} />
                <Bottle color="#3E4A5C" size={170} />
              </div>
            </div>
          </div>
        </div>
        <div className="story-text">
          <span className="eyebrow">{t('story.eyebrow')}</span>
          <h2>{t('story.title')}</h2>
          <Ornament />
          <p>{t('story.text1')}</p>
          <p>{t('story.text2')}</p>
          <div className="story-numbers">
            <div><strong>12+</strong><span>{t('story.years')}</span></div>
            <div><strong>40</strong><span>{t('story.blends')}</span></div>
            <div><strong>9K</strong><span>{t('story.clients')}</span></div>
          </div>
        </div>
      </section>

      {/* ---------- QUOTES ---------- */}
      <section className="section quotes">
        <div className="section-head">
          <h2>{t('quotes.title')}</h2>
          <Ornament />
        </div>
        <div className="quotes-grid">
          {['q1', 'q2', 'q3'].map((q) => (
            <blockquote key={q}>
              <span className="quote-mark">“</span>
              <p>{t(q)}</p>
              <div className="stars">★★★★★</div>
            </blockquote>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
