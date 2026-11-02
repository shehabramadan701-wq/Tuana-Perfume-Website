// Shipping steps (طلب جديد ← قيد التجهيز ← تم الشحن ← تم التوصيل ...)
// Everyone logged in can read them, only admin can change them.
const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { can } = auth;

router.use(auth);

// GET /api/delivery-statuses  (+ how many orders are in each step)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.*, COUNT(o.id) AS orders_count
       FROM delivery_statuses d LEFT JOIN orders o ON o.delivery_status = d.slug
       GROUP BY d.id ORDER BY d.sort_order, d.id`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load' });
  }
});

// POST /api/delivery-statuses  { name_ar, name_en, color }
router.post('/', can('delivery.manage'), async (req, res) => {
  const { name_ar, name_en, color } = req.body;
  if (!name_ar || !name_en) return res.status(400).json({ message: 'Write the name in Arabic and English' });
  const slug = name_en.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'step-' + Date.now();
  try {
    const [[{ last }]] = await db.query('SELECT COALESCE(MAX(sort_order), 0) AS last FROM delivery_statuses');
    await db.query('INSERT INTO delivery_statuses (slug, name_ar, name_en, color, sort_order) VALUES (?, ?, ?, ?, ?)', [
      slug, name_ar, name_en, color || '#B8893B', last + 1,
    ]);
    res.json({ message: 'Saved' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'This status already exists' });
    console.error(err);
    res.status(500).json({ message: 'Could not save' });
  }
});

// PUT /api/delivery-statuses/3  { name_ar, name_en, color, sort_order }
router.put('/:id', can('delivery.manage'), async (req, res) => {
  const { name_ar, name_en, color, sort_order } = req.body;
  if (!name_ar || !name_en) return res.status(400).json({ message: 'Write the name in Arabic and English' });
  try {
    await db.query('UPDATE delivery_statuses SET name_ar = ?, name_en = ?, color = ?, sort_order = ? WHERE id = ?', [
      name_ar, name_en, color || '#B8893B', Number(sort_order) || 0, req.params.id,
    ]);
    res.json({ message: 'Saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save' });
  }
});

// DELETE /api/delivery-statuses/3
router.delete('/:id', can('delivery.manage'), async (req, res) => {
  try {
    const [[step]] = await db.query('SELECT * FROM delivery_statuses WHERE id = ?', [req.params.id]);
    if (!step) return res.status(404).json({ message: 'Not found' });
    if (step.slug === 'new') return res.status(400).json({ message: 'The "New order" step is used for every new order, it cannot be deleted' });

    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM orders WHERE delivery_status = ?', [step.slug]);
    if (total > 0) return res.status(400).json({ message: 'Move the orders of this step to another step first' });

    await db.query('DELETE FROM delivery_statuses WHERE id = ?', [step.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete' });
  }
});

module.exports = router;
