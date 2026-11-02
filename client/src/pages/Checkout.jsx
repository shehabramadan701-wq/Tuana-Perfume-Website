// ===== Checkout page: delivery details + card payment =====
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCard from '../components/payment/StripeCard';
import DemoCard from '../components/payment/DemoCard';
import Bottle from '../components/Bottle';
import Ornament from '../components/Ornament';
import { useLang } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import useConfig from '../context/useConfig';
import { api, money } from '../api';

export default function Checkout() {
  const { t, lang, toggleLang } = useLang();
  const { items, total, clear } = useCart();
  const config = useConfig();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', city: '', address: '' });
  const [error, setError] = useState('');

  const useStripeMode = config.paymentMode === 'stripe' && config.stripePublishableKey;
  const stripePromise = useMemo(
    () => (useStripeMode ? loadStripe(config.stripePublishableKey, { locale: lang }) : null),
    [useStripeMode]
  );

  const change = (e) => setCustomer({ ...customer, [e.target.name]: e.target.value });

  // Called by the card form when the customer presses "Pay"
  async function startOrder() {
    setError('');
    if (!customer.name || !customer.email || !customer.phone || !customer.address) {
      setError(t('co.error'));
      return null;
    }
    try {
      return await api('/orders/checkout', {
        method: 'POST',
        body: { customer, items: items.map((i) => ({ id: i.id, quantity: i.quantity })) },
      });
    } catch (err) {
      setError(err.message);
      return null;
    }
  }

  // Called after the payment finishes
  function onResult(orderId, status, message) {
    if (status === 'paid') {
      clear();
      navigate('/success/' + orderId);
    } else {
      setError(message || t('co.failed'));
    }
  }

  const payLabel = `${t('co.pay')} ${money(total, config.currency, lang)}`;
  const formProps = { startOrder, onResult, payLabel };

  if (items.length === 0) {
    return (
      <div className="page-center">
        <p>{t('cart.empty')}</p>
        <Link to="/" className="btn">{t('co.back')}</Link>
      </div>
    );
  }

  return (
    <div className="checkout">
      <header className="checkout-top">
        <Link to="/" className="logo"><span className="logo-en">TUANA</span><span className="logo-ar">توانا</span></Link>
        <button className="lang-btn" onClick={toggleLang}>{lang === 'ar' ? 'EN' : 'ع'}</button>
      </header>

      <h1 className="checkout-title">{t('co.title')}</h1>
      <Ornament />

      <div className="checkout-grid">
        <div className="checkout-main">
          {/* delivery details */}
          <div className="panel">
            <h3>{t('co.details')}</h3>
            <div className="form">
              <label>{t('co.name')}<input className="input" name="name" value={customer.name} onChange={change} /></label>
              <div className="two">
                <label>{t('co.email')}<input className="input" type="email" name="email" value={customer.email} onChange={change} dir="ltr" /></label>
                <label>{t('co.phone')}<input className="input" name="phone" value={customer.phone} onChange={change} dir="ltr" /></label>
              </div>
              <div className="two">
                <label>{t('co.city')}<input className="input" name="city" value={customer.city} onChange={change} /></label>
                <label>{t('co.address')}<input className="input" name="address" value={customer.address} onChange={change} /></label>
              </div>
            </div>
          </div>

          {/* card payment */}
          <div className="panel">
            <h3>{t('co.card')}</h3>
            {error && <div className="alert">{error}</div>}
            {useStripeMode ? (
              <Elements stripe={stripePromise}><StripeCard {...formProps} /></Elements>
            ) : (
              <DemoCard {...formProps} />
            )}
            <p className="secure-note">🔒 {t('co.secure')}</p>
          </div>
        </div>

        {/* order summary */}
        <aside className="panel summary">
          <h3>{t('co.summary')}</h3>
          {items.map((i) => (
            <div className="summary-item" key={i.id}>
              <div className="drawer-thumb"><Bottle color={i.color} size={56} /></div>
              <span>{lang === 'ar' ? i.name_ar : i.name_en} × {i.quantity}</span>
              <strong>{money(i.price * i.quantity, config.currency, lang)}</strong>
            </div>
          ))}
          <div className="row"><span>{t('co.shipping')}</span><span>{t('co.free')}</span></div>
          <div className="row total"><span>{t('cart.total')}</span><strong>{money(total, config.currency, lang)}</strong></div>
        </aside>
      </div>
    </div>
  );
}
