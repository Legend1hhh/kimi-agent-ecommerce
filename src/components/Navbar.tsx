import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, ShoppingCart, User, Menu, X, Heart, 
  ChevronDown, LogOut, Package, Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { categoriesApi, searchApi } from '@/services/api';
import type { Category } from '@/types';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesApi.getAll();
        if (response.success && response.data) {
          setCategories(response.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 2) {
        try {
          const response = await searchApi.getSuggestions(searchQuery);
          if (response.success && response.data) {
            setSearchSuggestions(response.data.slice(0, 5));
            setShowSuggestions(true);
          }
        } catch (error) {
          setSearchSuggestions([]);
        }
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    setIsSearchOpen(false);
    setShowSuggestions(false);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'New Arrivals', href: '/products?sort=newest' },
    { name: 'Sale', href: '/products?sale=true' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.split('?')[0]);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm' 
          : 'bg-white'
      }`}
    >
      {/* Top Bar */}
      <div className="bg-slate-900 text-white text-xs py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="hidden sm:block">Free shipping on orders over $100</p>
          <div className="flex items-center gap-4 ml-auto">
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
            <Link to="/faq" className="hover:text-slate-300 transition-colors">FAQ</Link>
            <Link to="/track-order" className="hover:text-slate-300 transition-colors">Track Order</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
              LuxeMarket
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-violet-600 ${
                  isActive(link.href) ? 'text-violet-600' : 'text-slate-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-violet-600 transition-colors">
                Categories
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link to={`/products?category=${category.slug}`}>
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/products" className="text-violet-600 font-medium">
                    View All Categories
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-5 h-5" />
              </Button>
              
              {/* Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border p-4 z-50">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setShowSuggestions(false);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <X className="w-4 h-4 text-slate-400" />
                        </button>
                      )}
                    </div>
                  </form>
                  
                  {/* Suggestions */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="mt-2 border-t pt-2">
                      <p className="text-xs text-slate-500 mb-2">Suggestions</p>
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <Search className="w-3 h-3 inline mr-2 text-slate-400" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden sm:flex"
              onClick={() => navigate('/wishlist')}
            >
              <Heart className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`py-2 px-3 rounded-lg transition-colors ${
                    isActive(link.href) 
                      ? 'bg-violet-50 text-violet-600' 
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-slate-500 mb-2">Categories</p>
              <div className="flex flex-col gap-1">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.slug}`}
                    className="py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {!isAuthenticated && (
              <div className="border-t pt-4 flex flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button className="w-full" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => {
            setIsSearchOpen(false);
            setShowSuggestions(false);
          }}
        />
      )}
    </header>
  );
}
