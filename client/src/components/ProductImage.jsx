// Shows the real product photo, or the drawn bottle when there is no photo.
// <ProductImage product={p} size={170} />
import Bottle from './Bottle';

// photos from client/public/images work both on the real site and on GitHub Pages
export function photoUrl(url) {
  if (!url) return '';
  if (url.startsWith('/images/')) return import.meta.env.BASE_URL + url.slice(1);
  return url;
}

export default function ProductImage({ product, size = 170 }) {
  if (product.image_url) {
    return <img className="product-photo" src={photoUrl(product.image_url)} alt={product.name_en} loading="lazy" />;
  }
  return <Bottle color={product.color} size={size} />;
}
