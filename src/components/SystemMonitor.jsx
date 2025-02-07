import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '@styles/components/SystemMonitor.less';

const SystemMonitor = () => {
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    fps: 0,
    loadTime: 0,
    usedMB: 0,
    totalMB: 0
  });

  useEffect(() => {
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const getAdvancedMetrics = () => {
      // Метрики времени загрузки
      const nav = performance.getEntriesByType("navigation")[0];
      const resources = performance.getEntriesByType("resource");
      
      // Расчет FPS
      const now = performance.now();
      if (now - lastFpsUpdate > 1000) {
        const fps = Math.round(frameCount * 1000 / (now - lastFpsUpdate));
        frameCount = 0;
        lastFpsUpdate = now;
        setStats(prev => ({...prev, fps}));
      }
      frameCount++;

      // Метрики памяти
      if (performance.memory) {
        const memory = performance.memory;
        const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(1);
        const totalMB = (memory.totalJSHeapSize / 1048576).toFixed(1);
        const memoryUsage = (memory.usedJSHeapSize / memory.totalJSHeapSize * 100).toFixed(1);
        
        setStats(prev => ({
          ...prev,
          memory: memoryUsage,
          usedMB,
          totalMB
        }));
      }
    };

    const interval = setInterval(() => {
      getPerformanceData();
      getAdvancedMetrics();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getPerformanceData = () => {
      // Получаем данные о памяти
      const memory = performance.memory;
      const memoryUsage = memory ? 
        (memory.usedJSHeapSize / memory.totalJSHeapSize * 100).toFixed(1) : 0;
      
      // Получаем данные о CPU (примерные)
      const timing = performance.timing;
      const cpuUsage = timing ? 
        Math.min(100, (1 - timing.domComplete / timing.loadEventEnd) * 100).toFixed(1) : 0;

      // Имитация данных о диске
      const diskUsage = Math.random() * 20 + 70; // Примерные данные

      setStats({
        cpu: cpuUsage,
        memory: memoryUsage,
        disk: diskUsage
      });
    };

    const interval = setInterval(getPerformanceData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="system-monitor"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="monitor-item">
        <span className="label">CPU:</span>
        <div className="progress-bar">
          <div 
            className="progress-fill cpu" 
            style={{ width: `${stats.cpu}%` }}
          />
          <span className="value">{stats.cpu}%</span>
        </div>
      </div>
      
      <div className="monitor-item">
        <span className="label">RAM:</span>
        <div className="progress-bar">
          <div 
            className="progress-fill ram" 
            style={{ width: `${stats.memory}%` }}
          />
          <span className="value">{stats.memory}%</span>
        </div>
      </div>
      
      <div className="monitor-item">
        <span className="label">Disk:</span>
        <div className="progress-bar">
          <div 
            className="progress-fill disk" 
            style={{ width: `${stats.disk}%` }}
          />
          <span className="value">{stats.disk}%</span>
        </div>
      </div>

      <div className="monitor-item">
        <span className="label">FPS:</span>
        <div className="progress-bar">
          <div 
            className="progress-fill fps" 
            style={{ width: `${Math.min(stats.fps, 60)/60*100}%` }}
          />
          <span className="value">{stats.fps} FPS</span>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric">
          <span className="metric-label">Загрузка:</span>
          <span className="metric-value">{stats.loadTime}ms</span>
        </div>
        <div className="metric">
          <span className="metric-label">Память:</span>
          <span className="metric-value">{stats.usedMB} / {stats.totalMB} MB</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemMonitor; 