const router = require('express').Router();
const db = require('../db');

// GET /api/products  -> all active products
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE is_active = 1 ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load products' });
  }
});

module.exports = router;
