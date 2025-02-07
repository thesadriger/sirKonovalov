// AnimatedRoutes.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Home from './pages/HomePage';
import Catalog from './pages/CatalogPage';
import CustomOrderPage from './pages/CustomOrderPage';
import MaterialsPage from './pages/MaterialsPage';
// при желании импортировать и другие страницы

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/catalog"
          element={
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <Catalog />
            </motion.div>
          }
        />
        <Route path="/order" element={<CustomOrderPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        {/* ...другие роуты */}
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes; 