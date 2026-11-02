import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Ornament from '../../components/Ornament';
import { useLang } from '../../i18n/LanguageContext';
import { api, IS_DEMO } from '../../api';
import { getUser, saveLogin } from '../../auth';
import '../../styles/admin.css';

// Demo accounts (also created by database/schema.sql)
const demoUsers = {
  admin: { email: 'admin@tuana.com', password: 'change-me-123' },
  staff: { email: 'staff@tuana.com', password: 'staff-123' },
};

export default function Login() {
  const { t, lang, toggleLang } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (getUser()) return <Navigate to="/admin" replace />;

  async function login(data) {
    setError('');
    try {
      const { token, user } = await api('/auth/login', { method: 'POST', body: data });
      saveLogin(token, user);
      // staff has no sales page -> open products directly
      navigate(user.permissions.includes('sales.view') ? '/admin' : '/admin/products');
    } catch (err) {
      setError(err.message);
    }
  }

  function submit(e) {
    e.preventDefault();
    login(form);
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={submit}>
        <button type="button" className="lang-btn login-lang" onClick={toggleLang}>{lang === 'ar' ? 'EN' : 'ع'}</button>
        <div className="logo"><span className="logo-en">TUANA</span><span className="logo-ar">توانا</span></div>
        <Ornament />
        <h2>{t('ad.title')}</h2>
        {error && <div className="alert">{error}</div>}
        <label>{t('ad.email')}
          <input className="input" type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label>{t('ad.password')}
          <input className="input" type="password" dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button className="btn btn-full">{t('ad.login')}</button>

        {/* only in the online preview: one-click demo logins */}
        {IS_DEMO && (
          <div className="demo-logins">
            <small>{t('ad.demoUsers')}</small>
            <div>
              <button type="button" className="btn btn-outline btn-small" onClick={() => login(demoUsers.admin)}>♛ {t('ad.asAdmin')}</button>
              <button type="button" className="btn btn-outline btn-small" onClick={() => login(demoUsers.staff)}>❖ {t('ad.asStaff')}</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
