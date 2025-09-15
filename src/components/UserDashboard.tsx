import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Clock, 
  CheckCircle, 
  Utensils,
  Coffee,
  Cookie,
  IceCream,
  LogOut,
  Menu,
  History,
  Star,
  Filter
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'snacks' | 'beverages' | 'meals' | 'desserts';
  image: string;
  description: string;
  rating: number;
  cookTime: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'ordered' | 'preparing' | 'ready' | 'completed';
  timestamp: string;
  estimatedTime: string;
}

interface UserDashboardProps {
  onLogout: () => void;
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Samosa',
    price: 15,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1589301773859-bb024d3ad558?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1vc2ElMjBpbmRpYW4lMjBzbmFja3xlbnwxfHx8fDE3NTc5MjM5ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Crispy golden samosa with spicy potato filling',
    rating: 4.5,
    cookTime: '5 min'
  },
  {
    id: '2',
    name: 'Masala Chai',
    price: 10,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1594137260937-f59050746e36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNhbGElMjBjaGFpJTIwdGVhfGVufDF8fHx8MTc1Nzg1MDcwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Aromatic spiced tea with milk and sugar',
    rating: 4.8,
    cookTime: '3 min'
  },
  {
    id: '3',
    name: 'Veg Thali',
    price: 85,
    category: 'meals',
    image: 'https://images.unsplash.com/photo-1589778655375-3e622a9fc91c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmb29kJTIwZGlzaGVzJTIwdmFyaWV0eXxlbnwxfHx8fDE3NTc5MzY3NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Complete meal with rice, dal, sabzi, roti and pickle',
    rating: 4.6,
    cookTime: '12 min'
  },
  {
    id: '4',
    name: 'Mixed Snacks',
    price: 25,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1632456954955-da8f2a42d0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFja3MlMjBiZXZlcmFnZXMlMjBjb2xsZWdlJTIwY2FudGVlbnxlbnwxfHx8fDE3NTc5MzY3NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Assorted crispy snacks perfect for sharing',
    rating: 4.3,
    cookTime: '2 min'
  }
];

const mockOrders: Order[] = [
  {
    id: 'ORD001',
    items: [
      { ...menuItems[0], quantity: 2 },
      { ...menuItems[1], quantity: 1 }
    ],
    total: 40,
    status: 'ready',
    timestamp: '10:30 AM',
    estimatedTime: 'Ready for pickup'
  },
  {
    id: 'ORD002',
    items: [
      { ...menuItems[2], quantity: 1 }
    ],
    total: 85,
    status: 'preparing',
    timestamp: '11:15 AM',
    estimatedTime: '5 mins remaining'
  }
];

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const [currentView, setCurrentView] = useState<'menu' | 'orders'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders] = useState<Order[]>(mockOrders);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);

  const categories = [
    { id: 'all', name: 'All Items', icon: Filter },
    { id: 'snacks', name: 'Snacks', icon: Cookie },
    { id: 'beverages', name: 'Beverages', icon: Coffee },
    { id: 'meals', name: 'Meals', icon: Utensils },
    { id: 'desserts', name: 'Desserts', icon: IceCream }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart!`);
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setShowOrderConfirmation(true);
    setTimeout(() => {
      setShowOrderConfirmation(false);
      setCart([]);
      toast.success('Order placed successfully!');
    }, 2000);
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'ordered': return 'bg-blue-500';
      case 'preparing': return 'bg-secondary';
      case 'ready': return 'bg-accent';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'ordered': return Clock;
      case 'preparing': return Utensils;
      case 'ready': return CheckCircle;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-primary-foreground">Canteeno - Student Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              {currentView === 'menu' && (
                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="relative bg-white text-primary border-white hover:bg-gray-100">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Cart
                      {cartItemCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground">
                          {cartItemCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
              <SheetContent className="w-full sm:w-96">
                <SheetHeader>
                  <SheetTitle>Your Cart ({cartItemCount} items)</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[60vh] mt-6">
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                {cart.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <Separator />
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={placeOrder}
                    >
                      Place Order
                    </Button>
                  </div>
                )}
                {cart.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Your cart is empty
                  </div>
                )}
              </SheetContent>
                </Sheet>
              )}
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="bg-white text-primary border-white hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8">
            <Button
              variant={currentView === 'menu' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('menu')}
              className="h-12"
            >
              <Menu className="w-4 h-4 mr-2" />
              Menu
            </Button>
            <Button
              variant={currentView === 'orders' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('orders')}
              className="h-12"
            >
              <History className="w-4 h-4 mr-2" />
              My Orders
            </Button>
          </div>
        </div>
      </div>

      {/* Order Confirmation Popup */}
      <AnimatePresence>
        {showOrderConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card p-6 rounded-lg shadow-xl max-w-sm w-full text-center"
            >
              <div className="bg-accent/20 p-4 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Order Confirmed!</h3>
              <p className="text-muted-foreground mb-4">
                Your order has been placed successfully. You'll receive updates on the status.
              </p>
              <div className="bg-muted p-2 rounded">
                <p className="text-sm">Order Total: ₹{cartTotal}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-6">
        {currentView === 'menu' && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Categories */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {category.name}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Menu Items */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Utensils className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {item.cookTime}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                  {item.rating}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-primary">₹{item.price}</span>
                            <Button 
                              onClick={() => addToCart(item)}
                              className="hover:scale-105 transition-transform duration-200"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {currentView === 'orders' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            <div className="space-y-4">
              {orders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card p-6 rounded-lg border"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">{order.timestamp}</p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-white px-3 py-1`}>
                        <StatusIcon className="w-4 h-4 mr-2" />
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Total: ₹{order.total}</p>
                        <p className="text-sm text-accent">{order.estimatedTime}</p>
                      </div>
                      {order.status === 'ready' && (
                        <Alert className="max-w-sm">
                          <CheckCircle className="w-4 h-4" />
                          <AlertDescription className="text-accent font-medium">
                            Your order is ready for pickup!
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}