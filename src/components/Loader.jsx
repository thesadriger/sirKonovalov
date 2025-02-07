import React from 'react';
import { OrbitControls } from '@react-three/drei';

export default function Loader() {
  return (
    <div className="model-loader">
      <div className="loader-spinner" />
      <p>Загрузка модели...</p>
    </div>
  );
} 