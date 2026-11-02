// Visa / Mastercard logos (drawn with code, no images needed)
export function VisaLogo({ dim }) {
  return <span className={`card-logo visa ${dim ? 'dim' : ''}`}>VISA</span>;
}

export function MastercardLogo({ dim }) {
  return (
    <span className={`card-logo mc ${dim ? 'dim' : ''}`}>
      <i /><i />
    </span>
  );
}

// Shows both logos, and highlights the one being typed
export default function CardBadges({ brand }) {
  return (
    <div className="card-badges">
      <VisaLogo dim={brand && brand !== 'visa'} />
      <MastercardLogo dim={brand && brand !== 'mastercard'} />
    </div>
  );
}
