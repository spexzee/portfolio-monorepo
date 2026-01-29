import React, { useRef, useEffect, useState } from "react";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { motion } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { styles } from "../styles";
import { textVariant } from "./../utils/motion";
import { Technology } from "../constants";
import { useGetTechnologies } from "../API/tech";
import { SimpleLoader, MobileCompatibilityWrapper } from "./";

interface BallData {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isDragging: boolean;
  isSettled: boolean; // New: track if ball has settled
  springs: any;
  api: any;
}

const BALL_SIZE = 112;
const GRAVITY = 0.4; // Improved gravity for better physics
const BOUNCE = 0.7; // Better bounce coefficient
const FRICTION = 0.98; // Realistic friction
const SETTLE_THRESHOLD = 0.1; // Better settling threshold
const MIN_COLLISION_DISTANCE = BALL_SIZE * 0.85; // Improved collision detection

// WebGL detection hook
const useWebGLSupport = () => {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(!!gl);
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  return webglSupported;
};

const BouncyBall: React.FC<{
  technology: Technology;
  ball: BallData;
  index: number;
  showLabel?: boolean; // Add prop to control label visibility
}> = ({ technology, ball, index, showLabel = true }) => {
  const webglSupported = useWebGLSupport();

  // Create springs for this specific ball
  const [springs, api] = useSpring(() => ({
    x: ball.x,
    y: ball.y,
    scale: 1,
    opacity: 0,
    config: { tension: 300, friction: 20 }
  }));

  // Update ball's springs and api reference
  useEffect(() => {
    ball.springs = springs;
    ball.api = api;

    // Staggered fade in
    setTimeout(() => {
      api.start({ opacity: 1 });
    }, index * 200);
  }, [springs, api, index, ball]);

  const bind = useDrag(
    ({ active, movement: [mx, my], first, last, memo = [ball.x, ball.y] }) => {
      if (first) {
        ball.isDragging = true;
        ball.vx = 0;
        ball.vy = 0;
        api.start({ scale: 1.1 });
      }

      if (active) {
        ball.x = memo[0] + mx;
        ball.y = memo[1] + my;
        api.start({ x: ball.x, y: ball.y });
      }

      if (last) {
        ball.isDragging = false;
        ball.isSettled = false;
        // Add controlled velocity based on drag speed (clamped to prevent extreme speeds)
        const maxVelocity = 8; // Limit maximum velocity
        ball.vx = Math.max(-maxVelocity, Math.min(maxVelocity, mx * 0.15));
        ball.vy = Math.max(-maxVelocity, Math.min(maxVelocity, my * 0.15));
        api.start({ scale: 1 });
      }

      return memo;
    }
  );

  // Enhanced fallback for non-WebGL devices or when context limit is reached
  const TechFallback = () => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="w-28 h-28 rounded-full bg-[#fff8eb] flex items-center justify-center border-2 border-white/20 shadow-xl overflow-hidden">
        {technology?.icon && !imageError ? (
          <div className="relative w-16 h-16">
            <img
              src={technology.icon}
              alt={technology.name}
              className="w-full h-full object-contain z-10"
              onError={() => setImageError(true)}
            />
            {/* Subtle shadow to mimic 3D decal look */}
            <div className="absolute inset-0 bg-black/5 blur-[2px] rounded-full transform translate-y-1 translate-x-1" />
          </div>
        ) : (
          <div className="text-2xl font-bold text-gray-400">{technology?.name?.charAt(0) || '⚡'}</div>
        )}
      </div>
    );
  };

  return (
    <animated.div
      {...bind()}
      style={{
        x: springs.x,
        y: springs.y,
        scale: springs.scale,
        opacity: springs.opacity,
        position: "absolute",
        width: BALL_SIZE,
        height: BALL_SIZE + 25, // Extra height for text
        cursor: ball.isDragging ? "grabbing" : "grab",
        zIndex: ball.isDragging ? 999 : 1,
        touchAction: "none" // Prevent browser touch handling
      }}
      className="flex flex-col items-center justify-start select-none" // Changed to justify-start
    >
      <div className="w-28 h-28 pointer-events-none relative">
        {webglSupported ? (
          <MobileCompatibilityWrapper
            componentName="BallCanvas"
            fallback={<TechFallback />}
          >
            <BallCanvas icon={technology?.icon || ''} enableRotation={false} />
          </MobileCompatibilityWrapper>
        ) : (
          <TechFallback />
        )}
      </div>
      {showLabel && (
        <div className="mt-1 w-full text-center pointer-events-none">
          <p className="text-xs font-bold text-white drop-shadow-lg shadow-black px-2 py-1 bg-black/70 rounded-md backdrop-blur-sm border border-white/20">
            {technology?.name || "Unknown"}
          </p>
        </div>
      )}
    </animated.div>
  );
};

