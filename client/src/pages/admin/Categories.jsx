// ===== Categories page: add / delete categories =====
import { useEffect, useState } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { api } from '../../api';
import { can } from '../../auth';

export default function Categories() {
  const { t } = useLang();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name_ar: '', name_en: '' });
  const [error, setError] = useState('');

  const load = async () => setCategories(await api('/categories'));
  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    setError('');
    try {
      await api('/categories', { method: 'POST', body: form });
      setForm({ name_ar: '', name_en: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(cat) {
    if (!window.confirm(t('pr.confirm'))) return;
    try {
      await api('/categories/' + cat.id, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <h1 className="page-title">{t('side.categories')} <small>({categories.length})</small></h1>

      {can('categories.add') && (
        <form className="panel inline-form" onSubmit={add}>
          <label>{t('ct.nameAr')}<input className="input" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} required /></label>
          <label>{t('ct.nameEn')}<input className="input" dir="ltr" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} required /></label>
          <button className="btn">{t('ct.add')}</button>
          {error && <div className="alert wide">{error}</div>}
        </form>
      )}

      <div className="cat-grid">
        {categories.map((c) => (
          <div className="cat-card" key={c.id}>
            <span className="cat-star">✦</span>
            <strong>{c.name_ar}</strong>
            <span className="cat-en">{c.name_en}</span>
            <span className="chip">{c.products_count} {t('ct.count')}</span>
            {can('categories.delete') && (
              <button className="link-btn danger" onClick={() => remove(c)}>{t('pr.delete')}</button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
