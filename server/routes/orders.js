const router = require('express').Router();
const db = require('../db');
const { createPayment, checkPayment } = require('../services/payment');

// POST /api/orders/checkout
// body: { customer: { name, email, phone, city, address }, items: [{ id, quantity }] }
router.post('/checkout', async (req, res) => {
  const { customer = {}, items = [] } = req.body;

  if (!customer.name || !customer.email || !customer.phone || items.length === 0) {
    return res.status(400).json({ message: 'Missing customer data or cart is empty' });
  }

  try {
    // Prices always come from the database (never trust prices sent by the browser)
    const ids = items.map((i) => Number(i.id));
    const [products] = await db.query('SELECT * FROM products WHERE id IN (?)', [ids]);

    let total = 0;
    const lines = [];
    for (const item of items) {
      const product = products.find((p) => p.id === Number(item.id));
      const quantity = Math.max(1, Math.min(20, Number(item.quantity) || 1));
      if (!product) continue;
      total += Number(product.price) * quantity;
      lines.push([product.id, product.name_en, product.price, quantity]);
    }
    if (lines.length === 0) return res.status(400).json({ message: 'Products not found' });

    const currency = process.env.CURRENCY || 'EGP';

    // Save the order as "pending"
    const [result] = await db.query(
      `INSERT INTO orders (customer_name, email, phone, city, address, total, currency, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [customer.name, customer.email, customer.phone, customer.city, customer.address, total, currency]
    );
    const orderId = result.insertId;

    await db.query(
      'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES ?',
      [lines.map((l) => [orderId, ...l])]
    );

    // Start the payment
    const payment = await createPayment(orderId, total, currency);
    await db.query('UPDATE orders SET payment_ref = ? WHERE id = ?', [payment.ref, orderId]);

    res.json({ orderId, total, clientSecret: payment.clientSecret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create the order' });
  }
});

// POST /api/orders/:id/confirm  -> called after the card form is submitted
router.post('/:id/confirm', async (req, res) => {
  try {
    const [[order]] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status === 'paid') return res.json({ status: 'paid' });

    const result = await checkPayment(order.payment_ref, req.body.demoCard);

    if (result.paid) {
      await db.query(
        `UPDATE orders SET status = 'paid', card_brand = ?, card_last4 = ?, paid_at = NOW() WHERE id = ?`,
        [result.brand, result.last4, order.id]
      );
      return res.json({ status: 'paid' });
    }

    await db.query(`UPDATE orders SET status = 'failed' WHERE id = ?`, [order.id]);
    res.json({ status: 'failed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not confirm the payment' });
  }
});

module.exports = router;
