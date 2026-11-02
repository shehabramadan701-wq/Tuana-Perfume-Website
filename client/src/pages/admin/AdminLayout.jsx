// ===== Dashboard frame: gold sidebar + the current page =====
import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useLang } from '../../i18n/LanguageContext';
import { getUser, saveUser, can, logout } from '../../auth';
import { api } from '../../api';
import '../../styles/admin.css';

// The sidebar links. "permission" = who can see the link (see server/permissions.js)
const links = [
  { to: '/admin', label: 'side.sales', icon: '◈', permission: 'sales.view', end: true },
  { to: '/admin/products', label: 'side.products', icon: '❖', permission: 'products.add' },
  { to: '/admin/categories', label: 'side.categories', icon: '✦', permission: 'categories.add' },
  { to: '/admin/shipping', label: 'side.shipping', icon: '➤', permission: 'delivery.manage' },
  { to: '/admin/users', label: 'side.users', icon: '♛', permission: 'users.manage' },
];

export default function AdminLayout() {
  const { t, lang, toggleLang } = useLang();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getUser());

  // get fresh permissions from the server every time the dashboard opens
  useEffect(() => {
    if (!user) return;
    api('/auth/me')
      .then((fresh) => { saveUser(fresh); setUser(fresh); })
      .catch(() => {});
  }, []);

  if (!user) return <Navigate to="/admin/login" replace />;

  function signOut() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell">
      {/* ---------- Sidebar ---------- */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="side-logo">
          <span className="logo-en">TUANA</span>
          <span className="logo-ar">توانا</span>
        </div>

        <div className="side-user">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <small>{t('ad.hello')}</small>
            <strong>{user.name}</strong>
            <span className={`role-badge ${user.role}`}>{t('role.' + user.role)}</span>
          </div>
        </div>

        <nav className="side-nav">
          {links.filter((l) => can(l.permission)).map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setMenuOpen(false)}>
              <span className="side-icon">{l.icon}</span>
              {t(l.label)}
            </NavLink>
          ))}
        </nav>

        <div className="side-bottom">
          <Link to="/" className="side-site">↗ {t('side.site')}</Link>
          <div className="side-actions">
            <button className="side-lang" onClick={toggleLang}>{lang === 'ar' ? 'EN' : 'ع'}</button>
            <button className="side-logout" onClick={signOut}>{t('ad.logout')}</button>
          </div>
        </div>
      </aside>
      <div className={`side-bg ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* ---------- Page ---------- */}
      <div className="admin-main">
        <header className="admin-top">
          <button className="menu-btn" onClick={() => setMenuOpen(true)}>☰</button>
          <span className="admin-top-title">{t('ad.title')}</span>
        </header>
        <main className="admin-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Shown when a user opens a page they are not allowed to see
export function NoPermission() {
  const { t } = useLang();
  return <div className="panel center muted">🔒 {t('ad.noPermission')}</div>;
}
