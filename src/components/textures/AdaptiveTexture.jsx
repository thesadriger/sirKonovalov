import { useTexture } from '@react-three/drei';

export const AdaptiveTexture = () => {
  const texture = useTexture({
    map: '/textures/default_diffuse.jpg',
    normalMap: '/textures/default_normal.jpg'
  });
  return <meshStandardMaterial {...texture} />;
}; 