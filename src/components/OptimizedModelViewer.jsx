import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense } from 'react';
import { PCFSoftShadowMap } from 'three';
import { Preloader3D } from './Preloader3D';
import { useGLTF, useProgress } from '@react-three/drei';
import { notification } from 'antd';

// Оптимизированный 3D просмотрщик
export default function OptimizedModelViewer({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  const { progress } = useProgress();
  const { gl } = useThree();

  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = PCFSoftShadowMap;

    return () => {
      scene.traverse(obj => {
        if (obj.isMesh) {
          obj.geometry?.dispose();
          obj.material?.dispose();
        }
      });
    };
  }, []);

  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 45, near: 0.1, far: 1000 }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <primitive object={scene} scale={0.8} position={[0, -1, 0]} />
      {progress < 100 && <Preloader3D />}
    </Canvas>
  );
} 