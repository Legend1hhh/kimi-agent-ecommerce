import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from || '/';

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      
      if (response.success) {
        toast.success('Account created successfully!');
        navigate(from, { replace: true });
      } else {
        toast.error(response.message || 'Failed to create account');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-green-500'];

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
            <h1 className="text-2xl font-bold text-slate-900 mt-4">Create Account</h1>
            <p className="text-slate-500">Join LuxeMarket today</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
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
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                              i <= strength ? strengthColors[strength - 1] : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${strength >= 3 ? 'text-green-600' : 'text-slate-500'}`}>
                        {strengthLabels[strength - 1] || 'Too short'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-rose-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2 cursor-pointer">
                  <Checkbox
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <span className="text-sm text-slate-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-violet-600 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>
                  </span>
                </label>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account
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
                  Sign up with Google
                </Button>
                <Button variant="outline" className="w-full" type="button">
                  <img 
                    src="/images/social/facebook.svg" 
                    alt="Facebook" 
                    className="w-5 h-5 mr-2"
                  />
                  Sign up with Facebook
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-slate-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              state={{ from }}
              className="text-violet-600 font-medium hover:underline"
            >
              Sign in
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
