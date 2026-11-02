// Upload a product photo from the dashboard.
// The browser sends the photo as text (a "data URL"), we save it in server/uploads/
// and answer with its link, e.g. { url: '/uploads/1730540000000.webp' }
const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const { can } = auth;

const folder = path.join(__dirname, '..', 'uploads');

router.post('/', auth, can('products.add'), (req, res) => {
  const match = /^data:image\/(png|jpeg|webp);base64,(.+)$/.exec(req.body.data || '');
  if (!match) return res.status(400).json({ message: 'Please choose a PNG, JPG or WEBP image' });

  const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
  const fileName = Date.now() + '.' + extension;

  try {
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, fileName), Buffer.from(match[2], 'base64'));
    res.json({ url: '/uploads/' + fileName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save the image' });
  }
});

module.exports = router;
