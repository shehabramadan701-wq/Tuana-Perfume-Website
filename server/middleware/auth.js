// Protects dashboard routes.
//   router.get('/x', auth, ...)                      -> any logged-in user
//   router.post('/x', auth, can('products.add'), ...) -> only users with that permission
const jwt = require('jsonwebtoken');
const getPermissions = require('../permissions');

function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, name, email, role }
    next();
  } catch {
    res.status(401).json({ message: 'Please log in again' });
  }
}

function can(permission) {
  return (req, res, next) => {
    if (getPermissions(req.user.role).includes(permission)) return next();
    res.status(403).json({ message: 'You do not have permission for this' });
  };
}

module.exports = auth;
module.exports.can = can;
