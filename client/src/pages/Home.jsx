// ===== Landing page =====
import { useEffect, useState } from 'react';
import Intro from '../components/Intro';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import ProductCard from '../components/ProductCard';
import HeroBottle from '../components/HeroBottle';
import Ornament from '../components/Ornament';
import Footer from '../components/Footer';
import PalettePicker from '../components/PalettePicker';
import { useLang } from '../i18n/LanguageContext';
import useConfig from '../context/useConfig';
import { api, scrollToId } from '../api';


export default function Home() {
  const { t, lang } = useLang();
  const { currency } = useConfig();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('all');
  // the intro shows once per visit
  const [showIntro, setShowIntro] = useState(!sessionStorage.getItem('tuana_intro'));

  useEffect(() => {
    api('/products').then(setProducts).catch(console.error);
    api('/categories').then(setCategories).catch(console.error);
  }, []);

  function closeIntro() {
    sessionStorage.setItem('tuana_intro', '1');
    setShowIntro(false);
  }

  // category name in the current language
  const catName = (c) => (lang === 'ar' ? c.name_ar : c.name_en);
  const catOf = (slug) => categories.find((c) => c.slug === slug);

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
              <HeroBottle size={300} />
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
          <button className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>{t('cat.all')}</button>
          {categories.filter((c) => c.products_count > 0).map((c) => (
            <button key={c.slug} className={category === c.slug ? 'active' : ''} onClick={() => setCategory(c.slug)}>
              {catName(c)}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {shown.map((p) => <ProductCard key={p.id} product={p} currency={currency} categoryName={catOf(p.category) ? catName(catOf(p.category)) : ''} />)}
        </div>
      </section>

      {/* ---------- STORY ---------- */}
      <section className="section story" id="story">
        <div className="story-visual">
          <div className="arch arch-small">
            <div className="arch-inner">
              {/* photo: client/public/images/story.jpg */}
              <div className="hero-arch-photo">
                <img src={import.meta.env.BASE_URL + 'images/story.jpg'} alt="TUANA" />
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
      <PalettePicker />
    </>
  );
}
