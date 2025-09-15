import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  GraduationCap, 
  User, 
  Shield, 
  ChefHat,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LoginPageProps {
  onLogin: (userType: 'user' | 'admin' | 'kitchen') => void;
}

interface LoginForm {
  identifier: string;
  password: string;
}

const sampleCredentials = {
  user: { identifier: 'VIT2025001', password: 'user123' },
  admin: { identifier: 'admin01', password: 'admin123' },
  kitchen: { identifier: 'kitchen01', password: 'chef123' }
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [forms, setForms] = useState<Record<string, LoginForm>>({
    user: { identifier: '', password: '' },
    admin: { identifier: '', password: '' },
    kitchen: { identifier: '', password: '' }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateForm = (userType: string, field: keyof LoginForm, value: string) => {
    setForms(prev => ({
      ...prev,
      [userType]: { ...prev[userType], [field]: value }
    }));
    // Clear error when user starts typing
    if (errors[userType]) {
      setErrors(prev => ({ ...prev, [userType]: '' }));
    }
  };

  const handleLogin = (userType: 'user' | 'admin' | 'kitchen') => {
    const form = forms[userType];
    const credentials = sampleCredentials[userType];
    
    if (!form.identifier || !form.password) {
      setErrors(prev => ({ ...prev, [userType]: 'Please fill in all fields' }));
      return;
    }

    if (form.identifier === credentials.identifier && form.password === credentials.password) {
      toast.success(`Welcome back!`);
      onLogin(userType);
    } else {
      setErrors(prev => ({ ...prev, [userType]: 'Invalid credentials. Please try again.' }));
    }
  };

  const fillSampleCredentials = (userType: 'user' | 'admin' | 'kitchen') => {
    const credentials = sampleCredentials[userType];
    setForms(prev => ({
      ...prev,
      [userType]: { identifier: credentials.identifier, password: credentials.password }
    }));
  };

  const getTabConfig = (type: string) => {
    switch (type) {
      case 'user':
        return {
          icon: User,
          title: 'Student/Faculty Login',
          identifierLabel: 'Roll Number / Employee ID',
          identifierPlaceholder: 'Enter your Roll No (e.g., VIT2025001)',
          description: 'Access your canteen account'
        };
      case 'admin':
        return {
          icon: Shield,
          title: 'Admin Login',
          identifierLabel: 'Admin ID',
          identifierPlaceholder: 'Enter your Admin ID (e.g., admin01)',
          description: 'Manage canteen operations'
        };
      case 'kitchen':
        return {
          icon: ChefHat,
          title: 'Kitchen Access',
          identifierLabel: 'Kitchen ID',
          identifierPlaceholder: 'Enter your Kitchen ID (e.g., kitchen01)',
          description: 'Manage order preparation'
        };
      default:
        return {
          icon: User,
          title: 'Login',
          identifierLabel: 'ID',
          identifierPlaceholder: 'Enter your ID',
          description: 'Access your account'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* VIT Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-primary p-3 rounded-full">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Canteeno</h1>
              <p className="text-sm text-muted-foreground">Vidyalankar Institute of Technology</p>
            </div>
          </div>
          <p className="text-lg text-foreground/80">
            Smart Canteen Management System
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Login to Continue</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="user" className="text-xs">Student</TabsTrigger>
                  <TabsTrigger value="admin" className="text-xs">Admin</TabsTrigger>
                  <TabsTrigger value="kitchen" className="text-xs">Kitchen</TabsTrigger>
                </TabsList>

                {['user', 'admin', 'kitchen'].map((userType) => {
                  const config = getTabConfig(userType);
                  const Icon = config.icon;
                  const form = forms[userType];

                  return (
                    <TabsContent key={userType} value={userType} className="space-y-4 mt-6">
                      <div className="text-center mb-4">
                        <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-2">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">{config.title}</h3>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${userType}-identifier`}>{config.identifierLabel}</Label>
                          <Input
                            id={`${userType}-identifier`}
                            type="text"
                            placeholder={config.identifierPlaceholder}
                            value={form.identifier}
                            onChange={(e) => updateForm(userType, 'identifier', e.target.value)}
                            className="h-12"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${userType}-password`}>Password</Label>
                          <div className="relative">
                            <Input
                              id={`${userType}-password`}
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              value={form.password}
                              onChange={(e) => updateForm(userType, 'password', e.target.value)}
                              className="h-12 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-12 w-12"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {errors[userType] && (
                          <Alert className="border-destructive">
                            <AlertDescription className="text-destructive">
                              {errors[userType]}
                            </AlertDescription>
                          </Alert>
                        )}

                        <Button
                          onClick={() => handleLogin(userType as 'user' | 'admin' | 'kitchen')}
                          className="w-full h-12 bg-primary hover:bg-primary/90"
                        >
                          Sign In
                        </Button>

                        {/* Sample Credentials Helper */}
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-2">For testing:</p>
                          <div className="text-xs space-y-1">
                            <p><strong>ID:</strong> {sampleCredentials[userType as keyof typeof sampleCredentials].identifier}</p>
                            <p><strong>Password:</strong> {sampleCredentials[userType as keyof typeof sampleCredentials].password}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fillSampleCredentials(userType as 'user' | 'admin' | 'kitchen')}
                            className="w-full mt-2 h-8 text-xs"
                          >
                            Use Sample Credentials
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-6 text-sm text-muted-foreground"
        >
          <p>&copy; 2024 Vidyalankar Institute of Technology</p>
          <p>Canteen Management System</p>
        </motion.div>
      </motion.div>
    </div>
  );
}