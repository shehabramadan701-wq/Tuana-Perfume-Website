// Small helper to talk to the server. Example: api('/products')
export async function api(path, options = {}) {
  const token = localStorage.getItem('tuana_token');

  const res = await fetch('/api' + path, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (options.raw) return res; // used for downloading the Excel file
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// Format a price: 2450 -> "EGP 2,450" / "٢٬٤٥٠ ج.م.‏"
export function money(value, currency = 'EGP', lang = 'en') {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}
