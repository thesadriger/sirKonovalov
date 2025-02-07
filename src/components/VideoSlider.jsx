// components/VideoSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import { VIDEOS } from '../constants/videos';
import VideoPlayer from './VideoPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPreloader from './VideoPreloader';
import styled from 'styled-components';

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%; /* Учитываем высоту NavBar */
  overflow: hidden;
  z-index: 0; /* Для корректного позиционирования относительно других секций */

  @media (maxWidth: @screen-sm) {
    height: calc(70vh - 60px);
  }

  @media (maxWidth: 480px) and (orientation: portrait) {
    min-height: auto;
  }
`;

const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  z-index: 1 !important;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Прижимаем к верхнему краю */
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    transform: none;

    @media (max-width: @screen-sm) {
      object-fit: cover;
    }

    @media (max-width: 480px) {
      object-position: center top;
    }
  }
`;

const ProgressContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
  cursor: pointer;
  
  @media (max-width: @screen-sm) {
    bottom: 10px;
    gap: 4px;
  }
`;

const ProgressBar = styled.div`
  width: ${props => props.$active ? '40px' : '24px'};
  height: 3px;
  background: ${props => props.$active ? '#fff' : 'rgba(255,255,255,0.2)'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  transition: width 0.3s ease, background 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? '#fff' : 'rgba(255,255,255,0.5)'};
  }
  
  @media (max-width: @screen-sm) {
    width: ${props => props.$active ? '30px' : '18px'};
    height: 2px;
  }
`;

const VideoSlider = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  // Проверяем наличие видео
  if (!VIDEOS || VIDEOS.length === 0) {
    return <div>Видео не найдены</div>;
  }

  useEffect(() => {
    const video = videoRef.current;
    const handleEnded = () => {
      setCurrentVideoIndex(prev => (prev + 1) % VIDEOS.length);
    };

    const playVideo = () => {
      if (video) {
        video.play().catch(error => {
          console.log('Автовоспроизведение заблокировано:', error);
        });
      }
    };

    if (video) {
      video.addEventListener('ended', handleEnded);
      video.load(); // Принудительная перезагрузка источника
      playVideo();
    }

    return () => {
      if (video) {
        video.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentVideoIndex]);

  return (
    <VideoContainer>
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentVideoIndex}
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          animate={{ opacity: 1, filter: 'blur(0)' }}
          exit={{ opacity: 0, filter: 'blur(4px)' }}
          transition={{ 
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
            filter: { duration: 0.4 }
          }}
        >
          <VideoWrapper>
            <VideoPlayer
              ref={videoRef}
              src={VIDEOS[currentVideoIndex].src}
              style={{ borderRadius: 0 }}
              preload="metadata"
            />
          </VideoWrapper>
        </motion.div>
      </AnimatePresence>
      
      <ProgressContainer>
        {VIDEOS.map((_, index) => (
          <ProgressBar
            key={index}
            $active={currentVideoIndex === index}
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.pause();
                setCurrentVideoIndex(index);
                videoRef.current.play();
              }
            }}
          />
        ))}
      </ProgressContainer>
    </VideoContainer>
  );
};

export default VideoSlider; 