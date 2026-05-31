export function KitchenWatermark({colorStroke = "#2d5262"}) {
  return (
    <svg viewBox="0 0 420 480" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", opacity: 0.12 }}>
      {/* Shelf top */}
      <rect x="60" y="60" width="300" height="8" rx="4" stroke={colorStroke} strokeWidth="2"/>
      {/* Plant pot */}
      <ellipse cx="130" cy="56" rx="18" ry="8" stroke={colorStroke} strokeWidth="1.5"/>
      <rect x="118" y="30" width="24" height="28" rx="4" stroke={colorStroke} strokeWidth="1.5"/>
      <path d="M130 30 Q120 15 110 20" stroke={colorStroke} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M130 25 Q140 12 152 18" stroke={colorStroke} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M130 20 Q130 8 130 0" stroke={colorStroke} strokeWidth="1.5" strokeLinecap="round"/>
      {/* Jar */}
      <rect x="170" y="28" width="28" height="36" rx="6" stroke={colorStroke} strokeWidth="1.5"/>
      <rect x="173" y="22" width="22" height="8" rx="2" stroke={colorStroke} strokeWidth="1.5"/>
      {/* Small jar */}
      <rect x="215" y="38" width="20" height="26" rx="5" stroke={colorStroke} strokeWidth="1.5"/>
      <rect x="218" y="33" width="14" height="7" rx="2" stroke={colorStroke} strokeWidth="1.5"/>
      {/* Shelf middle */}
      <rect x="60" y="180" width="300" height="8" rx="4" stroke={colorStroke} strokeWidth="2"/>
      {/* Hanging utensils */}
      <line x1="100" y1="188" x2="100" y2="240" stroke={colorStroke} strokeWidth="1.5"/>
      <ellipse cx="100" cy="248" rx="8" ry="12" stroke={colorStroke} strokeWidth="1.5"/>
      <line x1="140" y1="188" x2="140" y2="235" stroke={colorStroke} strokeWidth="1.5"/>
      <path d="M132 235 Q140 250 148 235" stroke={colorStroke} strokeWidth="1.5"/>
      <line x1="180" y1="188" x2="180" y2="230" stroke={colorStroke} strokeWidth="1.5"/>
      <path d="M174 228 L186 228 L183 245 L177 245 Z" stroke={colorStroke} strokeWidth="1.5"/>
      <line x1="220" y1="188" x2="220" y2="250" stroke={colorStroke} strokeWidth="1.5"/>
      <circle cx="220" cy="258" r="8" stroke={colorStroke} strokeWidth="1.5"/>
      <line x1="260" y1="188" x2="260" y2="240" stroke={colorStroke} strokeWidth="1.5"/>
      <path d="M254 238 Q260 255 266 238" stroke={colorStroke} strokeWidth="1.5"/>
      {/* Bowl with veggies */}
      <path d="M120 380 Q180 420 240 380" stroke={colorStroke} strokeWidth="2" strokeLinecap="round"/>
      <path d="M110 370 Q180 410 250 370" stroke={colorStroke} strokeWidth="1.5"/>
      <ellipse cx="180" cy="368" rx="70" ry="12" stroke={colorStroke} strokeWidth="1.5"/>
      {/* Carrot */}
      <path d="M155 355 Q160 340 165 355" stroke={colorStroke} strokeWidth="1.5"/>
      <path d="M160 340 Q158 330 163 325" stroke={colorStroke} strokeWidth="1"/>
      {/* Broccoli */}
      <circle cx="185" cy="342" r="10" stroke={colorStroke} strokeWidth="1.5"/>
      <line x1="185" y1="352" x2="185" y2="365" stroke={colorStroke} strokeWidth="1.5"/>
      {/* Tomato */}
      <circle cx="210" cy="348" r="9" stroke={colorStroke} strokeWidth="1.5"/>
      <path d="M210 339 Q208 333 213 330" stroke={colorStroke} strokeWidth="1"/>
    </svg>
  )
}

export function DotPattern() {
  const dots = []
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      dots.push(
        <circle key={`${r}-${c}`} cx={c * 14} cy={r * 14} r="1.5" fill="rgba(255,255,255,0.25)" />
      )
    }
  }
  return (
    <svg viewBox="0 0 112 112" style={{ position: "absolute", top: 24, right: 24, width: 112, height: 112 }}>
      {dots}
    </svg>
  )
}
