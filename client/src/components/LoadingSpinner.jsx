import React from 'react';

/**
 * A sleek, brand-consistent loading spinner for use inside buttons.
 * Inherits color from the parent text.
 */
export default function LoadingSpinner({ size = 16, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-spin ${className}`}
    >
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeOpacity="0.1"
      />
      <path 
        d="M12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.0434 16.4522" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
    </svg>
  );
}
