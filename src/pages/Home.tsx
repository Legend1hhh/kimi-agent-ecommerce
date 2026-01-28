import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, Sparkles, Zap, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import TestimonialCard from '@/components/TestimonialCard';
import { productsApi, categoriesApi } from '@/services/api';
import type { Product, Category } from '@/types';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [featuredRes, newRes, categoriesRes] = await Promise.all([
          productsApi.getFeatured(),
          productsApi.getNewArrivals(),
          categoriesApi.getAll(),
        ]);

        if (featuredRes.success && featuredRes.data) {
          setFeaturedProducts(featuredRes.data.slice(0, 8));
        }
        if (newRes.success && newRes.data) {
          setNewArrivals(newRes.data.slice(0, 4));
        }
        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to load home data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const testimonials = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 5,
      comment: 'Absolutely love the quality of products! Fast shipping and excellent customer service. Will definitely shop here again.',
      date: '2024-01-15',
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 5,
      comment: 'The best online shopping experience I\'ve had. Products exceeded my expectations and the packaging was beautiful.',
      date: '2024-01-10',
    },
    {
      id: '3',
      name: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      rating: 5,
      comment: 'Great selection of premium products. The website is easy to navigate and checkout was seamless. Highly recommend!',
      date: '2024-01-05',
    },
  ];

  return (
    <div className="pt-36">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 rounded-3xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>
            
            <div className="relative grid lg:grid-cols-2 gap-8 items-center p-8 lg:p-16">
              {/* Content */}
              <div className="text-white space-y-6">
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    New Collection 2024
                  </Badge>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Discover Luxury &<br />
                  <span className="text-violet-200">Premium Quality</span>
                </h1>
                <p className="text-lg text-white/80 max-w-lg">
                  Explore our curated collection of premium products. From fashion to electronics, 
                  find everything you need with exceptional quality and service.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-violet-600 hover:bg-white/90"
                    asChild
                  >
                    <Link to="/products">
                      Shop Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10"
                    asChild
                  >
                    <Link to="/products?category=new-arrivals">
                      New Arrivals
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <div>
                    <p className="text-3xl font-bold">50K+</p>
                    <p className="text-white/70 text-sm">Happy Customers</p>
                  </div>
                  <div className="w-px h-12 bg-white/30" />
                  <div>
                    <p className="text-3xl font-bold">10K+</p>
                    <p className="text-white/70 text-sm">Products</p>
                  </div>
                  <div className="w-px h-12 bg-white/30" />
                  <div>
                    <p className="text-3xl font-bold">4.9</p>
                    <p className="text-white/70 text-sm">Rating</p>
                  </div>
                </div>
              </div>
              
              {/* Hero Image */}
              <div className="relative hidden lg:block">
                <div className="relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
                    alt="Premium Products"
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
                {/* Floating Cards */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Today's Sales</p>
                      <p className="text-xl font-bold text-slate-900">$24,500</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-xl z-20">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"
                        />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-slate-700">+2k buyers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
              { icon: Zap, title: 'Fast Delivery', desc: '2-3 business days' },
              { icon: Star, title: 'Best Quality', desc: 'Premium products only' },
              { icon: TrendingUp, title: 'Best Prices', desc: 'Price match guarantee' },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-4 bg-white rounded-xl border hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{feature.title}</p>
                  <p className="text-xs text-slate-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Shop by Category</h2>
              <p className="text-slate-500 mt-1">Browse our wide range of categories</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {isLoading 
              ? Array(6).fill(0).map((_, i) => (
                  <div key={i} className="aspect-square bg-slate-200 rounded-xl animate-pulse" />
                ))
              : categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))
            }
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Featured Products</h2>
              <p className="text-slate-500 mt-1">Handpicked items just for you</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products?featured=true">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading 
              ? Array(8).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden">
                    <div className="aspect-[4/5] bg-slate-200 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-slate-200 rounded animate-pulse" />
                      <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
            }
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">New Arrivals</h2>
              <p className="text-slate-500 mt-1">Check out our latest products</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products?sort=newest">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading 
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden">
                    <div className="aspect-[4/5] bg-slate-200 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-slate-200 rounded animate-pulse" />
                      <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))
              : newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} isNew />
                ))
            }
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-8 lg:p-12">
              <div className="relative z-10 text-white">
                <Badge className="bg-white/20 text-white border-0 mb-4">Limited Time</Badge>
                <h3 className="text-2xl lg:text-3xl font-bold mb-2">Summer Sale</h3>
                <p className="text-white/80 mb-6">Up to 50% off on selected items</p>
                <Button className="bg-white text-rose-600 hover:bg-white/90" asChild>
                  <Link to="/products?sale=true">Shop Sale</Link>
                </Button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop"
                alt="Summer Sale"
                className="absolute right-0 bottom-0 w-48 h-48 object-cover opacity-30 rounded-tl-full"
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 lg:p-12">
              <div className="relative z-10 text-white">
                <Badge className="bg-white/20 text-white border-0 mb-4">New</Badge>
                <h3 className="text-2xl lg:text-3xl font-bold mb-2">Premium Collection</h3>
                <p className="text-white/80 mb-6">Discover our exclusive premium line</p>
                <Button className="bg-white text-emerald-600 hover:bg-white/90" asChild>
                  <Link to="/products?category=premium">Explore</Link>
                </Button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop"
                alt="Premium Collection"
                className="absolute right-0 bottom-0 w-48 h-48 object-cover opacity-30 rounded-tl-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">What Our Customers Say</h2>
            <p className="text-slate-500 mt-2">Trusted by thousands of happy customers worldwide</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8">
              Get the latest updates on new products, exclusive offers, and special promotions 
              delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12"
              />
              <Button className="bg-violet-600 hover:bg-violet-700 h-12 px-8">
                Subscribe
              </Button>
            </div>
            <p className="text-slate-500 text-sm mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
