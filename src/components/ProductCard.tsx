import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/types';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
}

export default function ProductCard({ product, isNew = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view modal logic would go here
  };

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div 
      className="group relative bg-white rounded-xl overflow-hidden border hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link to={`/products/${product.slug}`} className="block relative">
        <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse" />
          )}
          <img
            src={product.featuredImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Overlay Actions */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 rounded-full"
              onClick={handleQuickView}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 rounded-full"
              onClick={handleWishlist}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <Badge className="bg-emerald-500 text-white border-0">New</Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-rose-500 text-white border-0">-{discount}%</Badge>
            )}
            {product.isFeatured && !isNew && discount === 0 && (
              <Badge className="bg-violet-500 text-white border-0">Featured</Badge>
            )}
            {product.quantity < 10 && product.quantity > 0 && (
              <Badge className="bg-amber-500 text-white border-0">Low Stock</Badge>
            )}
            {product.quantity === 0 && (
              <Badge className="bg-slate-500 text-white border-0">Out of Stock</Badge>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-slate-500 mb-1">{product.category?.name}</p>
        
        {/* Title */}
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-slate-900 line-clamp-2 hover:text-violet-600 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">({product.reviewCount})</span>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-slate-400 line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-violet-600 hover:bg-violet-700"
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
