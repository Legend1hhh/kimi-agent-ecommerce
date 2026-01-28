import { Link } from 'react-router-dom';
import { 
  Facebook, Twitter, Instagram, Youtube, Mail, 
  Phone, MapPin, CreditCard, Truck, Shield, RotateCcw 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const footerLinks = {
    shop: [
      { name: 'All Products', href: '/products' },
      { name: 'New Arrivals', href: '/products?sort=newest' },
      { name: 'Best Sellers', href: '/products?sort=bestselling' },
      { name: 'Sale Items', href: '/products?sale=true' },
      { name: 'Categories', href: '/products' },
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faq' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns & Exchanges', href: '/returns' },
      { name: 'Size Guide', href: '/size-guide' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Sustainability', href: '/sustainability' },
      { name: 'Affiliates', href: '/affiliates' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Accessibility', href: '/accessibility' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $100',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure checkout',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day return policy',
    },
    {
      icon: CreditCard,
      title: 'Flexible Payment',
      description: 'Multiple payment options',
    },
  ];

  return (
    <footer className="bg-slate-50">
      {/* Features Bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{feature.title}</h4>
                  <p className="text-sm text-slate-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t bg-slate-900 text-slate-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand & Newsletter */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <span className="text-xl font-bold text-white">LuxeMarket</span>
              </Link>
              <p className="text-slate-400 mb-6 max-w-sm">
                Your premier destination for luxury products. We curate the finest selection 
                of premium goods with exceptional customer service.
              </p>
              
              {/* Newsletter */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-2">Subscribe to our newsletter</h4>
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  <Button className="bg-violet-600 hover:bg-violet-700 whitespace-nowrap">
                    Subscribe
                  </Button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-violet-600 transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Shop</h4>
              <ul className="space-y-2">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="hover:text-violet-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="hover:text-violet-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="hover:text-violet-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                  <span>123 Luxury Avenue<br />New York, NY 10001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-violet-500 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-violet-500 flex-shrink-0" />
                  <span>support@luxemarket.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-500">
                © 2024 LuxeMarket. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                {footerLinks.legal.map((link) => (
                  <Link 
                    key={link.name}
                    to={link.href} 
                    className="text-sm text-slate-500 hover:text-violet-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <img 
                  src="/images/payment/visa.svg" 
                  alt="Visa" 
                  className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="/images/payment/mastercard.svg" 
                  alt="Mastercard" 
                  className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="/images/payment/amex.svg" 
                  alt="Amex" 
                  className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="/images/payment/paypal.svg" 
                  alt="PayPal" 
                  className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
