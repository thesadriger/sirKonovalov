import React from 'react';
import VideoPreloader from './VideoPreloader';
import '@styles/components/ModelPreloader.less';

export default () => (
  <div className="model-preloader">
    <VideoPreloader />
    <span>Загрузка 3D модели...</span>
  </div>
); 