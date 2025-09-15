import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginPage } from './components/LoginPage';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { KitchenDashboard } from './components/KitchenDashboard';
import { Toaster } from './components/ui/sonner';

type ViewType = 'login' | 'user' | 'admin' | 'kitchen';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('login');

  const handleLogin = (userType: 'user' | 'admin' | 'kitchen') => {
    setCurrentView(userType);
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  return (
    <div className="size-full">
      <AnimatePresence mode="wait">
        {currentView === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <LoginPage onLogin={handleLogin} />
          </motion.div>
        )}
        
        {currentView === 'user' && (
          <motion.div
            key="user"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <UserDashboard onLogout={handleLogout} />
          </motion.div>
        )}
        
        {currentView === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <AdminDashboard onLogout={handleLogout} />
          </motion.div>
        )}
        
        {currentView === 'kitchen' && (
          <motion.div
            key="kitchen"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <KitchenDashboard onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster />
    </div>
  );
}