const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { can } = auth;

// GET /api/categories  -> all categories (+ how many products in each)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, COUNT(p.id) AS products_count
       FROM categories c LEFT JOIN products p ON p.category = c.slug
       GROUP BY c.id ORDER BY c.id`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load categories' });
  }
});

// POST /api/categories  { name_ar, name_en }
router.post('/', auth, can('categories.add'), async (req, res) => {
  const { name_ar, name_en } = req.body;
  if (!name_ar || !name_en) return res.status(400).json({ message: 'Write the name in Arabic and English' });

  // "Rose Oils" -> "rose-oils"
  const slug = name_en.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cat-' + Date.now();

  try {
    await db.query('INSERT INTO categories (slug, name_ar, name_en) VALUES (?, ?, ?)', [slug, name_ar, name_en]);
    res.json({ message: 'Saved' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'This category already exists' });
    console.error(err);
    res.status(500).json({ message: 'Could not save' });
  }
});

// DELETE /api/categories/5
router.delete('/:id', auth, can('categories.delete'), async (req, res) => {
  try {
    const [[cat]] = await db.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!cat) return res.status(404).json({ message: 'Not found' });

    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM products WHERE category = ?', [cat.slug]);
    if (total > 0) return res.status(400).json({ message: 'Delete or move the products of this category first' });

    await db.query('DELETE FROM categories WHERE id = ?', [cat.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete' });
  }
});

module.exports = router;
