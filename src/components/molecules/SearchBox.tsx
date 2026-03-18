import React from 'react';
import { Icon } from '../atoms/Icon';
import './SearchBox.css';

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Buscar',
  className = '',
  value = '',
  onChange
}) => {
  return (
    <div className={`search-box ${className}`}>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <button className="search-button" aria-label="Submit search">
        <Icon name="search" size={20} />
      </button>
    </div>
  );
};
