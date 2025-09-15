import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LogOut,
  TrendingUp,
  Users,
  ShoppingCart,
  Clock,
  DollarSign,
  Package,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Settings,
  ChefHat,
  CheckCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminDashboardProps {
  onLogout: () => void;
}

const salesData = [
  { name: 'Mon', sales: 2400, orders: 12 },
  { name: 'Tue', sales: 1398, orders: 8 },
  { name: 'Wed', sales: 9800, orders: 24 },
  { name: 'Thu', sales: 3908, orders: 18 },
  { name: 'Fri', sales: 4800, orders: 22 },
  { name: 'Sat', sales: 3800, orders: 16 },
  { name: 'Sun', sales: 4300, orders: 20 }
];

const categoryData = [
  { name: 'Snacks', value: 35, color: '#DC143C' },
  { name: 'Meals', value: 30, color: '#FFD700' },
  { name: 'Beverages', value: 25, color: '#2E8B57' },
  { name: 'Desserts', value: 10, color: '#FF6B35' }
];

const recentOrders = [
  { id: 'ORD001', customer: 'Rahul Sharma', items: 3, total: 125, status: 'preparing', time: '2 mins ago' },
  { id: 'ORD002', customer: 'Priya Patel', items: 1, total: 85, status: 'ready', time: '5 mins ago' },
  { id: 'ORD003', customer: 'Amit Kumar', items: 2, total: 45, status: 'completed', time: '8 mins ago' },
  { id: 'ORD004', customer: 'Sneha Singh', items: 4, total: 180, status: 'ordered', time: '12 mins ago' }
];

const menuItems = [
  { id: 1, name: 'Samosa', category: 'Snacks', price: 15, stock: 25, sales: 45 },
  { id: 2, name: 'Masala Chai', category: 'Beverages', price: 10, stock: 50, sales: 78 },
  { id: 3, name: 'Veg Thali', category: 'Meals', price: 85, stock: 15, sales: 23 },
  { id: 4, name: 'Gulab Jamun', category: 'Desserts', price: 20, stock: 20, sales: 12 }
];

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ordered': return 'bg-blue-500';
      case 'preparing': return 'bg-secondary';
      case 'ready': return 'bg-accent';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const todayStats = {
    totalSales: 15240,
    totalOrders: 84,
    avgOrderValue: 181,
    peakHour: '12:30 PM'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-primary-foreground">Canteeno - Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-accent text-accent-foreground">
                Live Updates
              </Badge>
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

      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="menu">
              <Settings className="w-4 h-4 mr-2" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="kitchen">
              <ChefHat className="w-4 h-4 mr-2" />
              Kitchen Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Today's Sales</p>
                        <p className="text-2xl font-bold">₹{todayStats.totalSales.toLocaleString()}</p>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-full">
                        <DollarSign className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-center mt-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-accent mr-1" />
                      <span className="text-accent">+12%</span>
                      <span className="text-muted-foreground ml-1">from yesterday</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{todayStats.totalOrders}</p>
                      </div>
                      <div className="bg-secondary/10 p-3 rounded-full">
                        <Package className="w-6 h-6 text-secondary" />
                      </div>
                    </div>
                    <div className="flex items-center mt-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-accent mr-1" />
                      <span className="text-accent">+8%</span>
                      <span className="text-muted-foreground ml-1">from yesterday</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Order Value</p>
                        <p className="text-2xl font-bold">₹{todayStats.avgOrderValue}</p>
                      </div>
                      <div className="bg-accent/10 p-3 rounded-full">
                        <ShoppingCart className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                    <div className="flex items-center mt-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-accent mr-1" />
                      <span className="text-accent">+5%</span>
                      <span className="text-muted-foreground ml-1">from yesterday</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Peak Hour</p>
                        <p className="text-2xl font-bold">{todayStats.peakHour}</p>
                      </div>
                      <div className="bg-orange-500/10 p-3 rounded-full">
                        <Clock className="w-6 h-6 text-orange-500" />
                      </div>
                    </div>
                    <div className="flex items-center mt-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground mr-1" />
                      <span className="text-muted-foreground">45 orders this hour</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                        </div>
                        <div>
                          <p className="text-sm">{order.items} items</p>
                          <p className="text-sm font-medium">₹{order.total}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          {order.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{order.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">₹{order.total}</p>
                          <p className="text-sm text-muted-foreground">{order.items} items</p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          {order.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Menu Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-medium">₹{item.price}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Stock</p>
                          <p className="font-medium">{item.stock}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Sales Today</p>
                          <p className="font-medium">{item.sales}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kitchen" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kitchen Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="bg-blue-500 p-3 rounded-full w-fit mx-auto mb-2">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-blue-700">Pending Orders</h3>
                    <p className="text-2xl font-bold text-blue-600">8</p>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="bg-secondary p-3 rounded-full w-fit mx-auto mb-2">
                      <ChefHat className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <h3 className="font-semibold text-orange-700">Currently Cooking</h3>
                    <p className="text-2xl font-bold text-orange-600">5</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="bg-accent p-3 rounded-full w-fit mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <h3 className="font-semibold text-green-700">Ready for Pickup</h3>
                    <p className="text-2xl font-bold text-green-600">3</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Kitchen Performance Today</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Average Preparation Time</span>
                        <span className="font-medium">8.5 minutes</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Orders Completed On Time</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Kitchen Efficiency</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#DC143C" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Daily Target</span>
                    <span>₹15,240 / ₹20,000</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Customer Satisfaction</span>
                    <span>4.8 / 5.0</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Order Completion Rate</span>
                    <span>94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}