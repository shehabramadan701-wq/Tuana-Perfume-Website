// =====================================================================
//  DEMO MODE (online preview link only — GitHub Pages)
//  When the site is built with "npm run build:demo" there is no server
//  and no MySQL: this file answers instead of the server, and saves
//  orders in the visitor's browser. The real site never uses this file.
// =====================================================================

export const DEMO_LOGIN = { email: 'admin@tuana.com', password: 'change-me-123' };

const products = [
  { id: 1, name_ar: 'عود ملكي', name_en: 'Oud Reale', description_ar: 'عود كمبودي معتّق بلمسة من الورد الطائفي.', description_en: 'Aged Cambodian oud, softened with a whisper of Taif rose.', category: 'oud', price: 2450, size: '50 ml', color: '#5B3A1E' },
  { id: 2, name_ar: 'دهن العود الأسود', name_en: 'Nero di Oud', description_ar: 'دهن عود خالص، عميق وداخن يدوم طويلاً.', description_en: 'Pure oud oil — deep, smoky and endlessly long-lasting.', category: 'oud', price: 3200, size: '12 ml', color: '#2E1F17' },
  { id: 3, name_ar: 'خمرة الشيوخ', name_en: 'Khumra Sultana', description_ar: 'خمرة مخملية من العنبر والمسك والزعفران.', description_en: 'A velvet khumra of amber, musk and precious saffron.', category: 'khumra', price: 1350, size: '60 g', color: '#8C3B2E' },
  { id: 4, name_ar: 'خمرة الورد', name_en: 'Khumra di Rosa', description_ar: 'خمرة ناعمة بالورد الدمشقي والفانيليا.', description_en: 'Soft khumra of Damascene rose and warm vanilla.', category: 'khumra', price: 1150, size: '60 g', color: '#B5654A' },
  { id: 5, name_ar: 'مسك الطهارة', name_en: 'Musk Bianco', description_ar: 'مسك أبيض نقي ناعم كالحرير.', description_en: 'Pure white musk, clean and soft as silk.', category: 'perfume', price: 890, size: '100 ml', color: '#C9B79C' },
  { id: 6, name_ar: 'عنبر الصحراء', name_en: 'Ambra del Deserto', description_ar: 'عنبر دافئ مع الهيل وخشب الصندل.', description_en: 'Warm amber with cardamom and sandalwood.', category: 'perfume', price: 1650, size: '100 ml', color: '#B8893B' },
  { id: 7, name_ar: 'ليالي الشرق', name_en: "Notte d'Oriente", description_ar: 'عطر ليلي من العود والباتشولي والجلد.', description_en: 'A night perfume of oud, patchouli and soft leather.', category: 'perfume', price: 1980, size: '75 ml', color: '#3E4A5C' },
  { id: 8, name_ar: 'بخور الحرمين', name_en: 'Bakhoor Antico', description_ar: 'بخور فاخر بقطع العود والعنبر لتعطير البيت.', description_en: 'Fine bakhoor of oud chips and amber, to perfume the home.', category: 'bakhoor', price: 750, size: '40 g', color: '#6F4E37' },
];

// "2026-11-02 10:30:00" for N days ago
function stamp(daysAgo = 0) {
  const d = new Date(Date.now() - daysAgo * 86400000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

function sampleOrders() {
  const rows = [
    ['أحمد محمود', '01001234567', 'paid', 'visa', '4242', 0, 'Oud Reale x2', 4900],
    ['Sara Ali', '01112223334', 'paid', 'mastercard', '5454', 1, 'Khumra Sultana x1', 1350],
    ['محمد خالد', '01223334445', 'paid', 'visa', '1881', 2, 'Nero di Oud x1', 3200],
    ['Nour Hassan', '01554445556', 'failed', 'visa', '0002', 3, "Notte d'Oriente x1", 1980],
    ['ياسمين علي', '01005556667', 'paid', 'mastercard', '4444', 4, 'Khumra di Rosa x2', 2300],
    ['Omar Fathy', '01116667778', 'pending', null, null, 5, 'Musk Bianco x1', 890],
    ['هالة سمير', '01227778889', 'paid', 'visa', '4242', 7, 'Nero di Oud x1, Oud Reale x1', 5650],
    ['Karim Adel', '01558889990', 'paid', 'mastercard', '9876', 10, 'Ambra del Deserto x1', 1650],
    ['منى إبراهيم', '01009990001', 'paid', 'visa', '1111', 13, 'Bakhoor Antico x1', 750],
    ['Youssef Samy', '01110001112', 'paid', 'visa', '3333', 20, 'Oud Reale x1', 2450],
  ];
  return rows.map(([customer_name, phone, status, card_brand, card_last4, days, items, total], i) => ({
    id: i + 1, customer_name, phone, email: '', city: '', status, card_brand, card_last4, items, total,
    currency: 'EGP', created_at: stamp(days),
  }));
}

// orders are kept in this browser only
function loadOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem('tuana_demo_orders'));
    if (Array.isArray(saved)) return saved;
  } catch {}
  return sampleOrders();
}
function saveOrders(orders) {
  try { localStorage.setItem('tuana_demo_orders', JSON.stringify(orders)); } catch {}
}

