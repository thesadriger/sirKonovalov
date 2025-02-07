import React from 'react';
import { useTexture } from '@react-three/drei';

export const AdaptiveTexture = ({ quality = 'high' }) => {
  const resolution = quality === 'high' ? 2048 : 1024;
  
  const texture = useTexture({
    map: `/textures/${quality}/diffuse.jpg`,
    normalMap: `/textures/${quality}/normal.jpg`,
  });

  return <meshStandardMaterial {...texture} />;
}; 