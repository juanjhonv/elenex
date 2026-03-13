import React from 'react';
import { Icon } from '../atoms/Icon';
import './SearchBox.css';

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ 
  placeholder = 'Buscar', 
  className = '' 
}) => {
  return (
    <div className={`search-box ${className}`}>
      <input 
        type="text" 
        className="search-input" 
        placeholder={placeholder} 
        aria-label={placeholder}
      />
      <button className="search-button" aria-label="Submit search">
        <Icon name="search" size={20} />
      </button>
    </div>
  );
};
