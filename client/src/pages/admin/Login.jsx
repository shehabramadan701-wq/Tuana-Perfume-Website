import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Ornament from '../../components/Ornament';
import { useLang } from '../../i18n/LanguageContext';
import { api } from '../../api';
import '../../styles/admin.css';

export default function Login() {
  const { t, lang, toggleLang } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const { token } = await api('/admin/login', { method: 'POST', body: form });
      localStorage.setItem('tuana_token', token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
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
          <input className="input" type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>{t('ad.password')}
          <input className="input" type="password" dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button className="btn btn-full">{t('ad.login')}</button>
      </form>
    </div>
  );
}
