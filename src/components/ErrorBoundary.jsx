// components/ErrorBoundary.jsx
import React, { Component } from 'react';
import * as antd from 'antd';

class ErrorBoundary extends Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Здесь можно добавить логирование ошибок
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px' }}>
          <antd.Alert
            message="Произошла ошибка"
            description="Попробуйте перезагрузить страницу"
            type="error"
            showIcon
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 