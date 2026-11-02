// ===== Payment gateway (hidden from the customer) =====
// The customer only sees a Visa / Mastercard form on our site.
// Here we talk to Stripe in the background. In "demo" mode nothing is charged.
const Stripe = require('stripe');

const isStripe = () => process.env.PAYMENT_MODE === 'stripe';
const stripe = () => Stripe(process.env.STRIPE_SECRET_KEY);

// 1) Start a payment for an order -> returns { ref, clientSecret }
async function createPayment(orderId, total, currency) {
  if (!isStripe()) {
    return { ref: 'demo_' + orderId, clientSecret: null };
  }

  const intent = await stripe().paymentIntents.create({
    amount: Math.round(total * 100), // Stripe wants the amount in cents / piasters
    currency: currency.toLowerCase(),
    payment_method_types: ['card'],
    metadata: { order_id: String(orderId) },
  });
  return { ref: intent.id, clientSecret: intent.client_secret };
}

// 2) Ask the gateway if the payment really succeeded
//    returns { paid: true/false, brand, last4 }
async function checkPayment(ref, demoCard) {
  if (!isStripe()) {
    return { paid: true, brand: demoCard?.brand || 'visa', last4: demoCard?.last4 || '0000' };
  }

  const intent = await stripe().paymentIntents.retrieve(ref, { expand: ['payment_method'] });
  const card = intent.payment_method?.card || {};
  return { paid: intent.status === 'succeeded', brand: card.brand, last4: card.last4 };
}

module.exports = { createPayment, checkPayment };
