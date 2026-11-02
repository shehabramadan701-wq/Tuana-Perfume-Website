// ===== Dashboard: payments, filters and Excel export =====
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../i18n/LanguageContext';
import useConfig from '../../context/useConfig';
import { api, money } from '../../api';
import '../../styles/admin.css';

// "2026-11-02" for a date that is N days ago
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString('en-CA');
}

const emptyFilters = { from: '', to: '', status: '', search: '' };

export default function Dashboard() {
  const { t, lang, toggleLang } = useLang();
  const { currency } = useConfig();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(emptyFilters);
  const [data, setData] = useState({ stats: {}, chart: [], orders: [] });
  const [loading, setLoading] = useState(true);

  const m = (v) => money(v, currency, lang);
  const query = '?' + new URLSearchParams(filters).toString();

  async function load() {
    setLoading(true);
    try {
      setData(await api('/admin/summary' + query));
    } catch {
      navigate('/admin/login'); // token missing or expired
    }
    setLoading(false);
  }

  // reload every time a filter changes
  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const change = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const preset = (days) => setFilters({ ...filters, from: days === null ? '' : daysAgo(days), to: days === null ? '' : daysAgo(0) });

  async function exportExcel() {
    const res = await api('/admin/export' + query, { raw: true });
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tuana-orders-${daysAgo(0)}.xlsx`;
    link.click();
  }

  function logout() {
    localStorage.removeItem('tuana_token');
    navigate('/admin/login');
  }

  const { stats, chart, orders } = data;
  const maxDay = Math.max(1, ...chart.map((c) => c.total));

  return (
    <div className="admin">
      <header className="admin-top">
        <div className="logo"><span className="logo-en">TUANA</span><span className="logo-ar">{t('ad.title')}</span></div>
        <div className="admin-top-actions">
          <button className="lang-btn" onClick={toggleLang}>{lang === 'ar' ? 'EN' : 'ع'}</button>
          <button className="btn btn-outline btn-small" onClick={logout}>{t('ad.logout')}</button>
        </div>
      </header>

      <main className="admin-body">
        {/* ---------- Filters ---------- */}
        <div className="filters">
          <div className="presets">
            <button onClick={() => preset(0)}>{t('ad.today')}</button>
            <button onClick={() => preset(6)}>{t('ad.week')}</button>
            <button onClick={() => preset(29)}>{t('ad.month')}</button>
            <button onClick={() => preset(null)}>{t('ad.all')}</button>
          </div>
          <label>{t('ad.from')}<input type="date" className="input" name="from" value={filters.from} onChange={change} /></label>
          <label>{t('ad.to')}<input type="date" className="input" name="to" value={filters.to} onChange={change} /></label>
          <label>{t('ad.status')}
            <select className="input" name="status" value={filters.status} onChange={change}>
              <option value="">{t('ad.allStatus')}</option>
              <option value="paid">{t('st.paid')}</option>
              <option value="pending">{t('st.pending')}</option>
              <option value="failed">{t('st.failed')}</option>
            </select>
          </label>
          <input className="input search" name="search" placeholder={t('ad.search')} value={filters.search} onChange={change} />
          <button className="btn btn-small excel-btn" onClick={exportExcel}>⬇ {t('ad.excel')}</button>
        </div>

        {/* ---------- Cards ---------- */}
        <div className="stat-cards">
          <div className="stat main"><span>{t('ad.revenue')}</span><strong>{m(stats.revenue)}</strong></div>
          <div className="stat"><span>{t('ad.paid')}</span><strong>{stats.paidCount || 0}</strong></div>
          <div className="stat"><span>{t('ad.avg')}</span><strong>{m(stats.average)}</strong></div>
          <div className="stat"><span>{t('ad.pending')}</span><strong>{stats.pendingCount || 0}</strong></div>
        </div>

        {/* ---------- Chart ---------- */}
        <div className="panel">
          <h3>{t('ad.chart')}</h3>
          {chart.length === 0 ? <p className="muted">{t('ad.noData')}</p> : (
            <div className="chart">
              {chart.map((c) => (
                <div className="bar-col" key={c.day} title={`${c.day} — ${m(c.total)}`}>
                  <span className="bar-value">{m(c.total)}</span>
                  <div className="bar" style={{ height: `${(c.total / maxDay) * 100}%` }} />
                  <span className="bar-label">{c.day.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Orders table ---------- */}
        <div className="panel">
          <h3>{t('ad.orders')} <small>({orders.length})</small></h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('ad.date')}</th>
                  <th>{t('ad.customer')}</th>
                  <th>{t('ad.items')}</th>
                  <th>{t('ad.total')}</th>
                  <th>{t('ad.card')}</th>
                  <th>{t('ad.status')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td className="nowrap">{o.created_at.slice(0, 16)}</td>
                    <td>
                      <strong>{o.customer_name}</strong>
                      <small dir="ltr">{o.phone}</small>
                    </td>
                    <td className="items">{o.items}</td>
                    <td className="nowrap"><strong>{m(o.total)}</strong></td>
                    <td className="nowrap" dir="ltr">{o.card_last4 ? `${o.card_brand} •••• ${o.card_last4}` : '—'}</td>
                    <td><span className={`badge ${o.status}`}>{t('st.' + o.status)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && orders.length === 0 && <p className="muted center">{t('ad.noData')}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
