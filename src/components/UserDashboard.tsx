import { useState, useEffect } from 'react';
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
  Filter,
  Loader2,
  RefreshCw,
  ChefHat
} from 'lucide-react';
import { toast } from 'sonner';
import ApiService from '../services/api';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url?: string;
  description: string;
  available: boolean;
  created_at: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface OrderItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  menu_item: {
    name: string;
    description: string;
  };
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

interface UserDashboardProps {
  onLogout: () => void;
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const [currentView, setCurrentView] = useState<'menu' | 'orders'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const categories = [
    { id: 'all', name: 'All Items', icon: Filter },
    { id: 'Snacks', name: 'Snacks', icon: Cookie },
    { id: 'Beverages', name: 'Beverages', icon: Coffee },
    { id: 'Meals', name: 'Meals', icon: Utensils },
    { id: 'Desserts', name: 'Desserts', icon: IceCream }
  ];

  // Fetch menu items from backend
  const fetchMenuItems = async () => {
    try {
      const data = await ApiService.getMenuItems() as MenuItem[];
      setMenuItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
    }
  };

  // Fetch user orders from backend
  const fetchOrders = async () => {
    try {
      const data = await ApiService.getOrders() as Order[];
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMenuItems(), fetchOrders()]);
      setLoading(false);
    };
    loadData();

    // Poll for order updates every 10 seconds
    const interval = setInterval(() => {
      if (currentView === 'orders') {
        fetchOrders();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [currentView]);

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

  const placeOrder = async () => {
    if (cart.length === 0) return;
    
    setPlacingOrder(true);
    try {
      console.log('Placing order with cart:', cart);
      // Transform cart items to order format
      const orderItems = cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity
      }));
      console.log('Order items to send:', orderItems);

      const response = await ApiService.createOrder(orderItems);
      console.log('Order creation response:', response);
      
      setIsCartOpen(false);
      setShowOrderConfirmation(true);
      
      // Clear cart and refresh orders
      setCart([]);
      await fetchOrders();
      
      setTimeout(() => {
        setShowOrderConfirmation(false);
      }, 3000);
      
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const updateQuantity = (id: number, change: number) => {
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
      case 'pending': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'preparing': return ChefHat;
      case 'ready': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return Clock;
      default: return Clock;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const refreshData = async () => {
    setLoading(true);
    if (currentView === 'menu') {
      await fetchMenuItems();
    } else {
      await fetchOrders();
    }
    setLoading(false);
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
              <Button
                variant="outline"
                onClick={refreshData}
                disabled={loading}
                className="bg-white text-primary border-white hover:bg-gray-100"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
              
              {currentView === 'menu' && (
                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="relative bg-white text-primary border-white hover:bg-gray-100">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Cart
                      {cartItemCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
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
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Utensils className="w-6 h-6 text-muted-foreground" />
                            </div>
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
                          disabled={placingOrder}
                        >
                          {placingOrder ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Placing Order...
                            </>
                          ) : (
                            'Place Order'
                          )}
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
              <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
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
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        )}

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
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin mr-2" />
                  <span>Loading menu items...</span>
                </div>
              ) : (
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
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-primary">₹{item.price}</span>
                              <Button 
                                onClick={() => addToCart(item)}
                                disabled={!item.available}
                                className="hover:scale-105 transition-transform duration-200"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                {item.available ? 'Add' : 'Unavailable'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'orders' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin mr-2" />
                <span>Loading orders...</span>
              </div>
            ) : (
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
                          <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} text-white px-3 py-1`}>
                          <StatusIcon className="w-4 h-4 mr-2" />
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.menu_item.name}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Total: ₹{order.total_amount}</p>
                          {order.status === 'ready' && (
                            <p className="text-sm text-green-600 font-medium">Ready for pickup!</p>
                          )}
                          {order.status === 'preparing' && (
                            <p className="text-sm text-orange-600 font-medium">Being prepared...</p>
                          )}
                        </div>
                        {order.status === 'ready' && (
                          <Alert className="max-w-sm">
                            <CheckCircle className="w-4 h-4" />
                            <AlertDescription className="text-green-600 font-medium">
                              Your order is ready for pickup!
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                
                {orders.length === 0 && (
                  <div className="text-center py-20 text-muted-foreground">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No orders yet</p>
                    <p>Start by browsing our menu!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}