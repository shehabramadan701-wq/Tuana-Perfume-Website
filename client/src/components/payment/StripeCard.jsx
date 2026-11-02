// Real card form. The fields are secure Stripe fields, styled to look like our site,
// so the customer only sees "Visa / Mastercard" — no gateway name.
import { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CardBadges from './CardBadges';
import { useLang } from '../../i18n/LanguageContext';
import { api } from '../../api';

const fieldStyle = {
  style: {
    base: {
      fontSize: '17px',
      color: '#3B2A1E',
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      '::placeholder': { color: '#B6A68C' },
    },
    invalid: { color: '#B33A3A' },
  },
};

export default function StripeCard({ startOrder, onResult, payLabel }) {
  const { t } = useLang();
  const stripe = useStripe();
  const elements = useElements();
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  async function pay(e) {
    e.preventDefault();
    if (!stripe || busy) return;
    setBusy(true);

    const order = await startOrder(); // saves the order in the database
    if (!order) return setBusy(false);

    const { error } = await stripe.confirmCardPayment(order.clientSecret, {
      payment_method: { card: elements.getElement(CardNumberElement), billing_details: { name } },
    });

    const result = await api(`/orders/${order.orderId}/confirm`, { method: 'POST', body: {} });
    setBusy(false);
    onResult(order.orderId, result.status, error?.message);
  }

  return (
    <form onSubmit={pay} className="card-form">
      <label>{t('co.cardNumber')}
        <div className="input stripe-input">
          <CardNumberElement options={{ ...fieldStyle, showIcon: false }} onChange={(e) => setBrand(e.brand)} />
          <CardBadges brand={brand === 'unknown' ? '' : brand} />
        </div>
      </label>
      <div className="two">
        <label>{t('co.expiry')}
          <div className="input stripe-input"><CardExpiryElement options={fieldStyle} /></div>
        </label>
        <label>{t('co.cvc')}
          <div className="input stripe-input"><CardCvcElement options={fieldStyle} /></div>
        </label>
      </div>
      <label>{t('co.cardName')}
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <button className="btn btn-full" disabled={busy}>{busy ? t('co.paying') : payLabel}</button>
    </form>
  );
}