const Tech: React.FC = () => {
  const { data: technologies = [], isLoading, error } = useGetTechnologies();
  const containerRef = useRef<HTMLDivElement>(null);
  const ballsRef = useRef<BallData[]>([]);
  const [balls, setBalls] = useState<BallData[]>([]);
  const [gravityMode, setGravityMode] = useState(false); // Toggle state
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  // Initialize balls when technologies are loaded and container is available
  useEffect(() => {
    if (!technologies || technologies.length === 0 || !containerRef.current || !gravityMode) return;

    const containerWidth = containerRef.current.offsetWidth;
    // const containerHeight = containerRef.current.offsetHeight;

    const newBalls: BallData[] = technologies.map((tech, index) => {
      // Calculate grid with proper spacing to prevent overlap
      const ballSpacing = BALL_SIZE + 30; // Increased spacing between balls
      const cols = Math.floor((containerWidth - 40) / ballSpacing); // Account for margins
      const col = index % cols;
      const row = Math.floor(index / cols);

      // Calculate position with proper spacing and centering
      const totalGridWidth = cols * ballSpacing;
      const startX = (containerWidth - totalGridWidth) / 2 + ballSpacing / 2;
      const x = startX + col * ballSpacing;
      const y = 20 + row * 50; // Vertical spacing

      return {
        id: tech.name || `tech-${index}`,
        x: Math.max(15, Math.min(x, containerWidth - BALL_SIZE - 15)), // Ensure within bounds with margins
        y: Math.max(15, Math.min(y, 120)), // Keep reasonable initial height
        vx: (Math.random() - 0.5) * 0.5, // Very small initial velocity
        vy: 0,
        isDragging: false,
        isSettled: false, // Initially not settled
        springs: null,
        api: null
      };
    });

    ballsRef.current = newBalls;
    setBalls(newBalls);
  }, [technologies, gravityMode]);

  // Physics animation loop using requestAnimationFrame with timestamp
  const animate = (time: number) => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    // Calculate delta time for consistent physics
    const deltaTime = previousTimeRef.current ? (time - previousTimeRef.current) / 16.67 : 1;
    previousTimeRef.current = time;

    let ballsUpdated = false;
    const updatedBalls = [...ballsRef.current];

    for (let i = 0; i < updatedBalls.length; i++) {
      const ball = updatedBalls[i];
      if (ball.isDragging || ball.isSettled) continue; // Skip settled balls

      // Apply gravity with better physics
      ball.vy += GRAVITY * deltaTime;

      // Update position
      ball.x += ball.vx * deltaTime;
      ball.y += ball.vy * deltaTime;

      // Wall collisions with proper bouncing
      if (ball.x <= 0) {
        ball.x = 0;
        ball.vx = -ball.vx * BOUNCE;
      } else if (ball.x >= containerWidth - BALL_SIZE) {
        ball.x = containerWidth - BALL_SIZE;
        ball.vx = -ball.vx * BOUNCE;
      }

      // Top boundary - prevent balls from going above container
      if (ball.y <= 0) {
        ball.y = 0;
        ball.vy = -ball.vy * BOUNCE;
        // Add small downward velocity to prevent sticking
        if (ball.vy > -0.5) {
          ball.vy = 0.5;
        }
      }

      // Floor collision with improved physics
      if (ball.y >= containerHeight - BALL_SIZE - 25) {
        ball.y = containerHeight - BALL_SIZE - 25;
        ball.vy = -ball.vy * BOUNCE;

        // Better settling detection
        if (Math.abs(ball.vy) < SETTLE_THRESHOLD && Math.abs(ball.vx) < SETTLE_THRESHOLD) {
          ball.vy = 0;
          ball.vx *= 0.9; // Gradual friction when settling
          ball.isSettled = true;
        }
      }

      // Apply friction only when not colliding
      ball.vx *= FRICTION;
      ball.vy *= FRICTION;

      // Update spring positions with improved physics response
      if (ball.api) {
        ball.api.start({
          x: ball.x,
          y: ball.y,
          config: { tension: 300, friction: 30 } // Snappier response for physics
        });
      }

      ballsUpdated = true;
    }

    // Improved collision detection with realistic physics
    for (let i = 0; i < updatedBalls.length; i++) {
      for (let j = i + 1; j < updatedBalls.length; j++) {
        const ball1 = updatedBalls[i];
        const ball2 = updatedBalls[j];

        const dx = ball2.x - ball1.x;
        const dy = ball2.y - ball1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < MIN_COLLISION_DISTANCE && distance > 0) {
          // Wake up settled balls
          if (ball1.isSettled) ball1.isSettled = false;
          if (ball2.isSettled) ball2.isSettled = false;

          // Collision normal vector
          const nx = dx / distance;
          const ny = dy / distance;

          // Overlap calculation
          const overlap = MIN_COLLISION_DISTANCE - distance;
          const separationDistance = overlap * 0.5;

          // Separate balls to prevent overlap
          if (!ball1.isDragging) {
            ball1.x -= nx * separationDistance;
            ball1.y -= ny * separationDistance;
          }
          if (!ball2.isDragging) {
            ball2.x += nx * separationDistance;
            ball2.y += ny * separationDistance;
          }

          // Realistic collision response
          const relativeVelX = ball2.vx - ball1.vx;
          const relativeVelY = ball2.vy - ball1.vy;
          const relativeVelNormal = relativeVelX * nx + relativeVelY * ny;

          // Only resolve if balls are moving towards each other
          if (relativeVelNormal < 0) {
            const restitution = BOUNCE * 0.8; // Slightly reduced for realism
            const impulse = -(1 + restitution) * relativeVelNormal / 2;

            if (!ball1.isDragging) {
              ball1.vx -= impulse * nx;
              ball1.vy -= impulse * ny;
            }
            if (!ball2.isDragging) {
              ball2.vx += impulse * nx;
              ball2.vy += impulse * ny;
            }
          }

          // Ensure balls stay within bounds
          ball1.x = Math.max(0, Math.min(ball1.x, containerWidth - BALL_SIZE));
          ball1.y = Math.max(0, Math.min(ball1.y, containerHeight - BALL_SIZE - 25));
          ball2.x = Math.max(0, Math.min(ball2.x, containerWidth - BALL_SIZE));
          ball2.y = Math.max(0, Math.min(ball2.y, containerHeight - BALL_SIZE - 25));

          // Update spring positions after collision
          if (ball1.api) {
            ball1.api.start({
              x: ball1.x,
              y: ball1.y,
              config: { tension: 250, friction: 25 }
            });
          }
          if (ball2.api) {
            ball2.api.start({
              x: ball2.x,
              y: ball2.y,
              config: { tension: 250, friction: 25 }
            });
          }

          ballsUpdated = true;
        }
      }
    }

    if (ballsUpdated) {
      ballsRef.current = updatedBalls;
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  // Start the animation loop only in gravity mode
  useEffect(() => {
    if (balls.length > 0 && gravityMode) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [balls.length, gravityMode]);

  // Static grid component for non-gravity mode
  const StaticTechGrid = () => {
    const webglSupported = useWebGLSupport();

    const TechItem = ({ technology }: { technology: Technology }) => {
      const TechFallback = () => {
        const [imageError, setImageError] = useState(false);

        return (
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center border border-purple-400/40 shadow-lg">
            {technology?.icon && !imageError ? (
              <img
                src={technology.icon}
                alt={technology.name}
                className="w-16 h-16 object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-2xl">⚡</div>
            )}
          </div>
        );
      };

      return (
        <div className='w-28 h-28 flex flex-col items-center' key={technology.name}>
          {webglSupported ? (
            <MobileCompatibilityWrapper
              componentName={`BallCanvas-${technology.name}`}
              fallback={<TechFallback />}
            >
              <BallCanvas icon={technology.icon || ''} enableRotation={true} />
            </MobileCompatibilityWrapper>
          ) : (
            <TechFallback />
          )}
          <p className="text-center text-xs mt-2 text-white/80 font-medium">{technology.name}</p>
        </div>
      );
    };

    return (
      <div className="flex flex-row flex-wrap justify-center gap-10">
        {technologies.map((technology: Technology) => (
          <TechItem key={technology.name} technology={technology} />
        ))}
      </div>
    );
  };

  // Toggle button component
  const GravityToggle = () => (
    <div className="flex justify-center mb-6">
      <button
        onClick={() => setGravityMode(!gravityMode)}
        className={`
          relative inline-flex items-center px-6 py-3 rounded-full transition-all duration-300 ease-in-out
          ${gravityMode
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }
          border border-cyan-400/30 hover:border-cyan-400/50
        `}
      >
        <span className="mr-2 text-sm font-medium">
          {gravityMode ? '🎮' : '📱'}
        </span>
        <span className="font-semibold">
          {'Gravity Mode'}
        </span>
        <div className={`
          ml-3 w-12 h-6 rounded-full transition-all duration-300 ease-in-out
          ${gravityMode ? 'bg-white/20' : 'bg-gray-600'}
          relative
        `}>
          <div className={`
            absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ease-in-out
            ${gravityMode ? 'translate-x-6' : 'translate-x-0.5'}
          `} />
        </div>
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div id="skills" className="flex justify-center items-center min-h-[200px]">
        <SimpleLoader />
      </div>
    );
  }

  if (error) {
    console.error("Error loading technologies:", error);
    return (
      <div id="skills" className="flex justify-center items-center min-h-[200px]">
        <p className="text-red-400">Failed to load technologies</p>
      </div>
    );
  }

  if (!technologies || technologies.length === 0) {
    return (
      <div id="skills" className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-400">No technologies found</p>
      </div>
    );
  }

  return (
    <div id="skills">
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center mb-6`}>Skills</p>
      </motion.div>

      {/* Toggle Button */}
      <GravityToggle />

      {/* Conditional Rendering Based on Mode */}
      {gravityMode ? (
        <div
          ref={containerRef}
          className="relative w-full border-2 border-cyan-400/30 rounded-xl overflow-hidden bg-gradient-to-b from-slate-900/30 to-slate-800/50 backdrop-blur-sm shadow-2xl"
          style={{ height: "650px", maxWidth: "900px", margin: "0 auto", paddingBottom: 30 }}
        >
          {balls.map((ball, index) => {
            const technology = technologies[index];
            if (!technology) return null;

            return (
              <BouncyBall
                key={ball.id}
                technology={technology}
                ball={ball}
                index={index}
                showLabel={false} // Hide labels in gravity mode
              />
            );
          })}
        </div>
      ) : (
        <StaticTechGrid />
      )}
    </div>
  );
};

export default SectionWrapper(Tech, "");