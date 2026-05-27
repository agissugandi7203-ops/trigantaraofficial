interface SectionDividerProps {
  variant?: 'wave' | 'zigzag' | 'torn';
  color?: string;
  flip?: boolean;
  className?: string;
}

export default function SectionDivider({ variant = 'wave', color = '#FAF6F0', flip = false, className = '' }: SectionDividerProps) {
  const transform = flip ? 'rotate(180deg)' : 'none';
  
  const paths = {
    wave: 'M0,64 C150,120 350,0 500,64 L500,200 L0,200 Z',
    zigzag: 'M0,80 L50,40 L100,80 L150,40 L200,80 L250,40 L300,80 L350,40 L400,80 L450,40 L500,80 L500,200 L0,200 Z',
    torn: 'M0,96 L30,64 L60,80 L90,48 L120,88 L150,56 L180,72 L210,40 L240,80 L270,64 L300,88 L330,48 L360,72 L390,56 L420,80 L450,40 L480,72 L500,64 L500,200 L0,200 Z',
  };
  
  return (
    <div className={`w-full overflow-hidden leading-none ${className}`} style={{ transform }}>
      <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-16 sm:h-20 lg:h-28">
        <path d={paths[variant]} fill={color} />
      </svg>
    </div>
  );
}
