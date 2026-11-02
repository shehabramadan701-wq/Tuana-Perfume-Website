const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { can } = auth;

// GET /api/products  -> all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE is_active = 1 ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load products' });
  }
});

// the fields a product has
function productData(body) {
  return [
    body.name_ar, body.name_en, body.description_ar || '', body.description_en || '',
    body.category, Number(body.price) || 0, body.size || '', body.color || '#8B5A2B', body.image_url || null,
  ];
}

function isValid(body) {
  return body.name_ar && body.name_en && body.category && Number(body.price) > 0;
}

// POST /api/products  -> add a product
router.post('/', auth, can('products.add'), async (req, res) => {
  if (!isValid(req.body)) return res.status(400).json({ message: 'Name, category and price are required' });
  try {
    await db.query(
      `INSERT INTO products (name_ar, name_en, description_ar, description_en, category, price, size, color, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      productData(req.body)
    );
    res.json({ message: 'Saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save' });
  }
});

// PUT /api/products/5  -> edit a product
router.put('/:id', auth, can('products.edit'), async (req, res) => {
  if (!isValid(req.body)) return res.status(400).json({ message: 'Name, category and price are required' });
  try {
    await db.query(
      `UPDATE products SET name_ar = ?, name_en = ?, description_ar = ?, description_en = ?,
         category = ?, price = ?, size = ?, color = ?, image_url = ? WHERE id = ?`,
      [...productData(req.body), req.params.id]
    );
    res.json({ message: 'Saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save' });
  }
});

// DELETE /api/products/5
router.delete('/:id', auth, can('products.delete'), async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete' });
  }
});

module.exports = router;
