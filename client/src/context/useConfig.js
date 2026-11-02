// Loads shop settings from the server (currency, payment mode, Stripe key).
import { useEffect, useState } from 'react';
import { api } from '../api';

let cache = null;

export default function useConfig() {
  const [config, setConfig] = useState(cache || { currency: 'EGP', paymentMode: 'demo' });

  useEffect(() => {
    if (cache) return;
    api('/config')
      .then((data) => { cache = data; setConfig(data); })
      .catch(() => {});
  }, []);

  return config;
}
