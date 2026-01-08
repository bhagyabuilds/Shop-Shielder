import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light';
  hideText?: boolean;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', theme = 'dark', hideText = false, onClick }) => {
  const sizes = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-32',
    xl: 'h-64'
  };

  const shieldEmerald = '#064e3b';
  const silverGradient = '#94a3b8';

  return (
    <div className={`inline-flex items-center justify-center cursor-pointer ${className}`} onClick={onClick}>
      <svg 
        viewBox="0 0 200 200" 
        className={sizes[size]} 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="silver-shine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>

        <g filter="url(#logo-shadow)">
          {/* Main Shield Shape */}
          <path 
            d="M100 20 L35 45 V100 C35 145 100 185 100 185 C100 185 165 145 165 100 V45 L100 20 Z" 
            fill={shieldEmerald} 
          />
          
          {/* Right Side Lighter/Highlight */}
          <path 
            d="M100 20 L165 45 V100 C165 145 100 185 V20 Z" 
            fill="white" 
            opacity="0.08" 
          />

          {!hideText && (
            <>
              {/* SHOP Text - Thin Metallic Silver */}
              <text 
                x="100" 
                y="88" 
                textAnchor="middle" 
                fill="url(#silver-shine)" 
                style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '4px', fontFamily: "'Inter', sans-serif" }}
              >
                SHOP
              </text>
              
              {/* SHIELDER Text - Bold White Banner Look */}
              <g transform="translate(0, 118)">
                <text 
                  x="100" 
                  y="12" 
                  textAnchor="middle" 
                  fill="white"
                  style={{ fontSize: '46px', fontWeight: 900, fontFamily: "'Inter', sans-serif", letterSpacing: '-1px' }}
                >
                  SHIELDER
                </text>
              </g>
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export default Logo;