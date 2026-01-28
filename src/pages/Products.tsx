import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Filter, Grid3X3, List, SlidersHorizontal, 
  X, Search, ArrowLeft, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ProductCard from '@/components/ProductCard';
import { productsApi, categoriesApi } from '@/services/api';
import type { Product, Category } from '@/types';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 12;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesApi.getAll();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page,
        limit,
        sort: sortBy,
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (selectedRating) {
        params.minRating = selectedRating;
      }

      if (priceRange[0] > 0) {
        params.minPrice = priceRange[0];
      }

      if (priceRange[1] < 1000) {
        params.maxPrice = priceRange[1];
      }

      const response = await productsApi.getAll(params);

      if (response.success && response.data) {
        setProducts(response.data.data);
        setTotalProducts(response.data.total);
      }
    } catch (error) {
      console.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sortBy, selectedCategory, searchQuery, selectedRating, priceRange]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('search', searchQuery);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (categorySlug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedCategory === categorySlug) {
      setSelectedCategory('');
      newParams.delete('category');
    } else {
      setSelectedCategory(categorySlug);
      newParams.set('category', categorySlug);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setSelectedRating(null);
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
  };

  const totalPages = Math.ceil(totalProducts / limit);
  const activeFiltersCount = [
    selectedCategory,
    selectedRating,
    priceRange[0] > 0 || priceRange[1] < 1000,
    searchQuery,
  ].filter(Boolean).length;

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-semibold text-slate-900 mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer hover:text-violet-600 transition-colors"
            >
              <Checkbox
                checked={selectedCategory === category.slug}
                onCheckedChange={() => handleCategoryChange(category.slug)}
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-slate-900 mb-3">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={1000}
          step={10}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm">
          <span className="px-3 py-1 bg-slate-100 rounded">${priceRange[0]}</span>
          <span className="px-3 py-1 bg-slate-100 rounded">${priceRange[1]}</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold text-slate-900 mb-3">Rating</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer hover:text-violet-600 transition-colors"
            >
              <Checkbox
                checked={selectedRating === rating}
                onCheckedChange={() => setSelectedRating(
                  selectedRating === rating ? null : rating
                )}
              />
              <div className="flex items-center gap-1">
                {Array(rating).fill(0).map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
                <span className="text-sm text-slate-500 ml-1">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={clearFilters}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="pt-36 pb-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-violet-600">Home</button>
            <span>/</span>
            <span className="text-slate-900">Products</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-slate-900 capitalize">{selectedCategory}</span>
              </>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                {searchQuery ? `Search: "${searchQuery}"` : 'All Products'}
              </h1>
              <p className="text-slate-500 mt-1">
                Showing {products.length} of {totalProducts} products
              </p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('search');
                    setSearchParams(newParams);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-slate-500">Active filters:</span>
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                Category: {selectedCategory}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleCategoryChange(selectedCategory)}
                />
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
              <Badge variant="secondary" className="gap-1">
                Price: ${priceRange[0]} - ${priceRange[1]}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setPriceRange([0, 1000])}
                />
              </Badge>
            )}
            {selectedRating && (
              <Badge variant="secondary" className="gap-1">
                Rating: {selectedRating}+ Stars
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setSelectedRating(null)}
                />
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => {
                    setSearchQuery('');
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('search');
                    setSearchParams(newParams);
                  }}
                />
              </Badge>
            )}
            <button 
              onClick={clearFilters}
              className="text-sm text-violet-600 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Filters</h3>
              </div>
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="bestselling">Best Selling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden border">
                    <Skeleton className="aspect-[4/5]" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters or search query</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, i, arr) => (
                    <div key={p} className="flex items-center">
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="px-2 text-slate-400">...</span>
                      )}
                      <Button
                        variant={page === p ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Button>
                    </div>
                  ))}
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
