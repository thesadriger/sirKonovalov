// pages/CatalogPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import * as antd from 'antd';
import ProductCard from '../components/ProductCard';
import '@styles/pages/CatalogPage.less';
import { Row, Col } from 'antd';

const products = [
  {
    id: 1,
    title: 'Косуха',
    description: 'Классический портфель из итальянской кожи с отделением для ноутбука',
    price: 45000
  },
  {
    id: 2,
    title: 'Кожаная куртка',
    description: 'Стильная сумка через плечо из натуральной кожи. Водоотталкивающая пропитка.',
    price: 28000
  },
  {
    id: 3,
    title: 'Кожаный тренч',
    description: 'Вместительная дорожная сумка из премиальной кожи с прочной фурнитурой',
    price: 52000
  }
];

function CatalogPage() {
  return (
    <motion.div
      className="catalog-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="catalog-header">
        <h1 className="mobile-responsive-title">Каталог изделий</h1>
        <p className="centered-description theme-aware-text mobile-responsive-description">
          Эксклюзивные кожаные изделия ручной работы
        </p>
      </div>
      
      <Row 
        className="catalog-grid"
        gutter={[16, 24]}
        justify="center"
      >
        {products.map(product => (
          <Col 
            key={product.id}
            xs={24}
            sm={12}
            md={8}
            lg={8}
            xl={6}
            xxl={4}
            style={{ display: 'flex' }}
          >
            <ProductCard 
              product={product} 
              className="mobile-product-card"
              style={{ 
                width: '100%',
                maxWidth: '500px'
              }}
            />
          </Col>
        ))}
      </Row>
    </motion.div>
  );
}

export default CatalogPage; 
 