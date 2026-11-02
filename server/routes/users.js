// Dashboard users (admin only)
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const auth = require('../middleware/auth');
const { can } = auth;

router.use(auth, can('users.manage'));

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load users' });
  }
});

// POST /api/users  { name, email, password, role }
router.post('/', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Name, email and a password of 6+ characters are required' });
  }
  try {
    await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
      name, email, bcrypt.hashSync(password, 10), role === 'admin' ? 'admin' : 'staff',
    ]);
    res.json({ message: 'Saved' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'This email is already used' });
    console.error(err);
    res.status(500).json({ message: 'Could not save' });
  }
});

// PUT /api/users/3/password  { password }
router.put('/:id/password', async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be 6+ characters' });
  try {
    await db.query('UPDATE users SET password = ? WHERE id = ?', [bcrypt.hashSync(password, 10), req.params.id]);
    res.json({ message: 'Saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save' });
  }
});

// DELETE /api/users/3
router.delete('/:id', async (req, res) => {
  if (Number(req.params.id) === req.user.id) return res.status(400).json({ message: 'You cannot delete yourself' });
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete' });
  }
});

module.exports = router;
