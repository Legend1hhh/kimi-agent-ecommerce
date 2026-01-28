import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, Heart, Share2, Minus, Plus, ShoppingCart, 
  Truck, Shield, RotateCcw, ChevronRight,
  Package, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';
import { productsApi, reviewsApi } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import type { Product, Review } from '@/types';

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      
      try {
        const [productRes, reviewsRes] = await Promise.all([
          productsApi.getBySlug(slug),
          reviewsApi.getByProduct(slug),
        ]);

        if (productRes.success && productRes.data) {
          setProduct(productRes.data);
          
          // Load related products
          const relatedRes = await productsApi.getRelated(productRes.data.id);
          if (relatedRes.success && relatedRes.data) {
            setRelatedProducts(relatedRes.data.slice(0, 4));
          }
        } else {
          navigate('/404');
        }

        if (reviewsRes.success && reviewsRes.data) {
          setReviews(reviewsRes.data.data);
        }
      } catch (error) {
        console.error('Failed to load product');
        navigate('/404');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedVariant, selectedAttributes);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        text: product?.shortDescription,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const discount = product?.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="pt-36 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-slate-200 animate-pulse rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 animate-pulse rounded w-3/4" />
              <div className="h-6 bg-slate-200 animate-pulse rounded w-1/4" />
              <div className="h-4 bg-slate-200 animate-pulse rounded w-full" />
              <div className="h-4 bg-slate-200 animate-pulse rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="pt-36 pb-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-violet-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-violet-600">Products</Link>
          <ChevronRight className="w-4 h-4" />
          {product.category && (
            <>
              <Link 
                to={`/products?category=${product.category.slug}`} 
                className="hover:text-violet-600"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative">
              <img
                src={product.images[selectedImage] || product.featuredImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-rose-500 text-white border-0 text-lg px-3 py-1">
                  -{discount}%
                </Badge>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === index ? 'border-violet-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category?.name}</Badge>
                {product.isNew && <Badge className="bg-emerald-500 text-white">New</Badge>}
                {product.quantity < 10 && product.quantity > 0 && (
                  <Badge className="bg-amber-500 text-white">Low Stock</Badge>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-500">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xl text-slate-400 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-rose-500 font-medium">Save ${(product.comparePrice! - product.price).toFixed(2)}</span>
              )}
            </div>

            <Separator />

            {/* Short Description */}
            <p className="text-slate-600">{product.shortDescription || product.description}</p>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Variant
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedVariant === variant.id
                          ? 'border-violet-600 bg-violet-50 text-violet-600'
                          : 'border-slate-200 hover:border-violet-300'
                      }`}
                    >
                      {variant.name} - ${variant.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Attributes */}
            {product.attributes.length > 0 && (
              <div className="space-y-3">
                {product.attributes.map((attr) => (
                  <div key={attr.name}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {attr.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {attr.value.split(',').map((value) => (
                        <button
                          key={value.trim()}
                          onClick={() => setSelectedAttributes(prev => ({
                            ...prev,
                            [attr.name]: value.trim()
                          }))}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            selectedAttributes[attr.name] === value.trim()
                              ? 'border-violet-600 bg-violet-50 text-violet-600'
                              : 'border-slate-200 hover:border-violet-300'
                          }`}
                        >
                          {value.trim()}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-3 py-2 hover:bg-slate-100 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.quantity}
                    className="px-3 py-2 hover:bg-slate-100 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-slate-500">
                  {product.quantity} available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1 bg-violet-600 hover:bg-violet-700"
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="flex-1"
                onClick={handleBuyNow}
                disabled={product.quantity === 0}
              >
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWishlist}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-violet-600" />
                <span className="text-sm">Free shipping over $100</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-600" />
                <span className="text-sm">2-year warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-violet-600" />
                <span className="text-sm">30-day returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-violet-600" />
                <span className="text-sm">Secure packaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:bg-transparent py-3"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:bg-transparent py-3"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:bg-transparent py-3"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger 
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:bg-transparent py-3"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-slate-600 whitespace-pre-line">{product.description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {product.attributes.map((attr) => (
                  <div key={attr.name} className="flex justify-between py-3 border-b">
                    <span className="text-slate-500">{attr.name}</span>
                    <span className="font-medium">{attr.value}</span>
                  </div>
                ))}
                <div className="flex justify-between py-3 border-b">
                  <span className="text-slate-500">SKU</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-slate-500">Weight</span>
                  <span className="font-medium">{product.weight || 'N/A'} kg</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={review.userAvatar || '/images/default-avatar.png'}
                          alt={review.userName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{review.userName}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-sm text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-medium mb-1">{review.title}</h4>
                      <p className="text-slate-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">No reviews yet</h3>
                  <p className="text-slate-500">Be the first to review this product</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Shipping Information</h4>
                  <p className="text-slate-600">
                    We offer free standard shipping on all orders over $100. 
                    Standard delivery takes 3-5 business days. Express shipping 
                    is available for an additional fee.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Return Policy</h4>
                  <p className="text-slate-600">
                    We accept returns within 30 days of delivery. Items must be 
                    in original condition with all tags attached. Refunds will be 
                    processed within 5-7 business days after we receive the return.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
