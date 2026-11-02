// DEMO card form (PAYMENT_MODE=demo): looks exactly like the real one, but
// nothing is charged and the card number is NEVER sent to the server.
// Use it only for testing. For real payments set PAYMENT_MODE=stripe.
import { useState } from 'react';
import CardBadges from './CardBadges';
import { useLang } from '../../i18n/LanguageContext';
import { api } from '../../api';

function getBrand(number) {
  if (number.startsWith('4')) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(number)) return 'mastercard';
  return '';
}

export default function DemoCard({ startOrder, onResult, payLabel }) {
  const { t } = useLang();
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [busy, setBusy] = useState(false);

  const digits = card.number.replace(/\D/g, '');
  const brand = getBrand(digits);

  function change(e) {
    let { name, value } = e.target;
    if (name === 'number') value = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    if (name === 'expiry') value = value.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');
    if (name === 'cvc') value = value.replace(/\D/g, '').slice(0, 4);
    setCard({ ...card, [name]: value });
  }

  async function pay(e) {
    e.preventDefault();
    if (digits.length < 16 || card.expiry.length < 5 || card.cvc.length < 3) return alert(t('co.error'));
    setBusy(true);

    const order = await startOrder();
    if (!order) return setBusy(false);

    // only the brand and last 4 digits are sent — never the full number
    const result = await api(`/orders/${order.orderId}/confirm`, {
      method: 'POST',
      body: { demoCard: { brand: brand || 'visa', last4: digits.slice(-4) } },
    });
    setBusy(false);
    onResult(order.orderId, result.status);
  }

  return (
    <form onSubmit={pay} className="card-form">
      <label>{t('co.cardNumber')}
        <div className="input stripe-input">
          <input name="number" value={card.number} onChange={change} placeholder="1234 5678 9012 3456" inputMode="numeric" dir="ltr" />
          <CardBadges brand={brand} />
        </div>
      </label>
      <div className="two">
        <label>{t('co.expiry')}
          <input className="input" name="expiry" value={card.expiry} onChange={change} placeholder="MM/YY" inputMode="numeric" dir="ltr" />
        </label>
        <label>{t('co.cvc')}
          <input className="input" name="cvc" value={card.cvc} onChange={change} placeholder="123" inputMode="numeric" dir="ltr" />
        </label>
      </div>
      <label>{t('co.cardName')}
        <input className="input" name="name" value={card.name} onChange={change} required />
      </label>
      <button className="btn btn-full" disabled={busy}>{busy ? t('co.paying') : payLabel}</button>
      <p className="demo-note">{t('co.demo')}</p>
    </form>
  );
}
