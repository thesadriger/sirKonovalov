// pages/HomePage.jsx
import React, { lazy, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '@styles/pages/HomePage.less';
import { Layout } from 'antd';
import { preloadVideos } from '../utils/preloadVideos';
import VideoPreloader from '../components/VideoPreloader';

const VideoSlider = lazy(() => import('../components/VideoSlider'));

const HomePage = () => {
  useEffect(() => {
    preloadVideos();
  }, []);

  return (
    <div className="home-page">
      <Layout.Content style={{ minHeight: 'calc(100vh - 80px)' }}>
        <Suspense fallback={<VideoPreloader />}>
          <VideoSlider />
        </Suspense>
      </Layout.Content>

      <Link to="/catalog" className="section-link">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          viewport={{ margin: "0px 0px -30% 0px" }}
          transition={{ 
            duration: 0.6,
            type: "spring",
            stiffness: 120
          }}
          className="luxury-section"
        >
          <h2>Искусство в каждой детали</h2>
          <p>Каждое изделие создаётся вручную с особым вниманием к деталям</p>
        </motion.section>
      </Link>

      <Link to="/materials" className="section-link">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          viewport={{ margin: "0px 0px -30% 0px" }}
          transition={{ 
            duration: 0.6,
            type: "spring",
            stiffness: 120,
            delay: 0.1
          }}
          className="materials-section"
        >
          <h2>Премиальные материалы</h2>
          <p>Используем только лучшую итальянскую кожу и фурнитуру</p>
        </motion.section>
      </Link>
    </div>
  );
};

export default HomePage; 