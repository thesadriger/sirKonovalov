import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export function JacketModel(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/models/leather_jacket.glb');
  
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        geometry={nodes.jacket.geometry}
        material={materials.leather}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      >
        <meshStandardMaterial 
          color="#83653F"
          roughness={0.4}
          metalness={0.2}
          envMapIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload('/models/leather_jacket.glb'); 