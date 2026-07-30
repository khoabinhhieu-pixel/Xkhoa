const TONES = [
  { from: "#5c5340", via: "#463d2e", to: "#221d15" }, // stone
  { from: "#4a5c44", via: "#374630", to: "#1a2216" }, // olive / forest
  { from: "#5c4033", via: "#462f25", to: "#221712" }, // rust
  { from: "#3d4552", via: "#2d333d", to: "#161a20" }, // slate
  { from: "#4f4459", via: "#3a3242", to: "#1c1821" }, // plum
  { from: "#5c5236", via: "#463e28", to: "#221e13" }, // sand
];

type PlaceholderProps = {
  tone?: number;
  label?: string;
  className?: string;
};

export default function Placeholder({
  tone = 0,
  label,
  className = "",
}: PlaceholderProps) {
  const t = TONES[tone % TONES.length];
  const hasPosition = /(?:^|\s)(?:absolute|fixed|sticky|static)(?:\s|$)/.test(
    className,
  );

  return (
    <div
      className={`${hasPosition ? "" : "relative"} overflow-hidden ring-1 ring-inset ring-white/[0.06] ${className}`}
      style={{
        backgroundImage: `radial-gradient(120% 140% at 20% 0%, ${t.from} 0%, ${t.via} 55%, ${t.to} 100%)`,
      }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.08] mix-blend-overlay">
        <filter id={`grain-${tone}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${tone})`} />
      </svg>
      {label ? (
        <span className="tracked-label absolute bottom-3 left-3 text-[10px] text-fg/50">
          {label}
        </span>
      ) : null}
    </div>
  );
}
