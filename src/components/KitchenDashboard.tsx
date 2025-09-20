import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  LogOut,
  Clock,
  ChefHat,
  CheckCircle,
  AlertCircle,
  Timer,
  Utensils,
  Bell,
  Loader2
} from 'lucide-react';

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: Array<{
    id: number;
    menu_item_id: number;
    quantity: number;
    price: number;
    menu_item: {
      name: string;
      description: string;
    };
  }>;
}

interface KitchenOrder {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    specialInstructions?: string;
  }>;
  customer: string;
  orderTime: string;
  estimatedTime: number; // in minutes
  status: 'pending' | 'cooking' | 'ready';
  priority: 'normal' | 'high' | 'urgent';
  total: number;
}

interface KitchenDashboardProps {
  onLogout: () => void;
}

const initialOrders: KitchenOrder[] = [
  {
    id: 'ORD001',
    customer: 'Rahul Sharma',
    items: [
      { name: 'Samosa', quantity: 2 },
      { name: 'Masala Chai', quantity: 1 }
    ],
    orderTime: '10:30 AM',
    estimatedTime: 5,
    status: 'pending',
    priority: 'normal',
    total: 40
  },
  {
    id: 'ORD002',
    customer: 'Priya Patel',
    items: [
      { name: 'Veg Thali', quantity: 1, specialInstructions: 'Less spicy' }
    ],
    orderTime: '10:35 AM',
    estimatedTime: 12,
    status: 'cooking',
    priority: 'high',
    total: 85
  },
  {
    id: 'ORD003',
    customer: 'Amit Kumar',
    items: [
      { name: 'Mixed Snacks', quantity: 2 },
      { name: 'Cold Coffee', quantity: 1 }
    ],
    orderTime: '10:40 AM',
    estimatedTime: 8,
    status: 'ready',
    priority: 'normal',
    total: 75
  },
  {
    id: 'ORD004',
    customer: 'Sneha Singh',
    items: [
      { name: 'Pav Bhaji', quantity: 2 },
      { name: 'Lassi', quantity: 2 }
    ],
    orderTime: '10:45 AM',
    estimatedTime: 15,
    status: 'pending',
    priority: 'urgent',
    total: 120
  }
];

export function KitchenDashboard({ onLogout }: KitchenDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchKitchenOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:4000/kitchen/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch kitchen orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch kitchen orders');
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
    setLoading(false);
    const interval = setInterval(() => {
      fetchKitchenOrders();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`http://localhost:4000/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state
      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      ));

      // Show notification
      let message = '';
      switch (newStatus) {
        case 'preparing':
          message = `Started cooking Order #${orderId}`;
          break;
        case 'ready':
          message = `Order #${orderId} is ready for pickup!`;
          break;
      }
      setNotification(message);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500';
      case 'preparing': return 'bg-secondary';
      case 'ready': return 'bg-accent';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: KitchenOrder['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 border-red-200 bg-red-50';
      case 'high': return 'text-orange-500 border-orange-200 bg-orange-50';
      case 'normal': return 'text-gray-500 border-gray-200 bg-gray-50';
      default: return 'text-gray-500 border-gray-200 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'preparing': return ChefHat;
      case 'ready': return CheckCircle;
      default: return Clock;
    }
  };

  const getPriorityIcon = (priority: KitchenOrder['priority']) => {
    switch (priority) {
      case 'urgent': return AlertCircle;
      case 'high': return Timer;
      case 'normal': return Clock;
      default: return Clock;
    }
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const cookingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-accent border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-accent-foreground p-2 rounded-full">
                  <ChefHat className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-accent-foreground">Kitchen Dashboard</h1>
                  <p className="text-sm text-accent-foreground/80">Real-time order management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-accent-foreground text-accent">
                <Utensils className="w-3 h-3 mr-1" />
                {orders.length} Active Orders
              </Badge>
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="bg-white text-accent border-white hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 right-4 z-50 bg-accent text-accent-foreground p-4 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Pending Orders ({pendingOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {pendingOrders.map((order: Order, index: number) => {
                    const StatusIcon = getStatusIcon(order.status);

                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border-2 rounded-lg p-4 border-blue-200 bg-blue-50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary text-primary-foreground">
                              Order #{order.id}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleString()}
                          </span>
                        </div>

                        <p className="font-medium mb-2">User ID: {order.user_id}</p>

                        <div className="space-y-1 mb-3">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.menu_item.name}</span>
                            </div>
                          ))}
                        </div>

                        <Separator className="my-3" />

                        <div className="flex items-center justify-between">
                          <span className="text-sm">₹{order.total_amount}</span>
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="bg-secondary hover:bg-secondary/90"
                          >
                            <ChefHat className="w-3 h-3 mr-1" />
                            Start Cooking
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {pendingOrders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No pending orders</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cooking Orders */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-secondary" />
                  Cooking ({cookingOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {cookingOrders.map((order: Order, index: number) => {
                    const StatusIcon = getStatusIcon(order.status);

                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border-2 rounded-lg p-4 border-orange-200 bg-orange-50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-secondary text-secondary-foreground">
                              Order #{order.id}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleString()}
                          </span>
                        </div>

                        <p className="font-medium mb-2">User ID: {order.user_id}</p>

                        <div className="space-y-1 mb-3">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.menu_item.name}</span>
                            </div>
                          ))}
                        </div>

                        <Separator className="my-3" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Timer className="w-4 h-4 text-secondary" />
                            </motion.div>
                            <span className="text-sm">Cooking...</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="bg-accent hover:bg-accent/90"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark Ready
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {cookingOrders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <ChefHat className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No orders cooking</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ready Orders */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  Ready for Pickup ({readyOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {readyOrders.map((order: Order, index: number) => {
                    const StatusIcon = getStatusIcon(order.status);

                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          boxShadow: [
                            "0 0 0 rgba(46, 139, 87, 0)",
                            "0 0 20px rgba(46, 139, 87, 0.3)",
                            "0 0 0 rgba(46, 139, 87, 0)"
                          ]
                        }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1,
                          boxShadow: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                        className="border-2 border-accent rounded-lg p-4 bg-accent/10"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="bg-accent text-accent-foreground">
                            Order #{order.id}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleString()}
                          </span>
                        </div>

                        <p className="font-medium mb-2">User ID: {order.user_id}</p>

                        <div className="space-y-1 mb-3">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.menu_item.name}</span>
                            </div>
                          ))}
                        </div>

                        <Separator className="my-3" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium text-accent">Ready!</span>
                          </div>
                          <span className="text-sm font-medium">₹{order.total_amount}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {readyOrders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No orders ready</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
