import React, { Suspense, useRef, Component, ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Error Boundary for Earth component
interface EarthErrorBoundaryState {
  hasError: boolean;
}

interface EarthErrorBoundaryProps {
  children: ReactNode;
}

class EarthErrorBoundary extends Component<EarthErrorBoundaryProps, EarthErrorBoundaryState> {
  constructor(props: EarthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): EarthErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Earth component error:', error, errorInfo);
    console.warn('Earth Error Context:', {
      component: 'Earth',
      file: 'src/components/canvas/Earth.tsx',
      modelPath: './planet/scene.gltf',
      timestamp: new Date().toISOString()
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback: Simple sphere when Earth model fails to load
      return (
        <mesh scale={2.5} position-y={0}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color="#4a90e2" 
            wireframe={true}
            transparent
            opacity={0.6}
          />
        </mesh>
      );
    }

    return this.props.children;
  }
}

// Separate component for GLTF loading with proper error handling
const EarthModel: React.FC = () => {
  // Safe GLTF loading with error protection
  const modelPath = React.useMemo(() => {
    const path = "./planet/scene.gltf";
    // Ensure path is clean and valid
    return typeof path === 'string' && path.length > 0 ? path : null;
  }, []);

  const earth = useGLTF(modelPath || "./planet/scene.gltf");
  const meshRef = useRef<THREE.Group>(null);
  
  // Auto-rotate the planet
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <primitive 
      ref={meshRef}
      object={earth.scene} 
      scale={2.5} 
      position-y={0} 
      rotation-y={0}
    />
  );
};

const Earth: React.FC = () => {
  return (
    <Suspense fallback={
      <mesh scale={2.5} position-y={0}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#4a90e2" 
          wireframe={true}
          transparent
          opacity={0.3}
        />
      </mesh>
    }>
      <EarthModel />
    </Suspense>
  );
};

// Preload the GLTF model
useGLTF.preload("./planet/scene.gltf");

const EarthCanvas: React.FC = () => {
  return (
    <Canvas
      shadows
      frameloop='demand'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <EarthErrorBoundary>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[20, 20, 10]} intensity={1.5} castShadow />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Earth />
        <Preload all />
      </EarthErrorBoundary>
    </Canvas>
  );
};

export default EarthCanvas;