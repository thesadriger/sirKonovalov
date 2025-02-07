export const getOptimizedVideoSources = (basePath) => {
  return {
    webm: `${basePath}.webm`,
    mp4: `${basePath}.mp4`
  };
}; 