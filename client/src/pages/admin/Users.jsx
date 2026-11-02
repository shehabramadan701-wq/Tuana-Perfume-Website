// ===== Users page: who can open the dashboard (admin only) =====
import { useEffect, useState } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { api } from '../../api';
import { getUser } from '../../auth';

const emptyUser = { name: '', email: '', password: '', role: 'staff' };

export default function Users() {
  const { t } = useLang();
  const me = getUser();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyUser);
  const [error, setError] = useState('');

  const load = async () => setUsers(await api('/users'));
  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function add(e) {
    e.preventDefault();
    setError('');
    try {
      await api('/users', { method: 'POST', body: form });
      setForm(emptyUser);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function changePassword(user) {
    const password = window.prompt(t('us.newPass'));
    if (!password) return;
    try {
      await api(`/users/${user.id}/password`, { method: 'PUT', body: { password } });
      alert('✓');
    } catch (err) {
      alert(err.message);
    }
  }

  async function remove(user) {
    if (!window.confirm(t('pr.confirm'))) return;
    try {
      await api('/users/' + user.id, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <h1 className="page-title">{t('side.users')} <small>({users.length})</small></h1>

      <form className="panel inline-form" onSubmit={add}>
        <label>{t('us.name')}<input className="input" name="name" value={form.name} onChange={change} required /></label>
        <label>{t('us.email')}<input className="input" type="email" dir="ltr" name="email" value={form.email} onChange={change} required /></label>
        <label>{t('us.password')}<input className="input" type="password" dir="ltr" name="password" value={form.password} onChange={change} minLength="6" required /></label>
        <label>{t('us.role')}
          <select className="input" name="role" value={form.role} onChange={change}>
            <option value="staff">{t('role.staff')}</option>
            <option value="admin">{t('role.admin')}</option>
          </select>
        </label>
        <button className="btn">{t('us.add')}</button>
        <p className="muted wide hint">♛ {t('us.adminHint')} &nbsp;·&nbsp; ❖ {t('us.staffHint')}</p>
        {error && <div className="alert wide">{error}</div>}
      </form>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('us.name')}</th>
                <th>{t('us.email')}</th>
                <th>{t('us.role')}</th>
                <th>{t('ad.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="product-cell">
                      <div className="avatar small">{u.name.charAt(0).toUpperCase()}</div>
                      <strong>{u.name} {u.email === me.email && <small className="you">({t('us.you')})</small>}</strong>
                    </div>
                  </td>
                  <td dir="ltr">{u.email}</td>
                  <td><span className={`role-badge ${u.role}`}>{t('role.' + u.role)}</span></td>
                  <td className="nowrap">
                    <button className="link-btn" onClick={() => changePassword(u)}>{t('us.changePass')}</button>
                    {u.email !== me.email && <button className="link-btn danger" onClick={() => remove(u)}>{t('pr.delete')}</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
