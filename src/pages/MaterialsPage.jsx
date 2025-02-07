//src/pages/MaterialsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as antd from 'antd';
import '@styles/pages/MaterialsPage.less';
import { useTheme } from '../contexts/ThemeContext';
import { Modal, Button } from 'antd';
import { ZoomInOutlined } from '@ant-design/icons';
import { getDominantColor } from '../utils/getDominantColor';
import { useLazyLoad } from '../utils/useLazyLoad';

const materials = [
  { 
    id: 1,
    title: 'Итальянская телячья кожа',
    description: 'Мягкая эластичная кожа с натуральной текстурой. Идеально подходит для создания классических изделий с безупречным внешним видом.',
    image: '/img/1.png',
    features: ['Натуральная текстура', 'Высокая прочность', 'Долговечность']
  },
  { 
    id: 2,
    title: 'Кожа рептилий',
    description: 'Экзотическая фактура для уникальных изделий. Каждое изделие становится неповторимым благодаря природному рисунку.',
    image: '/img/2.png',
    features: ['Уникальный узор', 'Премиальный вид', 'Особая прочность']
  },
  {
    id: 3,
    title: 'Итальянская фурнитура',
    description: 'Высококачественные металлические элементы от лучших итальянских производителей.',
    image: '/img/3.png',
    features: ['Надёжность', 'Элегантный дизайн', 'Долговечность']
  }
];

const Card = ({ title, image, description, tags }) => {
  const [isActive, setIsActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bgColor, setBgColor] = useState('transparent');
  const imageRef = useRef(null);
  const isImageLoaded = useLazyLoad(imageRef);

  useEffect(() => {
    const loadColor = async () => {
      try {
        const color = await getDominantColor(image);
        setBgColor(color);
      } catch (error) {
        console.error('Error loading dominant color:', error);
        setBgColor('transparent');
      }
    };
    
    loadColor();
  }, [image]);

  const imageContainerStyle = {
    position: 'relative',
    height: '250px',
    borderRadius: '20px',
    overflow: 'hidden',
    backgroundColor: bgColor,
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center',
  };

  const handleCardClick = () => {
    setIsActive(!isActive);
  };

  const handleEnlargeClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <div 
      className={`material-card ${isActive ? 'active' : ''}`}
      ref={imageRef}
    >
      <Modal
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width="80%"
        bodyStyle={{ 
          padding: 0,
          backgroundColor: 'transparent',
          boxShadow: 'none' 
        }}
        maskStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(5px)'
        }}
        transitionName=""
        maskTransitionName=""
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 25 
          }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <img 
            src={isImageLoaded ? image : ''}
            data-loaded={isImageLoaded}
            alt={title} 
            style={{ 
              width: '100%', 
              height: 'auto',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 8,
              padding: '20px 0'
            }}
          />
        </motion.div>
      </Modal>

      <div 
        className="ant-card-cover"
        style={imageContainerStyle}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      >
        <div 
          className="image-background-layer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: bgColor,
            zIndex: 1
          }}
        />
        
        <img 
          src={isImageLoaded ? image : ''}
          data-loaded={isImageLoaded}
          alt={title}
          style={{ 
            ...imageStyle,
            position: 'relative',
            zIndex: 2 
          }}
          loading="lazy"
          decoding="async"
        />
        
        <div className={`card-title-overlay ${isActive ? 'active' : ''}`}>
          <h3 className="card-title">{title}</h3>
          
          <motion.div
            className="enlarge-button-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { 
              opacity: 1, 
              y: 0,
              transition: { 
                type: "spring",
                delay: 0.4,
                stiffness: 200
              } 
            } : {}}
          >
            <Button
              type="primary"
              shape="circle"
              icon={<ZoomInOutlined />}
              onClick={handleEnlargeClick}
              className="enlarge-button"
            />
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="card-content"
        initial={false}
        animate={isActive ? 'open' : 'collapsed'}
        variants={{
          open: { 
            opacity: 1,
            height: "auto",
            transition: { 
              type: "spring",
              stiffness: 150,
              damping: 20,
              duration: 0.5
            }
          },
          collapsed: { 
            opacity: 0,
            height: 0,
            transition: { 
              type: "spring",
              stiffness: 200,
              damping: 25,
              when: "afterChildren"
            }
          }
        }}
      >
        <div className="ant-card-body">
          <motion.p 
            className="ant-card-meta-description"
            initial={{ y: -10, opacity: 0 }}
            animate={isActive ? { y: 0, opacity: 1 } : {}}
            transition={{ 
              type: "spring",
              stiffness: 120,
              damping: 15,
              delay: isActive ? 0.1 : 0
            }}
          >
            {description}
          </motion.p>
          <motion.div 
            className="features-list"
            initial={{ y: 10, opacity: 0 }}
            animate={isActive ? { y: 0, opacity: 1 } : {}}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 12,
              delay: isActive ? 0.2 : 0
            }}
          >
            {tags.map((tag, index) => (
              <motion.span 
                key={index} 
                className="feature-tag"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 150,
                  damping: 10,
                  delay: isActive ? index * 0.05 : 0
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

function MaterialsPage() {
  const { theme } = useTheme();

  return (
    <motion.div
      className={`materials-page ${theme}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3, ease: "easeInOut", type: "spring" }}
      data-theme={theme}
    >
      <div className="materials-header">
        <h1>Премиальные материалы</h1>
        <p>Мы тщательно отбираем лучшие материалы для наших изделий</p>
      </div>
      
      <motion.div
        className="materials-grid"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.3, ease: "easeInOut", type: "spring" }}
      >
        {materials.map(material => (
          <motion.div
            key={material.id}
            className="material-card-wrapper"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ 
              once: true, 
              margin: "-10%",
              amount: 0.1
            }}
            transition={{ duration: 0.3, delay: 0.1 * material.id }}
          >
            <Card
              title={material.title}
              image={material.image}
              description={material.description}
              tags={material.features}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default MaterialsPage; 