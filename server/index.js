// ===== TUANA server (Express) =====
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// ----- Public settings the website needs -----
app.get('/api/config', (req, res) => {
  res.json({
    currency: process.env.CURRENCY || 'EGP',
    paymentMode: process.env.PAYMENT_MODE || 'demo',
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  });
});

// ----- API routes -----
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));
app.use('/api/delivery-statuses', require('./routes/deliveryStatuses'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// ----- Serve the React site after "npm run build" -----
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
