// Indian National Emblem SVG Component
export default function IndianEmblem({ className = "w-12 h-12" }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
    >
      {/* Base/Lotus */}
      <ellipse cx="50" cy="85" rx="35" ry="8" fill="currentColor" opacity="0.3"/>
      <path d="M 25 85 Q 35 80, 50 80 Q 65 80, 75 85 Q 65 90, 50 90 Q 35 90, 25 85" fill="currentColor" opacity="0.4"/>
      
      {/* Abacus/Drum */}
      <ellipse cx="50" cy="60" rx="30" ry="8" fill="currentColor"/>
      <ellipse cx="50" cy="58" rx="28" ry="6" fill="currentColor" opacity="0.2"/>
      
      {/* Dharma Chakra (Wheel) - Center */}
      <circle cx="50" cy="60" r="8" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
      <circle cx="50" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="0.3"/>
      {/* Wheel spokes */}
      {[...Array(24)].map((_, i) => {
        const angle = (i * 15) * Math.PI / 180;
        const x1 = 50 + 6 * Math.cos(angle);
        const y1 = 60 + 6 * Math.sin(angle);
        const x2 = 50 + 8 * Math.cos(angle);
        const y2 = 60 + 8 * Math.sin(angle);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.5"/>
        );
      })}
      
      {/* Bull - Left */}
      <path d="M 30 58 Q 25 55, 22 58 Q 25 62, 30 60" fill="currentColor"/>
      <ellipse cx="25" cy="58" rx="3" ry="2" fill="currentColor"/>
      <circle cx="24" cy="57" r="0.8" fill="currentColor" opacity="0.3"/>
      
      {/* Horse - Right */}
      <path d="M 70 58 Q 75 55, 78 58 Q 75 62, 70 60" fill="currentColor"/>
      <ellipse cx="75" cy="58" rx="3" ry="2" fill="currentColor"/>
      <circle cx="76" cy="57" r="0.8" fill="currentColor" opacity="0.3"/>
      
      {/* Lions - Three visible */}
      {/* Front Lion */}
      <path d="M 50 20 Q 45 15, 50 10 Q 55 15, 50 20" fill="currentColor"/>
      <ellipse cx="50" cy="18" rx="6" ry="5" fill="currentColor"/>
      <circle cx="48" cy="17" r="1" fill="currentColor" opacity="0.3"/>
      <circle cx="52" cy="17" r="1" fill="currentColor" opacity="0.3"/>
      <ellipse cx="50" cy="19" rx="2" ry="1" fill="currentColor" opacity="0.3"/>
      {/* Mane */}
      <path d="M 44 18 Q 42 15, 40 18 Q 42 20, 44 18" fill="currentColor"/>
      <path d="M 56 18 Q 58 15, 60 18 Q 58 20, 56 18" fill="currentColor"/>
      
      {/* Left Lion */}
      <path d="M 35 25 Q 30 20, 25 25 Q 30 30, 35 28" fill="currentColor"/>
      <ellipse cx="30" cy="26" rx="5" ry="4" fill="currentColor"/>
      <circle cx="29" cy="25" r="0.8" fill="currentColor" opacity="0.3"/>
      <ellipse cx="30" cy="27" rx="1.5" ry="0.8" fill="currentColor" opacity="0.3"/>
      {/* Mane */}
      <path d="M 28 26 Q 26 23, 24 26 Q 26 28, 28 26" fill="currentColor"/>
      
      {/* Right Lion */}
      <path d="M 65 25 Q 70 20, 75 25 Q 70 30, 65 28" fill="currentColor"/>
      <ellipse cx="70" cy="26" rx="5" ry="4" fill="currentColor"/>
      <circle cx="71" cy="25" r="0.8" fill="currentColor" opacity="0.3"/>
      <ellipse cx="70" cy="27" rx="1.5" ry="0.8" fill="currentColor" opacity="0.3"/>
      {/* Mane */}
      <path d="M 72 26 Q 74 23, 76 26 Q 74 28, 72 26" fill="currentColor"/>
    </svg>
  );
}

