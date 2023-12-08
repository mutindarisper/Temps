import react,  {useRef} from 'react'
import { Canvas, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import key from '../../assets/key.svg'
const SpinningImage: React.FC = () => {
    const refMesh = useRef<any>();
  
    useFrame(() => {
      if(refMesh.current) {
        // rotating the object
        refMesh.current.rotation.x += 0.01;
      }
    });
    return (<mesh ref={refMesh} position={[0, 0, 0]} >
       <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* <planeBufferGeometry args={[2, 2]} /> */}
        <meshBasicMaterial>
          {/* Load the texture image */}
          <texture attach="map" image={new TextureLoader().load('https://cdn.webshopapp.com/shops/34658/files/11273089/900x900x2/master-key.jpg')} />
        </meshBasicMaterial>
    </mesh>);
  }
  
  export default () => (
    <Canvas>
      <SpinningImage />
    </Canvas>
  
  )