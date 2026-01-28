import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="pt-36 pb-12 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="text-9xl font-bold text-slate-200">404</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <Search className="w-16 h-16 text-violet-600" />
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-slate-500 mb-8">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or never existed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => window.history.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-slate-500 mb-4">Looking for something else?</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/products" className="text-violet-600 hover:underline">
                Browse Products
              </Link>
              <span className="text-slate-300">|</span>
              <Link to="/contact" className="text-violet-600 hover:underline">
                Contact Support
              </Link>
              <span className="text-slate-300">|</span>
              <Link to="/faq" className="text-violet-600 hover:underline">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
