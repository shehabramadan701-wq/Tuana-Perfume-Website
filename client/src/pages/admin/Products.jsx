// ===== Products page: add / edit / delete perfumes =====
import { useEffect, useState } from 'react';
import Bottle from '../../components/Bottle';
import { useLang } from '../../i18n/LanguageContext';
import useConfig from '../../context/useConfig';
import { api, money } from '../../api';
import { can } from '../../auth';

const emptyProduct = {
  name_ar: '', name_en: '', description_ar: '', description_en: '',
  category: '', price: '', size: '', color: '#8B5A2B', image_url: '',
};

export default function Products() {
  const { t, lang } = useLang();
  const { currency } = useConfig();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null); // null = form closed
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setProducts(await api('/products'));
    setCategories(await api('/categories'));
  }
  useEffect(() => { load(); }, []);

  const catName = (slug) => {
    const c = categories.find((c) => c.slug === slug);
    return c ? (lang === 'ar' ? c.name_ar : c.name_en) : slug;
  };

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      if (form.id) await api('/products/' + form.id, { method: 'PUT', body: form });
      else await api('/products', { method: 'POST', body: form });
      setForm(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(product) {
    if (!window.confirm(t('pr.confirm'))) return;
    try {
      await api('/products/' + product.id, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  const shown = products
    .filter((p) => !catFilter || p.category === catFilter)
    .filter((p) => (p.name_ar + ' ' + p.name_en).toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">{t('side.products')} <small>({products.length})</small></h1>
        {can('products.add') && !form && (
          <button className="btn" onClick={() => setForm({ ...emptyProduct, category: categories[0]?.slug || '' })}>{t('pr.add')}</button>
        )}
      </div>

      {/* ---------- Add / edit form ---------- */}
      {form && (
        <form className="panel product-form" onSubmit={save}>
          <h3>{form.id ? t('pr.editTitle') : t('pr.new')}</h3>
          {error && <div className="alert">{error}</div>}
          <div className="product-form-grid">
            <div className="form-preview">
              {form.image_url ? <img src={form.image_url} alt="" /> : <Bottle color={form.color} size={170} />}
            </div>
            <div className="form-fields">
              <label>{t('pr.nameAr')}<input className="input" name="name_ar" value={form.name_ar} onChange={change} required /></label>
              <label>{t('pr.nameEn')}<input className="input" name="name_en" value={form.name_en} onChange={change} dir="ltr" required /></label>
              <label>{t('pr.category')}
                <select className="input" name="category" value={form.category} onChange={change} required>
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
                </select>
              </label>
              <label>{t('pr.price')} ({currency})<input className="input" type="number" min="1" name="price" value={form.price} onChange={change} required /></label>
              <label>{t('pr.size')}<input className="input" name="size" value={form.size} onChange={change} /></label>
              <label>{t('pr.color')}<input className="input color-input" type="color" name="color" value={form.color} onChange={change} /></label>
              <label className="wide">{t('pr.descAr')}<textarea className="input" name="description_ar" value={form.description_ar} onChange={change} rows="2" /></label>
              <label className="wide">{t('pr.descEn')}<textarea className="input" name="description_en" value={form.description_en} onChange={change} rows="2" dir="ltr" /></label>
              <label className="wide">{t('pr.image')}<input className="input" name="image_url" value={form.image_url || ''} onChange={change} dir="ltr" placeholder="https://… or /images/oud.png" /></label>
            </div>
          </div>
          <div className="form-buttons">
            <button className="btn">{t('pr.save')}</button>
            <button type="button" className="btn btn-outline" onClick={() => setForm(null)}>{t('pr.cancel')}</button>
          </div>
        </form>
      )}

      {/* ---------- List ---------- */}
      <div className="panel">
        <div className="list-tools">
          <input className="input" placeholder={t('pr.search')} value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="">{t('pr.allCats')}</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('pr.product')}</th>
                <th>{t('pr.category')}</th>
                <th>{t('pr.price')}</th>
                <th>{t('ad.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                      <div className="mini-bottle">
                        {p.image_url ? <img src={p.image_url} alt="" /> : <Bottle color={p.color} size={50} />}
                      </div>
                      <div>
                        <strong>{lang === 'ar' ? p.name_ar : p.name_en}</strong>
                        <small>{lang === 'ar' ? p.name_en : p.name_ar} · {p.size}</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="chip">{catName(p.category)}</span></td>
                  <td className="nowrap"><strong>{money(p.price, currency, lang)}</strong></td>
                  <td className="nowrap">
                    {can('products.edit') && <button className="link-btn" onClick={() => setForm({ ...p })}>{t('pr.edit')}</button>}
                    {can('products.delete') && <button className="link-btn danger" onClick={() => remove(p)}>{t('pr.delete')}</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {shown.length === 0 && <p className="muted center">{t('ad.noData')}</p>}
        </div>
      </div>
    </>
  );
}
