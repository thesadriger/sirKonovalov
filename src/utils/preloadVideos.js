import { VIDEOS } from '../constants/videos';

export const preloadVideos = () => {
  VIDEOS.forEach(video => {
    const videoElement = document.createElement('video');
    videoElement.preload = 'auto';
    videoElement.style.display = 'none';
    videoElement.innerHTML = `
      <source src="${video.src.webm}" type="video/webm">
      <source src="${video.src.mp4}" type="video/mp4">
    `;
    document.body.appendChild(videoElement);
  });
}; 