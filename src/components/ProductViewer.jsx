// ProductViewer.js
import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { EffectComposer, SMAA } from '@react-three/postprocessing';
import * as THREE from 'three';
import { preloadModels } from '../utils/modelPreloader';

const FallbackMaterial = () => (
  <meshStandardMaterial
    attach="material"
    color="#cccccc"
    roughness={0.8}
    metalness={0.2}
  />
);

const Model = ({ url, onCreated }) => {
  if (!url || typeof url !== 'string') {
    console.error('Invalid model URL:', url);
    return null;
  }

  const { scene } = useGLTF(url, {
    useCache: true,
    draco: {
      enable: true,
      decodeSpeed: 1.0,
      encodeSpeed: 1.0,
      quantizePosition: 14,
      quantizeNormal: 10,
      quantizeTexcoord: 12
    }
  });

  const optimizedScene = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 10 / maxDim;
    const verticalOffset = 0.2;
    
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material?.isMaterial) {
          const originalMat = child.material;
          const material = new THREE.MeshStandardMaterial({
            roughness: 0.5,
            metalness: 0.2,
            map: originalMat.map || null,
            normalMap: originalMat.normalMap || null,
            transparent: originalMat.transparent,
            opacity: originalMat.opacity
          });

          if (material.map) {
            material.map.encoding = THREE.sRGBEncoding;
            material.map = material.map.clone();
          }
          
          material.needsUpdate = true;
          child.material = material;

          child.material.encoding = THREE.sRGBEncoding;
          
          if (child.material.transparent) {
            child.material.depthWrite = false;
          }
        } else {
          console.warn('Invalid material detected, using fallback:', child);
          child.material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.8,
            metalness: 0.2
          });
        }
        
        child.geometry.computeVertexNormals();
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    scene.position.x = -center.x * scale;
    scene.position.y = (-center.y * scale) + verticalOffset;
    scene.position.z = -center.z * scale;
    scene.scale.set(scale, scale, scale);

    return scene;
  }, [scene]);

  useEffect(() => {
    onCreated?.();
  }, [onCreated]);

  return <primitive object={optimizedScene} />;
};

const RenderOptimizer = () => {
  const { gl } = useThree();
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, 2));
  
  useFrame(() => {
    const performanceLevel = gl.info.render.frame / 1000;
    const newDpr = performanceLevel > 60 ? Math.min(2, dpr + 0.1) 
                 : performanceLevel < 45 ? Math.max(1, dpr - 0.1) 
                 : dpr;
    if (newDpr !== dpr) {
      gl.setPixelRatio(newDpr);
      setDpr(newDpr);
    }
  });

  return null;
};

const GroundPlane = () => (
  <group position={[0, -4, 0]}>
    {/* Сетка */}
    <gridHelper
      args={[50, 50, '#4a4a4a', '#2a2a2a']}
      rotation={[-Math.PI/1, 0, 0]}
      position={[0, 0.02, 0]}
    />
    {/* Плоскость с прозрачностью */}
    <mesh 
      rotation={[-Math.PI/2, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial 
        color="#1a1a1a"
        roughness={0.9}
        metalness={0.1}
        transparent
        opacity={0.75}
      />
    </mesh>
  </group>
);

const materialOptimization = (material) => {
  // 1. Обновление материала принудительно
  material.needsUpdate = true;
  
  // 2. Оптимизация параметров поверхности
  material.roughness = Math.min(material.roughness, 0.8); // Ограничение шероховатости
  material.metalness = Math.max(material.metalness, 0.1); // Гарантированная металличность

  // 3. Оптимизация текстурных карт
  if (material.map) {
    material.map.generateMipmaps = true; // Генерация мипмап-уровней
    material.map.minFilter = THREE.LinearMipmapLinearFilter; // Качественная фильтрация
    material.map.anisotropy = 2; // Добавляем анизотропную фильтрацию
  }

  // 4. Отключение неиспользуемых функций
  material.skinning = false;       // Для статических моделей
  material.morphTargets = false;  // Без морфинга
  material.morphNormals = false;   // Без изменения нормалей

  // 5. Оптимизация для мобильных устройств
  material.precision = 'mediump'; // Средняя точность вычислений
};

const ProductViewer = React.memo(({ modelPath, onCreated, onRotateStart, onRotateEnd }) => {
  const [isInteracting, setIsInteracting] = useState(false);
  
  // Перенесем логику рендерера внутрь отдельного компонента
  const RenderSetup = () => {
    const { gl } = useThree();
    
    useEffect(() => {
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.0;
    }, [gl]);
    
    return null;
  };

  // Добавляем предзагрузку для текущей модели
  useEffect(() => {
    if (modelPath && typeof modelPath === 'string') {
      preloadModels([modelPath]);
    } else {
      console.warn('Invalid model path:', modelPath);
    }
  }, [modelPath]);

  return (
    <Canvas
      shadows
      gl={{ 
        antialias: true,
        powerPreference: "high-performance",
        alpha: true
      }}
      camera={{
        position: [1.8, 1, 1.8],
        fov: 90,
        near: 0.1,
        far: 2000
      }}
    >
      <RenderSetup />
      <RenderOptimizer />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
        castShadow
        shadow-mapSize={2048}
      />
      <GroundPlane />
      <Suspense fallback={<FallbackMaterial />}>
        {modelPath ? (
          <Model url={modelPath} onCreated={onCreated} />
        ) : (
          <Html center>No model loaded</Html>
        )}
      </Suspense>

      <EffectComposer multisampling={0}>
        <SMAA />
      </EffectComposer>

      <OrbitControls
        enableDamping
        dampingFactor={0.015}
        autoRotate={!isInteracting}
        minDistance={6}
        maxDistance={8}
        minPolarAngle={Math.PI/6}
        maxPolarAngle={Math.PI/1.65}
        target={[0, 0.25, 0]}
        onStart={() => {
          setIsInteracting(true);
          onRotateStart?.();
        }}
        onEnd={() => {
          setIsInteracting(false);
          onRotateEnd?.();
        }}
      />
    </Canvas>
  );
});

export default ProductViewer;