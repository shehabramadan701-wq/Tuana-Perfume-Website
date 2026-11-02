// Sales page: summary + Excel (admin only, see permissions.js)
const router = require('express').Router();
const ExcelJS = require('exceljs');
const db = require('../db');
const auth = require('../middleware/auth');
const { can } = auth;

router.use(auth, can('sales.view'));

// ---------- Filters used by all dashboard routes ----------
// ?from=2026-11-01&to=2026-11-30&status=paid&search=ahmed
function buildFilters(query) {
  const where = [];
  const params = [];

  if (query.from)   { where.push('DATE(o.created_at) >= ?'); params.push(query.from); }
  if (query.to)     { where.push('DATE(o.created_at) <= ?'); params.push(query.to); }
  if (query.status) { where.push('o.status = ?');            params.push(query.status); }
  if (query.delivery) { where.push('o.delivery_status = ?'); params.push(query.delivery); }
  if (query.search) {
    where.push('(o.customer_name LIKE ? OR o.email LIKE ? OR o.phone LIKE ? OR o.id = ?)');
    const s = `%${query.search}%`;
    params.push(s, s, s, query.search);
  }

  return { sql: where.length ? 'WHERE ' + where.join(' AND ') : '', params };
}

async function getOrders(query) {
  const f = buildFilters(query);
  const [rows] = await db.query(
    `SELECT o.*,
       GROUP_CONCAT(CONCAT(i.product_name, ' x', i.quantity) SEPARATOR ', ') AS items
     FROM orders o
     LEFT JOIN order_items i ON i.order_id = o.id
     ${f.sql}
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    f.params
  );
  return rows;
}

// ---------- GET /api/admin/summary  (cards + chart + table) ----------
router.get('/summary', async (req, res) => {
  try {
    const orders = await getOrders(req.query);
    const paid = orders.filter((o) => o.status === 'paid');
    const revenue = paid.reduce((sum, o) => sum + Number(o.total), 0);

    // Revenue per day for the chart
    const byDay = {};
    paid.forEach((o) => {
      const day = o.created_at.slice(0, 10);
      byDay[day] = (byDay[day] || 0) + Number(o.total);
    });
    const chart = Object.keys(byDay).sort().slice(-30).map((day) => ({ day, total: byDay[day] }));

    res.json({
      stats: {
        revenue,
        paidCount: paid.length,
        average: paid.length ? revenue / paid.length : 0,
        pendingCount: orders.filter((o) => o.status !== 'paid').length,
      },
      chart,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load the dashboard' });
  }
});

// ---------- PUT /api/admin/orders/5/delivery  { delivery_status: 'shipped' } ----------
const deliveryStatuses = ['new', 'preparing', 'shipped', 'delivered', 'cancelled'];

router.put('/orders/:id/delivery', can('orders.delivery'), async (req, res) => {
  const { delivery_status } = req.body;
  if (!deliveryStatuses.includes(delivery_status)) return res.status(400).json({ message: 'Unknown status' });
  try {
    await db.query('UPDATE orders SET delivery_status = ? WHERE id = ?', [delivery_status, req.params.id]);
    res.json({ message: 'Saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save' });
  }
});

// ---------- GET /api/admin/export  (Excel file) ----------
router.get('/export', async (req, res) => {
  try {
    const orders = await getOrders(req.query);

    const book = new ExcelJS.Workbook();
    const sheet = book.addWorksheet('Orders');
    sheet.columns = [
      { header: 'Order #',  key: 'id',            width: 10 },
      { header: 'Date',     key: 'created_at',    width: 20 },
      { header: 'Customer', key: 'customer_name', width: 22 },
      { header: 'Email',    key: 'email',         width: 26 },
      { header: 'Phone',    key: 'phone',         width: 16 },
      { header: 'City',     key: 'city',          width: 14 },
      { header: 'Items',    key: 'items',         width: 40 },
      { header: 'Total',    key: 'total',         width: 12 },
      { header: 'Currency', key: 'currency',      width: 10 },
      { header: 'Payment',  key: 'status',        width: 10 },
      { header: 'Shipping', key: 'delivery_status', width: 12 },
      { header: 'Card',     key: 'card',          width: 18 },
    ];

    orders.forEach((o) =>
      sheet.addRow({
        ...o,
        total: Number(o.total),
        card: o.card_last4 ? `${o.card_brand} •••• ${o.card_last4}` : '',
      })
    );

    // Header style (gold)
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB8893B' } };

    // Total row for paid orders
    const paidTotal = orders.filter((o) => o.status === 'paid').reduce((s, o) => s + Number(o.total), 0);
    sheet.addRow({});
    const totalRow = sheet.addRow({ items: 'Total paid', total: paidTotal });
    totalRow.font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="tuana-orders.xlsx"');
    await book.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not export' });
  }
});

module.exports = router;
