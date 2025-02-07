// components/VideoPlayer.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { lazyLoad } from '../utils/lazy-load';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPreloader from './VideoPreloader';

const useIntersectionObserver = (ref, options = {}) => {
  const [isIntersecting, setIntersecting] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

const VideoPlayer = React.forwardRef(({ src, style = {} }, ref) => {
  if (!src || !src.webm || !src.mp4) {
    console.error('Invalid video source:', src);
    return <div>Ошибка загрузки видео</div>;
  }

  const videoRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const isVisible = useIntersectionObserver(videoRef, { threshold: 0.1 });

  // Предзагрузка видео
  React.useEffect(() => {
    const preloadElement = document.createElement('video');
    preloadElement.style.display = 'none';
    preloadElement.preload = 'auto';
    
    const sources = [
      { type: 'video/webm', src: src.webm },
      { type: 'video/mp4', src: src.mp4 }
    ];

    sources.forEach(({ type, src }) => {
      const source = document.createElement('source');
      source.type = type;
      source.src = src;
      preloadElement.appendChild(source);
    });

    document.body.appendChild(preloadElement);

    return () => {
      document.body.removeChild(preloadElement);
    };
  }, [src]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      // Явно запускаем воспроизведение при каждой загрузке
      if (video.paused) {
        video.play().catch(() => {
          console.warn('Autoplay blocked');
        });
      }
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  React.useEffect(() => {
    if (isVisible && videoRef.current) {
      // Воспроизведение с обработкой ошибок
      videoRef.current.play().catch(() => {
        console.warn('Автовоспроизведение отключено');
      });

      // Предзагрузка следующего видео
      const nextVideo = document.createElement('video');
      nextVideo.preload = 'auto';
      nextVideo.style.display = 'none';
      
      // Загружаем оба формата
      const sourceMP4 = document.createElement('source');
      sourceMP4.src = src.mp4;
      sourceMP4.type = 'video/mp4';
      
      const sourceWebM = document.createElement('source');
      sourceWebM.src = src.webm;
      sourceWebM.type = 'video/webm';
      
      nextVideo.appendChild(sourceMP4);
      nextVideo.appendChild(sourceWebM);
      document.body.appendChild(nextVideo);

      return () => nextVideo.remove();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isVisible, src]);

  React.useEffect(() => {
    const checkVideoAvailability = async () => {
      try {
        const [webmCheck, mp4Check] = await Promise.all([
          fetch(src.webm),
          fetch(src.mp4)
        ]);
        
        if (!webmCheck.ok || !mp4Check.ok) {
          throw new Error('Видеофайлы не найдены');
        }
      } catch (error) {
        console.error('Ошибка загрузки видео:', error);
        setHasError(true);
      }
    };

    checkVideoAvailability();
  }, [src]);

  const canPlay = (type) => {
    const video = document.createElement('video');
    return video.canPlayType(type) !== '';
  };

  React.useEffect(() => {
    if (!canPlay('video/webm') && !canPlay('video/mp4')) {
      console.error('Браузер не поддерживает видеоформаты');
      setHasError(true);
    }
  }, []);

  React.useEffect(() => {
    const initThree = async () => {
      try {
        // Инициализация Three.js
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');
        if (!gl) throw new Error('WebGL not supported');
      } catch (error) {
        console.error('WebGL Error:', error);
        // Отключаем 3D эффекты при ошибке
        if (videoRef.current) {
          videoRef.current.style.filter = 'none';
        }
      }
    };
    
    initThree();
    
    return () => {
      // Очистка ресурсов Three.js
    };
  }, []);

  return (
    <div style={{ position: 'relative', ...style }}>
      <AnimatePresence>
        {isLoading && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.05)'
            }}
          >
            <VideoPreloader />
          </motion.div>
        )}
      </AnimatePresence>

      <video
        ref={el => {
          videoRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        autoPlay
        muted
        playsInline
        loop={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          minHeight: '100%',
          position: 'relative',
          zIndex: 2,
          borderRadius: style.borderRadius || 0,
          opacity: 1,
          transition: 'opacity 0.3s ease'
        }}
        preload="metadata"
      >
        <source src={src.webm} type="video/webm" />
        <source src={src.mp4} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
});

VideoPlayer.propTypes = {
  src: PropTypes.shape({
    webm: PropTypes.string.isRequired,
    mp4: PropTypes.string.isRequired
  }).isRequired,
  style: PropTypes.object
};

VideoPlayer.displayName = 'VideoPlayer';

const Model = React.memo(({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
});

Model.propTypes = {
  url: PropTypes.string.isRequired
};

Model.displayName = 'Model';

const ProductViewer = React.memo(({ modelPath }) => (
  <Canvas 
    camera={{ position: [0, 0, 2.5] }}
    style={{ background: '#f5f5f5' }}
    dpr={[1, 2]}
    performance={{ min: 0.5 }}
  >
    <ambientLight intensity={1} />
    <directionalLight position={[10, 10, 5]} intensity={1} />
    <Model url={modelPath} />
    <OrbitControls 
      enableZoom={false}
      autoRotate
      rotateSpeed={0.5}
      enablePan={false}
      minPolarAngle={Math.PI / 2}
      maxPolarAngle={Math.PI / 2}
    />
  </Canvas>
));

ProductViewer.propTypes = {
  modelPath: PropTypes.string.isRequired
};

ProductViewer.displayName = 'ProductViewer';

export default VideoPlayer; 