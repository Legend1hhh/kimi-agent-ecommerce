import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square relative overflow-hidden rounded-xl bg-slate-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}
        <img
          src={category.image || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop`}
          alt={category.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-80'
        }`} />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <h3 className="text-white font-semibold text-lg mb-1">{category.name}</h3>
          {category.description && (
            <p className="text-white/70 text-sm line-clamp-2 mb-2">{category.description}</p>
          )}
          <div className={`flex items-center gap-1 text-violet-300 text-sm font-medium transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}>
            Explore
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Hover Border */}
        <div className={`absolute inset-0 rounded-xl border-2 border-violet-500 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>
    </Link>
  );
}
