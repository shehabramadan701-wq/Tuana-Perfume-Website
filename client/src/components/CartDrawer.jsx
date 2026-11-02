import { useNavigate } from 'react-router-dom';
import ProductImage from './ProductImage';
import { useLang } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { money } from '../api';

export default function CartDrawer({ currency }) {
  const { t, lang } = useLang();
  const { items, setQty, remove, total, open, setOpen } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <div className={`drawer-bg ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? 'show' : ''}`}>
        <div className="drawer-head">
          <h3>{t('cart.title')}</h3>
          <button className="icon-btn" onClick={() => setOpen(false)}>✕</button>
        </div>

        {items.length === 0 && <p className="drawer-empty">{t('cart.empty')}</p>}

        <div className="drawer-items">
          {items.map((item) => (
            <div className="drawer-item" key={item.id}>
              <div className="drawer-thumb"><ProductImage product={item} size={64} /></div>
              <div className="drawer-info">
                <strong>{lang === 'ar' ? item.name_ar : item.name_en}</strong>
                <span>{money(item.price, currency, lang)}</span>
                <div className="qty">
                  <button onClick={() => setQty(item.id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => setQty(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <button className="icon-btn" onClick={() => remove(item.id)}>✕</button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="row"><span>{t('cart.total')}</span><strong>{money(total, currency, lang)}</strong></div>
            <button className="btn btn-full" onClick={() => { setOpen(false); navigate('/checkout'); }}>
              {t('cart.checkout')}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
