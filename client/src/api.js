import { mockApi } from './demo/mockApi';
import { logout } from './auth';

// true only in the online preview build (npm run build:demo)
export const IS_DEMO = import.meta.env.VITE_DEMO === 'true';

// Small helper to talk to the server. Example: api('/products')
export async function api(path, options = {}) {
  if (IS_DEMO) return mockApi(path, options);

  const token = localStorage.getItem('tuana_token');

  const res = await fetch('/api' + path, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // login expired -> back to the login page
  if (res.status === 401 && path !== '/auth/login') {
    logout();
    window.location.reload();
  }

  if (options.raw) return res; // used for downloading the Excel file
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// Smooth scroll to a section of the page: <a onClick={(e) => scrollToId(e, 'story')}>
export function scrollToId(event, id) {
  event.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// Format a price: 2450 -> "EGP 2,450" / "٢٬٤٥٠ ج.م.‏"
export function money(value, currency = 'EGP', lang = 'en') {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}
