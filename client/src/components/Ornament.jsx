// A small golden Arabic divider:  ——— ✦ ———
export default function Ornament() {
  return (
    <div className="ornament">
      <span className="line" />
      <svg viewBox="0 0 24 24" width="22" height="22">
        <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill="currentColor" />
      </svg>
      <span className="line" />
    </div>
  );
}
