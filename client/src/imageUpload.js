// Upload a product photo: makes it smaller (max 900px, WEBP keeps transparent backgrounds)
// then sends it to the server. Returns the photo link.
import { api, IS_DEMO } from './api';

function resize(file, max = 900) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/webp', 0.88));
    };
    img.onerror = () => reject(new Error('Please choose an image file'));
    img.src = URL.createObjectURL(file);
  });
}

export async function uploadImage(file) {
  const data = await resize(file, IS_DEMO ? 500 : 900);
  if (IS_DEMO) return data; // online preview: keep the photo inside the browser
  const { url } = await api('/uploads', { method: 'POST', body: { data } });
  return url;
}
