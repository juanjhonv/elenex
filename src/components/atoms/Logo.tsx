import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', width = 50, height = 34 }) => {
  return (
    <a href="/" className={`inline-block ${className}`} aria-label="Adidas Logo">
      <svg viewBox="0 0 200 135" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
        <path d="M20.2 92.4l32.6-56.5 17.6 10.2-32.6 56.4zM75.1 92.4l49-84.8 17.6 10.2-49 84.8zM128 92.4l65.3-113.1 17.6 10.2-65.3 113.1z" fill="currentColor"/>
        <path d="M0 102.6h220v32.4H0z" fill="transparent"/>
      </svg>
    </a>
  );
};
