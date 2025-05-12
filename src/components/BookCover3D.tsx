import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface BookCover3DProps {
  coverImage: string;
  title: string;
  isQuran?: boolean;
  className?: string;
}

const BookCover3D: React.FC<BookCover3DProps> = ({
  coverImage,
  title,
  isQuran = false,
  className = ''
}) => {
  const { theme } = useTheme();
  const bookRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Adjust 3D effect based on screen size
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse position values with spring physics for smooth animation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const rotateXSpring = useSpring(mouseY, springConfig);
  const rotateYSpring = useSpring(mouseX, springConfig);

  // Transform mouse position to rotation values - responsive
  const rotateXOutput = useTransform(
    rotateXSpring,
    [-1, 1],
    isMobile ? [5, -5] : isTablet ? [8, -8] : [10, -10]
  );
  const rotateYOutput = useTransform(
    rotateYSpring,
    [-1, 1],
    isMobile ? [-8, 8] : isTablet ? [-12, 12] : [-15, 15]
  );

  // Handle mouse move to update rotation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !bookRef.current) return;

    const rect = bookRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate normalized position (-1 to 1)
    const mouseXNorm = (e.clientX - centerX) / (rect.width / 2);
    const mouseYNorm = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(mouseXNorm);
    mouseY.set(mouseYNorm);
  };

  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Set colors based on theme and book type
  const spineColor = theme === 'light'
    ? (isQuran ? '#e7d9b4' : '#e0e0e0')
    : (isQuran ? '#49ab81' : '#2a2a2a');

  const pageColor = theme === 'light'
    ? '#f5f5f5'
    : '#1a1a1a';

  const shadowColor = theme === 'light'
    ? 'rgba(0, 0, 0, 0.3)'
    : 'rgba(0, 0, 0, 0.5)';

  const glowColor = theme === 'light'
    ? (isQuran ? 'rgba(231, 217, 180, 0.5)' : 'rgba(224, 224, 224, 0.5)')
    : (isQuran ? 'rgba(73, 171, 129, 0.3)' : 'rgba(42, 42, 42, 0.3)');

  return (
    <div
      className={`relative ${className}`}
      ref={bookRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          perspective: 1200,
          transformStyle: 'preserve-3d',
          rotateX: isMobile ? 5 : rotateXOutput,
          rotateY: isMobile ? -10 : rotateYOutput,
          transformOrigin: 'center center'
        }}
      >
        {/* Book container */}
        <div className="relative w-full h-full">
          {/* Book spine - responsive width */}
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: isMobile ? '15px' : isTablet ? '25px' : '30px',
              backgroundColor: spineColor,
              transform: isMobile
                ? 'rotateY(90deg) translateX(-7.5px) translateZ(-3px)'
                : isTablet
                  ? 'rotateY(90deg) translateX(-12.5px) translateZ(-4px)'
                  : 'rotateY(90deg) translateX(-15px) translateZ(-5px)',
              transformOrigin: 'left center',
              boxShadow: 'inset -5px 0 10px rgba(0, 0, 0, 0.2)',
              borderRadius: '2px 0 0 2px'
            }}
          >
            {/* Spine texture */}
            <div className="h-full w-full overflow-hidden">
              <div className="h-full w-full opacity-10"
                style={{
                  backgroundImage: `url(${coverImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(8px)'
                }}
              />
            </div>

            {/* Spine decoration */}
            <div className="absolute top-[10%] left-0 w-full h-[1px] bg-white/20"></div>
            <div className="absolute bottom-[10%] left-0 w-full h-[1px] bg-white/20"></div>
          </div>

          {/* Book pages - right side - responsive width */}
          <div
            className="absolute top-[5px] right-0 bottom-[5px]"
            style={{
              width: isMobile ? '10px' : isTablet ? '15px' : '20px',
              backgroundColor: pageColor,
              transform: isMobile
                ? 'translateX(5px) rotateY(90deg)'
                : isTablet
                  ? 'translateX(7.5px) rotateY(90deg)'
                  : 'translateX(10px) rotateY(90deg)',
              boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Page lines for detail */}
            <div className="h-full flex flex-col justify-between py-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-[1px]"
                  style={{
                    backgroundColor: theme === 'light' ? '#e0e0e0' : '#2a2a2a',
                    opacity: 0.5
                  }}
                />
              ))}
            </div>
          </div>

          {/* Book cover */}
          <motion.div
            className="relative w-full h-full rounded-sm overflow-hidden"
            animate={{
              boxShadow: isHovered
                ? `0 20px 25px -5px ${shadowColor}, 0 8px 10px -6px ${shadowColor}, 0 0 20px ${glowColor}`
                : `0 10px 15px -3px ${shadowColor}, 0 4px 6px -4px ${shadowColor}`
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Cover image */}
            <motion.img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.05 : 1
              }}
              transition={{ duration: 0.5 }}
              loading="eager"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/400x600?text=Book+Cover';
              }}
            />

            {/* Lighting effect overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: isHovered
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%)'
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Emboss effect for cover */}
            <div className="absolute inset-0 box-border border-[1px] border-white/10 pointer-events-none"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Shadow beneath the book */}
      <motion.div
        className="absolute -bottom-8 left-[10%] right-[10%] h-[20px] rounded-full blur-md"
        style={{
          background: `radial-gradient(ellipse at center, ${shadowColor} 0%, transparent 80%)`
        }}
        animate={{
          opacity: isHovered ? 0.7 : 0.4,
          scaleX: isHovered ? 0.9 : 0.8
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default BookCover3D;
