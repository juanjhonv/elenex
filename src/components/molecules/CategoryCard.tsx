import React from 'react';
import './CategoryCard.css';

interface CategoryCardProps {
  title: string;
  imageUrl?: string;
  bgColor?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  imageUrl,
  bgColor = '#d4d4d4',
}) => {
  return (
    <a href="#" className="category-card" style={{ backgroundColor: imageUrl ? 'transparent' : bgColor }}>
      {imageUrl && <img src={imageUrl} alt={title} className="category-image" loading="lazy" />}
      <div className="category-content">
        <h3 className="category-title">{title}</h3>
      </div>
    </a>
  );
};
