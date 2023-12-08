// SpinningImage.tsx

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';

const SpinningImage: React.FC = () => {
  const meshRef = useRef<any>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01; // Adjust the speed of rotation as needed
    }
  });

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeBufferGeometry args={[2, 2]} />
        <meshBasicMaterial>
          {/* Load the texture image */}
          <texture attach="map" image={new TextureLoader().load('/path/to/your/image.jpg')} />
        </meshBasicMaterial>
      </mesh>
    </Canvas>
  );
};

export default SpinningImage;
