const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');
const getPermissions = require('../permissions');

// POST /api/auth/login  { email, password }
router.post('/login', async (req, res) => {
  try {
    const [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [req.body.email]);

    if (!user || !bcrypt.compareSync(req.body.password || '', user.password)) {
      return res.status(401).json({ message: 'Wrong email or password' });
    }

    const info = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(info, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { ...info, permissions: getPermissions(user.role) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not log in' });
  }
});

module.exports = router;
