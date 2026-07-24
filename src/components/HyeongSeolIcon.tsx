import React from 'react';

export default function HyeongSeolIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 overflow-hidden bg-[#2C2C2C] border-2 border-[#2C2C2C] rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,0.15)] ${className}`}>
      {/* Interactive Vector Animation Illustration of Fireflies & Snow */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF2A3" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#F9C354" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#E98A15" stopOpacity="0" />
          </radialGradient>
          
          <radialGradient id="fireflySparkle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="30%" stopColor="#DEFF0A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9BD111" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="lanternRoof" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5C4D4A" />
            <stop offset="100%" stopColor="#312220" />
          </linearGradient>

          {/* Animation Styles */}
          <style>{`
            @keyframes pulseGlow {
              0%, 100% { opacity: 0.7; transform: scale(0.95); }
              50% { opacity: 1; transform: scale(1.05); }
            }
            @keyframes flyRandomOne {
              0%, 100% { transform: translate(0px, 0px); opacity: 0.3; }
              25% { transform: translate(5px, -8px); opacity: 0.9; }
              50% { transform: translate(-3px, -15px); opacity: 0.4; }
              75% { transform: translate(-8px, -5px); opacity: 0.9; }
            }
            @keyframes flyRandomTwo {
              0%, 100% { transform: translate(0px, 0px); opacity: 0.8; }
              33% { transform: translate(-6px, -5px); opacity: 0.3; }
              66% { transform: translate(4px, -12px); opacity: 0.9; }
            }
            @keyframes flyRandomThree {
              0%, 100% { transform: translate(0px, 0px); opacity: 0.4; }
              50% { transform: translate(7px, -4px); opacity: 0.95; }
            }
            @keyframes fallSnow {
              0% { transform: translateY(-10px) translateX(-5px); opacity: 0; }
              30% { opacity: 0.85; }
              90% { opacity: 0.85; }
              100% { transform: translateY(110px) translateX(8px); opacity: 0; }
            }
            .glow-bg {
              animation: pulseGlow 4s ease-in-out infinite;
              transform-origin: 50px 60px;
            }
            .firefly-1 {
              animation: flyRandomOne 6s ease-in-out infinite;
            }
            .firefly-2 {
              animation: flyRandomTwo 8s ease-in-out infinite;
            }
            .firefly-3 {
              animation: flyRandomThree 7s ease-in-out infinite;
            }
            .snowflake-slow {
              animation: fallSnow 12s linear infinite;
            }
            .snowflake-fast {
              animation: fallSnow 7s linear infinite;
            }
            .snowflake-medium {
              animation: fallSnow 9s linear infinite;
            }
          `}</style>
        </defs>

        {/* Ambient Dark Night Blue-Charcoal Background - Pre-rendered by container */}
        <rect width="100%" height="100%" fill="#1F1F1F" />
        
        {/* Soft Background Lunar Horizon Arc */}
        <circle cx="50" cy="180" r="140" fill="#292929" />

        {/* --- THE SNOW ACCENT ON BACKGROUND --- */}
        {/* Snowy drifts piling at the bottom of the logo badge */}
        <path d="M-10,95 Q20,88 50,93 T110,95 L110,110 L-10,110 Z" fill="#F0F4F8" opacity="0.9" />
        <path d="M-10,95 Q30,92 65,95 T110,98 L110,110 L-10,110 Z" fill="#FFFFFF" />

        {/* Falling Snowflakes (Animated paths) */}
        <circle cx="20" cy="15" r="1.5" fill="#FFFFFF" className="snowflake-slow" style={{ animationDelay: '0s' }} />
        <circle cx="80" cy="30" r="1.2" fill="#FFFFFF" className="snowflake-medium" style={{ animationDelay: '2s' }} />
        <circle cx="45" cy="5" r="1.8" fill="#FFFFFF" className="snowflake-fast" style={{ animationDelay: '4s' }} />
        <circle cx="15" cy="45" r="1.0" fill="#FFFFFF" className="snowflake-medium" style={{ animationDelay: '5.5s' }} />
        <circle cx="88" cy="10" r="1.6" fill="#FFFFFF" className="snowflake-slow" style={{ animationDelay: '1.2s' }} />
        <circle cx="65" cy="50" r="1.3" fill="#FFFFFF" className="snowflake-fast" style={{ animationDelay: '3.1s' }} />

        {/* --- LANTERN STRUCTURAL DESIGN --- */}
        
        {/* Lantern Soft Radial Glow Behind */}
        <circle cx="50" cy="62" r="28" fill="url(#lanternGlow)" className="glow-bg" />

        {/* Lantern Frame String / Rope */}
        <line x1="50" y1="18" x2="50" y2="44" stroke="#D44D44" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="41" r="3" fill="#F9C354" stroke="#312220" strokeWidth="1" />

        {/* Lantern Glass Body Base */}
        <rect x="36" y="47" width="28" height="26" rx="4" fill="#FFFFFF" fillOpacity="0.12" stroke="#4A3B32" strokeWidth="1.5" />

        {/* Wooden Post inside/handle */}
        <line x1="50" y1="47" x2="50" y2="73" stroke="#5C4D4A" strokeWidth="1" opacity="0.4" />

        {/* Top Roof of the Lantern */}
        <path d="M30,47 L70,47 L60,38 L40,38 Z" fill="url(#lanternRoof)" stroke="#261917" strokeWidth="1.5" />
        {/* Snow sitting on top of the lantern roof */}
        <path d="M38,39 L40,38 L60,38 L62,39 Q50,37 38,39 Z" fill="#FFFFFF" />
        <path d="M29,48 Q50,45 71,48 L69,46 Q50,44 31,46 Z" fill="#F0F4F8" />

        {/* Bottom Base of the Lantern */}
        <rect x="34" y="73" width="32" height="6" rx="1.5" fill="#4A3B32" stroke="#261917" strokeWidth="1.5" />
        <rect x="37" y="74" width="26" height="2" fill="#D44D44" />

        {/* Side Pillars of the Lantern */}
        <line x1="36" y1="47" x2="36" y2="73" stroke="#4A3B32" strokeWidth="2" />
        <line x1="64" y1="47" x2="64" y2="73" stroke="#4A3B32" strokeWidth="2" />

        {/* --- THE SPARKING FIREFLIES (PULSING) --- */}
        {/* Fireflies floating inside and escaping around the study lantern */}
        <g className="firefly-1">
          <circle cx="52" cy="62" r="4" fill="url(#fireflySparkle)" />
          <circle cx="52" cy="62" r="7" fill="#DEFF0A" fillOpacity="0.25" />
        </g>
        <g className="firefly-2">
          <circle cx="44" cy="56" r="3.2" fill="url(#fireflySparkle)" />
          <circle cx="44" cy="56" r="6" fill="#DEFF0A" fillOpacity="0.2" />
        </g>
        <g className="firefly-3">
          <circle cx="58" cy="67" r="3.5" fill="url(#fireflySparkle)" />
          <circle cx="58" cy="67" r="6.5" fill="#DEFF0A" fillOpacity="0.2" />
        </g>
        
        {/* Escaped fireflies glowing on outside of glass */}
        <g className="firefly-1" style={{ animationDelay: '1.5s' }}>
          <circle cx="30" cy="38" r="2.8" fill="url(#fireflySparkle)" />
          <circle cx="30" cy="38" r="5" fill="#DEFF0A" fillOpacity="0.3" />
        </g>
        <g className="firefly-2" style={{ animationDelay: '3s' }}>
          <circle cx="68" cy="30" r="2.5" fill="url(#fireflySparkle)" />
          <circle cx="68" cy="30" r="4.5" fill="#DEFF0A" fillOpacity="0.2" />
        </g>
        <g className="firefly-3" style={{ animationDelay: '0.8s' }}>
          <circle cx="74" cy="55" r="3" fill="url(#fireflySparkle)" />
          <circle cx="74" cy="55" r="5" fill="#DEFF0A" fillOpacity="0.2" />
        </g>

        {/* Small classical Korean wording accent "螢雪" vertically on the bottom right corner */}
        <rect x="80" y="70" width="12" height="18" rx="2" fill="#D44D44" stroke="#FFF" strokeWidth="0.5" opacity="0.9" />
        <text x="86" y="78" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="serif" textAnchor="middle">螢</text>
        <text x="86" y="85" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="serif" textAnchor="middle">雪</text>

        {/* Minimal border decor for high aesthetic framing */}
        <rect x="2" y="2" width="96" height="96" rx="14" fill="none" stroke="#2C2C2C" strokeWidth="1" opacity="0.15" />
      </svg>
    </div>
  );
}
