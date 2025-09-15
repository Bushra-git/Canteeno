import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ChefHat, 
  Users, 
  Clock, 
  Smartphone,
  Star,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: (userType: 'user' | 'admin' | 'kitchen') => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-primary p-3 rounded-full">
                <ChefHat className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-5xl font-bold text-primary">Canteeno</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Smart Canteen. Fast, Fresh, Hassle-Free.
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Vidyalankar Institute of Technology's revolutionary canteen management system. 
              Order your favorite meals with just a few clicks and skip the queues!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1615657712281-368153fb1834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMGVhdGluZyUyMGZvb2R8ZW58MXx8fHwxNTc5MzY3NDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="College student enjoying food"
              className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => onLoginClick('user')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:glow"
            >
              <Users className="w-5 h-5 mr-2" />
              Login as Student/Faculty
            </Button>
            <Button
              onClick={() => onLoginClick('admin')}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Admin Dashboard
            </Button>
            <Button
              onClick={() => onLoginClick('kitchen')}
              variant="outline"
              size="lg"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ChefHat className="w-5 h-5 mr-2" />
              Kitchen Access
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="bg-secondary/20 p-4 rounded-full w-fit mx-auto mb-4">
              <Clock className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick Ordering</h3>
            <p className="text-muted-foreground">
              Skip the long queues and order your favorite meals in seconds
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="bg-accent/20 p-4 rounded-full w-fit mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-muted-foreground">
              Track your order status from kitchen to pickup in real-time
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="bg-primary/20 p-4 rounded-full w-fit mx-auto mb-4">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fresh & Quality</h3>
            <p className="text-muted-foreground">
              Freshly prepared meals with quality ingredients every time
            </p>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center text-muted-foreground"
        >
          <p>&copy; 2024 Canteeno - Vidyalankar Institute of Technology</p>
        </motion.div>
      </div>
    </div>
  );
}