function filterOrders(query) {
  const q = Object.fromEntries(new URLSearchParams(query));
  return loadOrders()
    .filter((o) => !q.from || o.created_at.slice(0, 10) >= q.from)
    .filter((o) => !q.to || o.created_at.slice(0, 10) <= q.to)
    .filter((o) => !q.status || o.status === q.status)
    .filter((o) => !q.search || [o.customer_name, o.phone, o.email, String(o.id)].join(' ').toLowerCase().includes(q.search.toLowerCase()))
    .sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id - a.id);
}

function summary(query) {
  const orders = filterOrders(query);
  const paid = orders.filter((o) => o.status === 'paid');
  const revenue = paid.reduce((s, o) => s + Number(o.total), 0);
  const byDay = {};
  paid.forEach((o) => { const d = o.created_at.slice(0, 10); byDay[d] = (byDay[d] || 0) + Number(o.total); });
  return {
    stats: { revenue, paidCount: paid.length, average: paid.length ? revenue / paid.length : 0, pendingCount: orders.length - paid.length },
    chart: Object.keys(byDay).sort().slice(-30).map((day) => ({ day, total: byDay[day] })),
    orders,
  };
}

// Excel opens this CSV file directly (the real site makes a true .xlsx)
function exportFile(query) {
  const head = ['Order #', 'Date', 'Customer', 'Phone', 'Items', 'Total', 'Currency', 'Status', 'Card'];
  const lines = filterOrders(query).map((o) => [o.id, o.created_at, o.customer_name, o.phone, o.items, o.total, o.currency, o.status, o.card_last4 ? `${o.card_brand} **** ${o.card_last4}` : '']);
  const csv = [head, ...lines].map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
  return new Response('﻿' + csv, { headers: { 'Content-Type': 'text/csv;charset=utf-8' } });
}

export async function mockApi(path, options = {}) {
  const [route, query = ''] = path.split('?');
  const body = options.body || {};
  await new Promise((r) => setTimeout(r, 250)); // feel like a real server

  if (route === '/config') return { currency: 'EGP', paymentMode: 'demo', stripePublishableKey: '' };
  if (route === '/products') return products;

  if (route === '/orders/checkout') {
    const orders = loadOrders();
    const lines = body.items.map((i) => ({ p: products.find((p) => p.id === i.id), q: i.quantity })).filter((l) => l.p);
    const order = {
      id: Math.max(0, ...orders.map((o) => o.id)) + 1,
      customer_name: body.customer.name, email: body.customer.email, phone: body.customer.phone, city: body.customer.city,
      items: lines.map((l) => `${l.p.name_en} x${l.q}`).join(', '),
      total: lines.reduce((s, l) => s + l.p.price * l.q, 0),
      currency: 'EGP', status: 'pending', created_at: stamp(0),
    };
    saveOrders([...orders, order]);
    return { orderId: order.id, total: order.total, clientSecret: null };
  }

  const confirm = route.match(/^\/orders\/(\d+)\/confirm$/);
  if (confirm) {
    const orders = loadOrders();
    const order = orders.find((o) => o.id === Number(confirm[1]));
    Object.assign(order, { status: 'paid', card_brand: body.demoCard?.brand, card_last4: body.demoCard?.last4 });
    saveOrders(orders);
    return { status: 'paid' };
  }

  if (route === '/admin/login') {
    if (body.email === DEMO_LOGIN.email && body.password === DEMO_LOGIN.password) return { token: 'demo' };
    throw new Error('Wrong email or password');
  }
  if (route === '/admin/summary') return summary(query);
  if (route === '/admin/export') return exportFile(query);

  throw new Error('Not found');
}
