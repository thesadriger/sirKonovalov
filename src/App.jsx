// App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as antd from 'antd';
import NavBar from './components/NavBar';
import AnimatedRoutes from './AnimatedRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';

const { Header, Content, Footer } = antd.Layout;

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <antd.Layout>
          <ErrorBoundary>
            <Header style={{
              backgroundColor: 'transparent',
              padding: '0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              borderRadius: '0 0 10px 10px'
            }}>
              <NavBar />
            </Header>
            <Content style={{ minHeight: '80vh', padding: '24px 50px', marginTop: '25px' }}>
              <AnimatedRoutes />
            </Content>
            <Footer style={{ 
              textAlign: 'center', 
              backgroundColor: 'var(--footer-bg)',
              color: '#83653F',
              marginTop: '20px',
              transition: 'var(--theme-transition)'
            }}>
              sirKonovalov ©2025
            </Footer>
          </ErrorBoundary>
        </antd.Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 