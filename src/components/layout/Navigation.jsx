import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  FileText, 
  BarChart2, 
  Settings,
  ExternalLink 
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/anomalies', icon: AlertTriangle, label: 'Anomalies' },
  { path: '/transactions', icon: FileText, label: 'Transactions' },
  { path: '/analytics', icon: BarChart2, label: 'Analytics' },
  { path: '/admin', icon: Settings, label: 'Admin' }
];

const Navigation = () => {
  return (
    <nav className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-primary mb-8"
        >
          bridgepay.ai
        </motion.div>
        
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
        <a
          href="https://grafana.bridgepay.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary"
        >
          <ExternalLink className="w-4 h-4" />
          <span>System Metrics</span>
        </a>
      </div>
    </nav>
  );
};

export default Navigation;