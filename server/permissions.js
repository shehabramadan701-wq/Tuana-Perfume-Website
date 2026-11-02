// ===== Who can do what in the dashboard =====
// To give "staff" more power, just add the permission to its list.
const permissions = {
  admin: [
    'sales.view',        // sales page, orders and Excel
    'orders.delivery',   // change shipping status (shipped / delivered ...)
    'products.add',
    'products.edit',
    'products.delete',
    'categories.add',
    'categories.delete',
    'users.manage',      // add / delete dashboard users
  ],
  staff: [
    'products.add',
    'products.delete',
    'categories.add',
  ],
};

module.exports = (role) => permissions[role] || [];
