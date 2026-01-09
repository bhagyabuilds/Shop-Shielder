
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
          {/* Main Shield Shape - Fixed with explicit spacing and comma segments */}
          <path 
            d="M 100,20 L 35,45 V 100 C 35,145 100,185 100,185 C 100,185 165,145 165,100 V 45 L 100,20 Z" 
            fill={shieldEmerald} 
          />
          
          {/* Right Side Lighter/Highlight - Corrected Path Syntax for high compatibility */}
          <path 
            d="M 100,20 L 165,45 V 100 C 165,145 100,185 100,185 V 20 Z" 
            fill="white" 
            opacity="0.1" 
          />

          {!hideText && (
            <>
              {/* SHOP Text - Metallic Silver */}
              <text 
                x="100" 
                y="85" 
                textAnchor="middle" 
                fill="url(#silver-shine)" 
                style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '4px', fontFamily: "'Inter', sans-serif" }}
              >
                SHOP
              </text>
              
              {/* SHIELDER Text - Bold White */}
              <text 
                x="100" 
                y="135" 
                textAnchor="middle" 
                fill="white"
                style={{ fontSize: '46px', fontWeight: 900, fontFamily: "'Inter', sans-serif", letterSpacing: '-1px' }}
              >
                SHIELDER
              </text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export default Logo;
