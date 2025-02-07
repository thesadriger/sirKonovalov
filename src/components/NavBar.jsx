// components/NavBar.jsx
import React from 'react';
import * as antd from 'antd';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import '@styles/components/NavBar.less';

function NavBar() {
  const { theme, toggleTheme } = useTheme();

  const items = [
    {
      key: 'home',
      label: <Link to="/">Коллекции</Link>,
      className: 'nav-item',
      style: { 
        marginRight: 'auto',
        '@media (max-width: 768px)': { display: 'none' }
      }
    },
    {
      key: 'brand',
      label: (
        <img
          src="/img/Logo.png"
          alt="Sirkonovalov Logo"
          style={{ 
            height: '50px',
            '@media (max-width: 768px)': { height: '40px' }
          }}
        />
      ),
      disabled: true,
      style: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        '@media (max-width: 768px)': { flex: 'none', margin: '0 10px' }
      }
    },
    {
      key: 'order',
      label: (
        <Link to="/order">
          <span className="desktop-text">Кастомный заказ</span>
          <span className="mobile-text">Заказ</span>
        </Link>
      ),
      className: 'nav-item',
      style: { 
        marginLeft: 'auto',
        '@media (max-width: 768px)': { marginLeft: 0, padding: '0 8px' }
      }
    },
    {
      key: 'theme',
      label: theme === 'light' ? <BulbOutlined /> : <BulbFilled />,
      className: 'nav-item theme-toggle',
      onClick: toggleTheme,
      style: { '@media (max-width: 768px)': { padding: '0 8px' } }
    }
  ];

  return (
    <antd.Menu
      mode="horizontal"
      className={`nav-menu ${theme}`}
      items={items}
      style={{
        backgroundColor: 'transparent',
        borderBottom: 'none',
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '0 1rem',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        background: theme === 'light' 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(26, 26, 26, 0.8)',
        '@media (maxWidth: @screen-sm)': {
          padding: '0 0.5rem',
          justifyContent: 'space-between'
        }
      }}
    />
  );
}

export default NavBar; 