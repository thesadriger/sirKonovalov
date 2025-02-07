//src/components/VideoPreloader.jsx
import React from 'react';
import '@styles/components/VideoPreloader.less';
import { motion } from 'framer-motion';

export default () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="video-preloader"
  >
    <div className="spinner" />
  </motion.div>
); 