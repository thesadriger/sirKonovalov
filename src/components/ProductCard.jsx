  //src/components/ProductCard.jsx
  import React, { useState, useEffect } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import * as antd from 'antd';
  import { lazyLoad } from '../utils/lazy-load';
  import PropTypes from 'prop-types';
  import '@styles/components/ProductCard.less';
  import VideoPreloader from './VideoPreloader';
  import ModelPreloader from './ModelPreloader';
  
  const ProductViewer = lazyLoad(() => import('./CubeModel'));
  import ProductModal from './ProductModal';
  
  const Placeholder3D = () => (
    <div className="model-preloader">
      <VideoPreloader />
    </div>
  );
  
  const ProductCard = ({ product }) => {
    const [isActive, setIsActive] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
  
    useEffect(() => {
      setIsMounted(true);
      return () => setIsMounted(false);
    }, []);
  
    useEffect(() => {
      if (isHovered) {
        import('./CubeModel').then(module => {
          setIsModelLoaded(true);
        });
      }
    }, [isHovered]);
  
    const handleRotateStart = () => {
      if (isMounted) {
        setIsActive(true);
        setIsInteracting(false);
      }
    };
  
    const handleRotateEnd = () => {
      if (isMounted) {
        setIsActive(false);
        setIsInteracting(true);
        setTimeout(() => setShowOverlay(true), 300);
      }
    };
  
    const handleCardClick = () => {
      if (!isInteracting) {
        setIsExpanded(false);
      }
    };
  
    const handleOpenModal = () => {
      setShowOverlay(false);
      setIsExpanded(true);
    };
  
    return (
      <>
        <motion.div
          className="product-card"
          initial={false}
          animate={isActive ? 'active' : 'inactive'}
          variants={{
            active: { scale: 1.1, zIndex: 1 },
            inactive: { scale: 1, zIndex: 0 }
          }}
          transition={{ type: "spring", stiffness: 250, damping: 15 }}
          onClick={handleCardClick}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <antd.Card
            hoverable
            className="product-card-inner"
            cover={
              <div className="product-viewer-container">
                <React.Suspense fallback={<ModelPreloader />}>
                  {isModelLoaded && (
                    <ProductViewer 
                      onRotateStart={handleRotateStart}
                      onRotateEnd={handleRotateEnd}
                    />
                  )}
                </React.Suspense>
                <AnimatePresence>
                  {showOverlay && (
                    <motion.div
                      className="viewer-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="open-button-container"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      //   transition={{ type: "spring", delay: 0.2 }}
                      >
                        <antd.Button
                          type="primary"
                          shape="round"
                          size="large"
                          onClick={handleOpenModal}
                        >
                          Открыть детали
                        </antd.Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            }
          >
            <antd.Card.Meta
              title={product.title}
              description={product.description}
            />
            <div className="product-price">
              {product.price.toLocaleString('ru-RU')} ₽
            </div>
          </antd.Card>
        </motion.div>
  
        <AnimatePresence>
          {isExpanded && (
            <ProductModal 
              product={product}
              onClose={() => setIsExpanded(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  };
  
  ProductCard.propTypes = {
    product: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired
    }).isRequired
  };
  
  export default ProductCard;