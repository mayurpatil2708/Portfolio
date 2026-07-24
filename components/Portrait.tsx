interface PortraitProps {
  className?: string;
}

export default function Portrait({ className }: PortraitProps) {
  return (
    <div className={`portrait ${className ?? ""}`}>
      <img
        src="/mayur-portrait.png"
        alt="Mayur Patil at his desk working on traffic engineering CAD drawings"
        loading="lazy"
      />
    </div>
  );
}
