import { useState } from 'react';
import ProductImage from './ProductImage';
import { useLang } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { money } from '../api';

export default function ProductCard({ product, currency, categoryName }) {
  const { t, lang } = useLang();
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <ProductImage product={product} size={170} />
      </div>
      <span className="product-cat">{categoryName} · {product.size}</span>
      <h3>{lang === 'ar' ? product.name_ar : product.name_en}</h3>
      <p className="product-desc">{lang === 'ar' ? product.description_ar : product.description_en}</p>
      <div className="product-bottom">
        <strong>{money(product.price, currency, lang)}</strong>
        <button className="btn btn-small" onClick={handleAdd}>{added ? t('added') : t('add')}</button>
      </div>
    </div>
  );
}
