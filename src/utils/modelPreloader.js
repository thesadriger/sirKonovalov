// utils/modelPreloader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const preloadModels = (modelPaths) => {
  const validPaths = modelPaths.filter(path => {
    if (typeof path !== 'string' || !path.includes('.glb')) {
      console.error('Invalid model path:', path);
      return false;
    }
    return true;
  });

  if (validPaths.length === 0) return;

  const loader = new GLTFLoader();
  validPaths.forEach(path => {
    try {
      loader.load(
        path,
        () => console.log('Model preloaded:', path),
        undefined,
        (error) => console.error('Preload error:', error)
      );
    } catch (e) {
      console.error('Failed to preload model:', path, e);
    }
  });
}; 