import React, { useState } from 'react';
import { Icon } from '../atoms/Icon';
import './ProductCard.css';

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  price: string;
  originalPrice?: string;
  imageUrl?: string;
  bgColor?: string; // Fallback explicitly requested for no images
  isNew?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  category,
  price,
  originalPrice,
  imageUrl,
  bgColor = '#e5e5e5',
  isNew = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-container" style={{ backgroundColor: bgColor }}>
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="product-image" loading="lazy" />
        ) : (
          <div className="product-image-placeholder"></div>
        )}
        
        {isNew && <div className="product-badge">Nuevo</div>}
        
        <div className="product-price-badge">{price}</div>
        
        <button 
          className="product-favorite" 
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
        >
          <Icon 
            name="heart" 
            size={20} 
            color={isFavorite ? 'var(--color-primary)' : 'currentColor'} 
            className={isFavorite ? 'favorite-active' : ''}
          />
        </button>
      </div>

      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p className="product-category">{category}</p>
        <div className="product-prices">
          {originalPrice && <span className="product-original-price">{originalPrice}</span>}
        </div>
      </div>
      
      <div className={`product-footer ${isHovered ? 'visible' : ''}`}>
         <p className="product-colors">2 colores</p>
      </div>
    </div>
  );
};
