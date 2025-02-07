
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as antd from 'antd';
import { lazyLoad } from '../utils/lazy-load';
import VideoPreloader from './VideoPreloader';
import '@styles/components/ProductModal.less';
import { UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const VideoPlayer = lazyLoad(() => import('./VideoPlayer'));
const ProductViewer = lazyLoad(() => import('./ProductViewer'));

const ProductModal = ({ product, onClose }) => {
  const titleParts = product.title.split(' ');
  const mainTitle = titleParts[0];
  const subtitle = titleParts.slice(1).join(' ');
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isModelExpanded, setIsModelExpanded] = useState(true);
  const scrollTimeout = useRef(null);
  const imagesContainerRef = useRef(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const lastScrollPosition = useRef(0);
  const [customModel, setCustomModel] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  useEffect(() => {
    return () => clearTimeout(scrollTimeout.current);
  }, []);

  const handleScroll = () => {
    const container = imagesContainerRef.current;
    const scrollTop = container.scrollTop;
    
    // Определяем направление скролла
    const isScrollingDown = scrollTop > lastScrollPosition.current;
    lastScrollPosition.current = scrollTop;
    
    // Показываем/скрываем индикатор
    const atTop = scrollTop < 50;
    setShowScrollIndicator(atTop);
    
    // Логика изменения размера модели
    if (!isModelExpanded) return;
    setIsModelExpanded(false);
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      if (container.scrollTop === 0) {
        setIsModelExpanded(true);
      }
    }, 3000);
  };

  const handleRotateStart = () => {
    clearTimeout(scrollTimeout.current);
    setIsModelExpanded(true);
    imagesContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleRotateEnd = () => {
    clearTimeout(scrollTimeout.current);
    setIsModelExpanded(false);
    imagesContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const container = imagesContainerRef.current;
    const checkPosition = () => {
      setShowScrollIndicator(container.scrollTop < 50);
    };
    
    container.addEventListener('scroll', checkPosition);
    return () => container.removeEventListener('scroll', checkPosition);
  }, []);

  const handleModelUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && /\.(glb|gltf)$/i.test(file.name)) {
      if (file.size > 50 * 1024 * 1024) { // Лимит 50MB
        antd.notification.error({
          message: 'Ошибка загрузки',
          description: 'Файл слишком большой. Максимальный размер: 50MB'
        });
        return;
      }
      
      const modelUrl = URL.createObjectURL(file);
      setCustomModel(modelUrl);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (customModel) {
        URL.revokeObjectURL(customModel);
      }
    };
  }, [customModel]);

  return (
    <motion.div
      className="product-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="product-modal-content"
        initial={{ 
          scale: 0.8, 
          opacity: 0,
          height: 0 // Начальное состояние высоты
        }}
        animate={{ 
          scale: 0.9, 
          opacity: 1,
          height: "95vh" // Конечное состояние высоты
        }}
        exit={{ 
          scale: 0.8, 
          opacity: 0,
          height: 0 // Анимация при закрытии
        }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 500,
          height: { 
            type: "tween",
            duration: 0.45,
            ease: "easeInOut"
          }
        }}
      >
        <div className="modal-left-panel">
          <div className="video-container">
            <React.Suspense fallback={<VideoPreloader />}>
              <VideoPlayer
                src={{
                  mp4: '/videos/1_optimized.mp4',
                  webm: '/videos/1.webm'
                }}
                style={{
                  borderRadius: '8px'
                }}
              />
            </React.Suspense>
          </div>
          
          <div className="content-wrapper">
            <h1>
              <span className="main-title">{mainTitle}</span>
              <span className="subtitle">{subtitle}</span>
            </h1>
            <p className="description">Таким образом начало повседневной работы по формированию позиции влечет за собой процесс внедрения и модернизации позиций, занимаемых участниками в отношении поставленных задач. Повседневная практика показывает, что постоянное информационно-пропагандистское обеспечение нашей деятельности в значительной степени обуславливает создание системы обучения кадров, соответствует насущным потребностям. Повседневная практика показывает, что сложившаяся структура организации влечет за собой процесс внедрения и модернизации соответствующий условий активизации.</p>
            <antd.Button type="primary" size="large" className="order-button">
              Оформить заказ
            </antd.Button>
          </div>
        </div>
        <div className="modal-right-panel">
          <div 
            className="images-scroll-container"
            ref={imagesContainerRef}
            onScroll={handleScroll}
            style={{ height: isModelExpanded ? '35%' : '80%' }}
          >
            <div className="model-viewer-controls">
            <div className="upload-controls">
              <Button 
                type="primary" 
                icon={<UploadOutlined />}
                onClick={() => fileInputRef.current.click()}
                className="upload-button"
              >
                Загрузить модель
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleModelUpload}
                accept=".glb,.gltf"
              />
            </div>
          </div>
            <div className="model-viewer-container" style={{ height: isModelExpanded ? '65%' : '20%' }}>
            <React.Suspense fallback={<div className="loading-placeholder">...</div>}>
              <ProductViewer 
                modelPath={customModel || product.defaultModel}
                onCreated={() => setIsModelLoaded(true)}
                onRotateStart={handleRotateStart}
                onRotateEnd={handleRotateEnd}
              />
            </React.Suspense>
          </div>
            <div className={`scroll-indicator ${showScrollIndicator ? 'visible' : ''}`}>
              <span>↓ Прокрутите вниз</span>
            </div>
            {[1, 2, 3].map((img) => (
              <img 
                key={img}
                src={`/img/${img}.png`} 
                alt={product.title}
                className="detail-image"
                // Оптимальный размер изображений: 1200x800px (соотношение 3:2)
              />
            ))}
          </div>
        </div>

        <button className="close-button" onClick={onClose}>×</button>
      </motion.div>
    </motion.div>
  );
};

export default ProductModal; 
