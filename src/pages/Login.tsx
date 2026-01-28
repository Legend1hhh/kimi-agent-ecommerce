import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from || '/';

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await login(email, password);
      
      if (response.success) {
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      } else {
        toast.error(response.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-36 pb-12 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">L</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 mt-4">Welcome Back</h1>
            <p className="text-slate-500">Sign in to your LuxeMarket account</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <span className="text-sm text-slate-600">Remember me</span>
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-violet-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              <Separator className="my-6" />

              {/* Social Login */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full" type="button">
                  <img 
                    src="/images/social/google.svg" 
                    alt="Google" 
                    className="w-5 h-5 mr-2"
                  />
                  Continue with Google
                </Button>
                <Button variant="outline" className="w-full" type="button">
                  <img 
                    src="/images/social/facebook.svg" 
                    alt="Facebook" 
                    className="w-5 h-5 mr-2"
                  />
                  Continue with Facebook
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-slate-600">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              state={{ from }}
              className="text-violet-600 font-medium hover:underline"
            >
              Create one
            </Link>
          </p>

          {/* Back to Shop */}
          <div className="text-center mt-4">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
