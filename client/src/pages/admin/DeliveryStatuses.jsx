// ===== Shipping steps page: rename / recolor / reorder / add / delete (admin) =====
import { useEffect, useState } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { api } from '../../api';

const emptyStep = { name_ar: '', name_en: '', color: '#B8893B' };

export default function DeliveryStatuses() {
  const { t } = useLang();
  const [steps, setSteps] = useState([]);
  const [form, setForm] = useState(emptyStep);
  const [error, setError] = useState('');
  const [savedId, setSavedId] = useState(null);

  const load = async () => setSteps(await api('/delivery-statuses'));
  useEffect(() => { load(); }, []);

  // typing in a row changes it on the screen; "Save" sends it to the server
  const changeRow = (id, field, value) => setSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  async function saveRow(step) {
    try {
      await api('/delivery-statuses/' + step.id, { method: 'PUT', body: step });
      setSavedId(step.id);
      setTimeout(() => setSavedId(null), 1500);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  // move a step up (-1) or down (+1), then save the new order of all steps
  async function move(index, direction) {
    const list = [...steps];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    const renumbered = list.map((s, i) => ({ ...s, sort_order: i + 1 }));
    setSteps(renumbered);
    try {
      for (const s of renumbered) {
        const before = steps.find((x) => x.id === s.id);
        if (before.sort_order !== s.sort_order) await api('/delivery-statuses/' + s.id, { method: 'PUT', body: s });
      }
    } catch (err) {
      alert(err.message);
    }
    load();
  }

  async function removeRow(step) {
    if (!window.confirm(t('pr.confirm'))) return;
    try {
      await api('/delivery-statuses/' + step.id, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function add(e) {
    e.preventDefault();
    setError('');
    try {
      await api('/delivery-statuses', { method: 'POST', body: form });
      setForm(emptyStep);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1 className="page-title">{t('side.shipping')} <small>({steps.length})</small></h1>
      <p className="muted">{t('sh.hint')}</p>

      {/* ---------- Steps ---------- */}
      <div className="panel">
        <div className="steps-list">
          {steps.map((s, i) => (
            <div className="step-row" key={s.id}>
              <span className="step-num" style={{ background: s.color }}>{i + 1}</span>
              <input className="input" value={s.name_ar} onChange={(e) => changeRow(s.id, 'name_ar', e.target.value)} aria-label={t('sh.nameAr')} />
              <input className="input" dir="ltr" value={s.name_en} onChange={(e) => changeRow(s.id, 'name_en', e.target.value)} aria-label={t('sh.nameEn')} />
              <input className="input color-input" type="color" value={s.color} onChange={(e) => changeRow(s.id, 'color', e.target.value)} title={t('sh.color')} />
              <div className="step-move">
                <button onClick={() => move(i, -1)} disabled={i === 0} title={t('sh.order')}>▲</button>
                <button onClick={() => move(i, 1)} disabled={i === steps.length - 1} title={t('sh.order')}>▼</button>
              </div>
              <div className="step-actions">
                <button className="link-btn" onClick={() => saveRow(s)}>{savedId === s.id ? t('sh.saved') : t('sh.save')}</button>
                {s.slug !== 'new' && <button className="link-btn danger" onClick={() => removeRow(s)}>{t('pr.delete')}</button>}
                <span className="step-count">{s.orders_count} {t('sh.orders')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Add a step ---------- */}
      <form className="panel inline-form" onSubmit={add}>
        <label>{t('sh.nameAr')}<input className="input" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} required /></label>
        <label>{t('sh.nameEn')}<input className="input" dir="ltr" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} required /></label>
        <label style={{ flex: '0 0 90px', minWidth: 0 }}>{t('sh.color')}<input className="input color-input" type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></label>
        <button className="btn">{t('sh.add')}</button>
        {error && <div className="alert wide">{error}</div>}
      </form>
    </>
  );
}
