import React, { useRef, Suspense, Component, ErrorInfo, ReactNode, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import * as THREE from "three";

// Error Boundary for Stars component
interface StarsErrorBoundaryState {
  hasError: boolean;
}

interface StarsErrorBoundaryProps {
  children: ReactNode;
}

class StarsErrorBoundary extends Component<StarsErrorBoundaryProps, StarsErrorBoundaryState> {
  constructor(props: StarsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): StarsErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Stars component error:', error, errorInfo);
    console.warn('Stars Error Context:', {
      component: 'Stars',
      file: 'src/components/canvas/Stars.tsx',
      starCount: 5000,
      timestamp: new Date().toISOString()
    });
  }

  render() {
    if (this.state.hasError) {
      // Return null for background element when it fails
      return null;
    }

    return this.props.children;
  }
}

interface StarsProps {
  count?: number;
  [key: string]: any;
}

const Stars: React.FC<StarsProps> = ({ count = 5000, ...props }) => {
  const ref = useRef<THREE.Points>(null);

  // Memoize the sphere generation for better performance
  const sphere = useMemo(() => {
    try {
      return random.inSphere(new Float32Array(count), { radius: 1.2 });
    } catch (error) {
      console.warn('Error generating star positions:', error);
      // Fallback: create a simpler star field
      const fallbackCount = Math.min(count, 1500);
      const positions = new Float32Array(fallbackCount); // Reduced complexity
      for (let i = 0; i < fallbackCount; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2.4;
        positions[i + 1] = (Math.random() - 0.5) * 2.4;
        positions[i + 2] = (Math.random() - 0.5) * 2.4;
      }
      return positions;
    }
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color='#f272c8'
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const starCount = isMobile ? 1500 : 5000;

  return (
    <div className='w-full h-full absolute inset-0 z-[-1] overflow-hidden pointer-events-none'>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <StarsErrorBoundary>
          <Suspense fallback={null}>
            <Stars count={starCount} />
          </Suspense>
          <Preload all />
        </StarsErrorBoundary>
      </Canvas>
    </div>
  );
};

export default StarsCanvas;