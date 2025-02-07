
// CubeModel.jsx
import React, { Suspense, useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Grid, useGLTF, Html } from '@react-three/drei';
import VideoPreloader from './VideoPreloader';
import { EffectComposer, SMAA } from '@react-three/postprocessing';
import * as THREE from 'three';

const FallbackMaterial = () => {
  return (
    <meshStandardMaterial
      attach="material"
      color="#cccccc"
      roughness={0.8}
      metalness={0.2}
    />
  );
};

const Model = ({ url, onCreated }) => {
  const { scene, materials } = useGLTF(url, {
    useCache: true, // Используем кэш моделей
    draco: true, // Включение Draco-компрессии
  });

  // Оптимизация сцены
  const optimizedScene = useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Оптимизация геометрии
        child.geometry.computeVertexNormals();
        child.geometry.computeBoundingSphere();
        
        // Оптимизация материала
        child.material = new THREE.MeshStandardMaterial({
          color: child.material.color,
          map: child.material.map,
          normalMap: child.material.normalMap,
          roughness: 0.5,
          metalness: 0.2,
          transparent: child.material.transparent,
          opacity: child.material.opacity
        });
        
        // Оптимизация теней
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.needsUpdate = true;
      }
    });
    return scene;
  }, [scene]);

  useEffect(() => {
    onCreated?.();
  }, [onCreated]);

  return <primitive object={optimizedScene} dispose={null} scale={0.01} />;
};

const useFpsMonitor = () => {
  const [fps, setFps] = useState(60);
  const lastCalled = useRef(performance.now());
  const frameCount = useRef(0);

  useEffect(() => {
    const calculateFps = () => {
      const now = performance.now();
      frameCount.current++;
      
      if (now - lastCalled.current >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastCalled.current = now;
      }
      requestAnimationFrame(calculateFps);
    };
    
    calculateFps();
  }, []);

  return fps;
};

const RenderOptimizer = () => {
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, 2));
  const fps = useFpsMonitor();
  const { gl } = useThree();

  useFrame(() => {
    if (fps < 45) {
      const newDpr = Math.max(0.75, dpr - 0.25);
      gl.setPixelRatio(newDpr);
      setDpr(newDpr);
    } else if (fps > 55) {
      const newDpr = Math.min(2, dpr + 0.25);
      gl.setPixelRatio(newDpr);
      setDpr(newDpr);
    }
  });

  return null;
};

const ProductViewer = React.memo(({ modelPath, onCreated, onRotateStart, onRotateEnd }) => {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: true
      }}
      camera={{
        position: [0, 0, 2.5],
        fov: 45,
        near: 0.1,
        far: 1000
      }}
    >
      <RenderOptimizer />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      <Suspense fallback={<FallbackMaterial />}>
        <Model url={modelPath} onCreated={onCreated} />
      </Suspense>

      <EffectComposer multisampling={0}>
        <SMAA />
      </EffectComposer>

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        autoRotate={!isInteracting}
        minDistance={1}
        maxDistance={5}
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

const CubeModel = ({ onRotateStart, onRotateEnd, autoRotate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = React.useState(null);
  const controlsRef = useRef();
  const containerRef = useRef(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleEnd = () => {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      setTimeout(() => {
        controls.autoRotateSpeed = 1;
      }, 1000);
    };

    controls.addEventListener('end', handleEnd);
    return () => controls.removeEventListener('end', handleEnd);
  }, []);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (autoRotate) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    } else {
      controls.autoRotate = false;
    }
  }, [autoRotate]);

  if (error) {
    return (
      <div className="error-fallback">
        Ошибка загрузки: {error}
      </div>
    );
  }

  return (
    <div className="cube-container"
      ref={containerRef} 
      style={{ 
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="preloader-overlay"
          >
            <VideoPreloader />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Canvas
        onCreated={() => setIsLoading(false)}
        camera={{ 
          position: [4, 4, 4],
          fov: 45,
          near: 0.1,
          far: 1000 
        }}
        frameloop="always"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          touchAction: 'none'
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Grid
          position={[0, -1, 0]}
          args={[10, 10]}
          cellColor="#6f6f6f"
          sectionColor="#4a4a4a"
          fadeDistance={30}
          fadeStrength={1}
        />
        
        <Box args={[2, 2, 2]}>
          <meshStandardMaterial 
            color="#ffffff"
            roughness={0.5}
            metalness={0.3}
            emissive="#000000"
            emissiveIntensity={0.1}
          />
        </Box>
        
        <OrbitControls 
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          touchAction="pan-y"
          maxDistance={8}
          minDistance={4}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={2}
          onStart={() => {
            onRotateStart();
            document.body.style.cursor = 'grabbing';
            controlsRef.current.autoRotate = false;
          }}
          onEnd={() => {
            onRotateEnd();
            document.body.style.cursor = 'default';
            controlsRef.current.autoRotate = true;
          }}
        />
      </Canvas>
    </div>
  );
};

export default CubeModel;
