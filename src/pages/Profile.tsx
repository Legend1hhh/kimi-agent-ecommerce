import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, MapPin, Package, Heart, 
  Settings, Camera, Edit2, Save, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function Profile() {
  const { user, updateProfile, isLoading } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const response = await updateProfile(formData);
    if (response.success) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } else {
      toast.error(response.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  const menuItems = [
    { name: 'Profile', icon: User, href: '/profile', active: true },
    { name: 'My Orders', icon: Package, href: '/orders' },
    { name: 'Wishlist', icon: Heart, href: '/wishlist' },
    { name: 'Addresses', icon: MapPin, href: '/addresses' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div className="pt-36 pb-12 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-violet-600">Home</Link>
          <span>/</span>
          <span className="text-slate-900">My Profile</span>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        item.active 
                          ? 'bg-violet-50 text-violet-600' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white hover:bg-violet-700">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium">Profile Picture</p>
                    <p className="text-sm text-slate-500">JPG, GIF or PNG. Max size 2MB</p>
                  </div>
                </div>

                <Separator />

                {/* Form */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-slate-500">Last changed 3 months ago</p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
