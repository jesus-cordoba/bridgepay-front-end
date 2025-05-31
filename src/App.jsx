import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/layout/Navigation';
import './App.css';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Anomalies = React.lazy(() => import('./pages/Anomalies'));
const Transactions = React.lazy(() => import('./pages/Transactions'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Admin = React.lazy(() => import('./pages/Admin'));

const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

function App() {
  return (
    <Router>
      <div className="flex">
        <Navigation />
        
        <main className="flex-1 ml-64 min-h-screen bg-gray-50">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/anomalies" element={<Anomalies />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </React.Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;