import React, { Suspense, Component, ErrorInfo, ReactNode, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class BallErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Ball component error:', error, errorInfo);
    // Mobile error fix: Enhanced error boundary for better mobile experience
    console.warn('Ball Error Context:', {
      component: 'Ball',
      file: 'src/components/canvas/Ball.tsx',
      timestamp: new Date().toISOString()
    });
  }

  render() {
    if (this.state.hasError) {
      // Enhanced fallback UI
      return (
        <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
          <ambientLight intensity={0.25} />
          <directionalLight position={[0, 0, 0.05]} />
          <mesh castShadow receiveShadow scale={2.75}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
              color='#915EFF'
              polygonOffset
              polygonOffsetFactor={-5}
              flatShading
            />
          </mesh>
        </Float>
      );
    }

    return this.props.children;
  }
}

interface BallProps {
  imgUrl: string | null | undefined;
}

// Simple fallback ball component  
const FallbackBall: React.FC = () => (
  <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
    <ambientLight intensity={0.25} />
    <directionalLight position={[0, 0, 0.05]} />
    <mesh castShadow receiveShadow scale={2.75}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color='#915EFF'
        polygonOffset
        polygonOffsetFactor={-5}
        flatShading
      />
    </mesh>
  </Float>
);

// Enhanced Ball component with better texture handling
const BallWithTexture: React.FC<{ imgUrl: string }> = ({ imgUrl }) => {
  // Create a safe URL string that avoids null/undefined issues
  const safeUrl = React.useMemo(() => {
    if (!imgUrl || typeof imgUrl !== 'string') {
      return null;
    }
    // Manually clean the URL string without using trim() to avoid mobile issues
    const cleanUrl = String(imgUrl).replace(/^\s+|\s+$/g, '');
    return cleanUrl.length > 0 ? cleanUrl : null;
  }, [imgUrl]);

  // Only load texture if we have a valid URL
  const texture = safeUrl ? useTexture(safeUrl) : null;
  
  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color='#fff8eb'
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        {texture && (
          <Decal
            position={[0, 0, 1]}
            rotation={[2 * Math.PI, 0, 6.25]}
            scale={1}
            map={texture}
          />
        )}
      </mesh>
    </Float>
  );
};

const Ball: React.FC<BallProps> = ({ imgUrl }) => {
  // Validate the image URL
  const isValidUrl = useCallback((url: string | null | undefined): boolean => {
    try {
      // First check if url exists and is a string
      if (!url || typeof url !== 'string') {
        return false;
      }
      
      // Convert to string and check for empty values without using trim
      const urlStr = String(url || '');
      
      // Check if URL has content by checking length and removing whitespace manually
      const hasContent = urlStr.length > 0 && urlStr.replace(/\s/g, '').length > 0;
      
      if (!hasContent) {
        return false;
      }
      
      // Check if URL has valid format without trimming
      const startsWithHttp = urlStr.indexOf('http') === 0 || urlStr.indexOf('https') === 0;
      const startsWithSlash = urlStr.indexOf('/') === 0;
      const startsWithData = urlStr.indexOf('data:') === 0;
      
      return startsWithHttp || startsWithSlash || startsWithData;
    } catch (error) {
      console.warn('URL validation error:', error);
      return false;
    }
  }, []);
  
  // If URL is invalid, return fallback immediately
  if (!isValidUrl(imgUrl)) {
    console.warn('Invalid image URL provided:', imgUrl);
    return <FallbackBall />;
  }

  // Use Suspense and Error Boundary for proper texture loading
  return (
    <Suspense fallback={<FallbackBall />}>
      <BallWithTexture imgUrl={imgUrl as string} />
    </Suspense>
  );
};

interface BallCanvasProps {
  icon: string | null | undefined;
  enableRotation?: boolean;
}

const BallCanvas: React.FC<BallCanvasProps> = ({ icon, enableRotation = false }) => {
  // Create a comprehensive safe icon processing
  const safeIcon = React.useMemo(() => {
    try {
      // Handle null, undefined, or non-string values
      if (!icon || typeof icon !== 'string') {
        return '';
      }
      
      // Convert to string and safely process without trim
      const iconStr = String(icon);
      
      // Remove leading/trailing whitespace manually
      const cleanIcon = iconStr.replace(/^\s+|\s+$/g, '');
      
      // Validate the cleaned icon
      if (cleanIcon.length === 0) {
        return '';
      }
      
      // Additional validation for common URL patterns
      const isValidPath = (
        cleanIcon.indexOf('./') === 0 || 
        cleanIcon.indexOf('/') === 0 || 
        cleanIcon.indexOf('http') === 0 || 
        cleanIcon.indexOf('data:') === 0
      );
      
      return isValidPath ? cleanIcon : '';
    } catch (error) {
      console.warn('Icon processing error:', error);
      return '';
    }
  }, [icon]);
  
  return (
    <Canvas
      frameloop='demand'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <BallErrorBoundary>
        <OrbitControls 
          enableZoom={false} 
          enableRotate={enableRotation}
          enablePan={false}
        />
        <Ball imgUrl={safeIcon} />
      </BallErrorBoundary>

      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;