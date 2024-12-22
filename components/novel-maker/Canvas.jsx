'use client';

import React, { forwardRef, useEffect, useRef, useState, useCallback, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { create } from 'zustand';

// State management for canvas settings
const useCanvasStore = create((set) => ({
  zoom: 100,
  grid: { show: false, size: 20 },
  isPlaying: false,
  isPreviewMode: false,
  setZoom: (zoom) => set({ zoom }),
  setGrid: (grid) => set({ grid }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsPreviewMode: (isPreviewMode) => set({ isPreviewMode }),
}));

// Custom hook for handling animations and transitions
const useAnimationControl = () => {
  const [animation, setAnimation] = useState({
    background: { scale: 1, opacity: 1 },
    character: { scale: 1, opacity: 1 },
    dialogue: { opacity: 1 }
  });

  const animate = useCallback((type, props) => {
    setAnimation(prev => ({
      ...prev,
      [type]: { ...prev[type], ...props }
    }));
  }, []);

  return { animation, animate };
};

// Custom hook for handling asset transformations
const useAssetTransform = (initialProps) => {
  const [transform, setTransform] = useState(initialProps);

  const updateTransform = useCallback((updates) => {
    setTransform(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  return [transform, updateTransform];
};

const Canvas = forwardRef(({ 
  scene,
  onSceneUpdate,
  onAssetSelect,
}, ref) => {
  const canvasRef = useRef(null);
  const { zoom, grid, isPlaying, isPreviewMode } = useCanvasStore();
  const { animation, animate } = useAnimationControl();
  
  const [dimensions, setDimensions] = useState({ width: 1280, height: 720 });
  const [activeAsset, setActiveAsset] = useState(null);
  
  // Initialize transform states for background and character
  const [backgroundTransform, updateBackgroundTransform] = useAssetTransform(scene?.backgroundProps || {});
  const [characterTransform, updateCharacterTransform] = useAssetTransform(scene?.characterProps || {});

  // Expose canvas methods to parent components
  useImperativeHandle(ref, () => ({
    captureScreenshot: () => {
      // Implementation for capturing canvas state as image
      const canvas = canvasRef.current;
      return canvas.toDataURL('image/png');
    },
    resetView: () => {
      updateBackgroundTransform({ posX: 0, posY: 0, scale: 1, rotation: 0 });
      updateCharacterTransform({ posX: 0, posY: 0, scale: 1, rotation: 0 });
    }
  }));

  // Handle window resize with debounce
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (canvasRef.current) {
          const container = canvasRef.current.parentElement;
          const aspectRatio = 16 / 9;
          const newWidth = Math.min(container.clientWidth, container.clientHeight * aspectRatio);
          const newHeight = newWidth / aspectRatio;
          setDimensions({ width: newWidth, height: newHeight });
        }
      }, 150);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Gesture handling for asset manipulation
  const bindGesture = useGesture({
    onDrag: ({ movement: [mx, my], first, last, target }) => {
      if (isPreviewMode) return;
      
      const assetType = target.getAttribute('data-asset-type');
      if (!assetType) return;

      if (first) {
        setActiveAsset(assetType);
        animate(assetType, { scale: 1.02 });
      }

      const updateFn = assetType === 'background' ? updateBackgroundTransform : updateCharacterTransform;
      updateFn({ 
        posX: mx, 
        posY: my 
      });

      if (last) {
        setActiveAsset(null);
        animate(assetType, { scale: 1 });
        onSceneUpdate({
          ...scene,
          [`${assetType}Props`]: {
            ...scene[`${assetType}Props`],
            posX: mx,
            posY: my
          }
        });
      }
    },
    onPinch: ({ offset: [scale], first, last, target }) => {
      if (isPreviewMode) return;
      
      const assetType = target.getAttribute('data-asset-type');
      if (!assetType) return;

      const updateFn = assetType === 'background' ? updateBackgroundTransform : updateCharacterTransform;
      updateFn({ scale });

      if (last) {
        onSceneUpdate({
          ...scene,
          [`${assetType}Props`]: {
            ...scene[`${assetType}Props`],
            scale
          }
        });
      }
    }
  });

  // Render grid system
  const renderGrid = useCallback(() => {
    if (!grid.show) return null;
    
    const gridLines = [];
    const { width, height } = dimensions;
    const size = grid.size * (zoom / 100);
    
    for (let x = 0; x <= width; x += size) {
      gridLines.push(
        <line
          key={`vertical-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      );
    }
    
    for (let y = 0; y <= height; y += size) {
      gridLines.push(
        <line
          key={`horizontal-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      );
    }
    
    return (
      <svg className="fixed inset-0 pointer-events-none" width="100%" height="100%">
        {gridLines}
      </svg>
    );
  }, [grid, zoom, dimensions]);

  // Enhanced dialogue system with animations
  const renderDialogue = useCallback(() => {
    if (!scene?.dialogue && !scene?.characterName) return null;

    const textProps = scene.textProps || {};
    const dialogueStyle = {
      fontSize: `${textProps.fontSize || 16}px`,
      color: textProps.color || '#FFFFFF',
      opacity: animation.dialogue.opacity * (textProps.opacity || 1)
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: dialogueStyle.opacity,
          y: 0,
          transition: { duration: 0.3 }
        }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-8 w-full mx-auto transform -translate-x-1/2 w-[80%] bg-black/80 rounded-lg p-6 backdrop-blur-sm z-30"
        style={{
          maxWidth: (textProps.frameSize || 800) * (zoom / 100),
        }}
      >
        {scene.characterName && (
          <motion.div 
            className="text-white font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontSize: `${(textProps.fontSize || 16) * 1.2}px` }}
          >
            {scene.characterName}
          </motion.div>
        )}
        <motion.div 
          className="text-white"
          style={dialogueStyle}
        >
          {isPlaying ? (
            <TypewriterEffect 
              text={scene.dialogue} 
              speed={50}
              onComplete={() => animate('dialogue', { opacity: 0.9 })}
            />
          ) : (
            scene.dialogue
          )}
        </motion.div>
      </motion.div>
    );
  }, [scene, isPlaying, zoom, animation.dialogue.opacity, animate]);

  // Render assets with enhanced transformations
  const renderAsset = useCallback((type) => {
    const asset = scene?.[type];
    if (!asset) return null;

    const transform = type === 'background' ? backgroundTransform : characterTransform;
    const isActive = activeAsset === type;
    
    return (
      <motion.div
        className={`absolute ${type === 'character' ? 'left-1/2 bottom-[20%]' : 'inset-0'}`}
        style={{
          transform: `translate(${transform.posX}px, ${transform.posY}px) 
                     rotate(${transform.rotation}deg)
                     scale(${transform.scale * (isActive ? animation[type].scale : 1)})`,
          opacity: transform.opacity * animation[type].opacity,
          cursor: isPreviewMode ? 'default' : 'move',
          zIndex: type === 'character' ? 2 : 1
        }}
        data-asset-type={type}
        {...bindGesture()}
        onClick={() => !isPreviewMode && onAssetSelect?.(type)}
      >
        <img 
          src={asset}
          alt={type}
          className={`${type === 'character' ? 'max-h-[80vh] object-contain' : 'w-full h-full object-cover'}`}
          style={{
            width: transform.width,
            height: transform.height,
            transform: transform.flip ? 'scaleX(-1)' : 'none'
          }}
          draggable={false}
        />
      </motion.div>
    );
  }, [scene, backgroundTransform, characterTransform, activeAsset, animation, isPreviewMode, bindGesture, onAssetSelect]);

  return (
    <div 
      ref={canvasRef}
      className="relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
      style={{
        width: dimensions.width,
        height: dimensions.height,
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'center center'
      }}
    >
      {renderGrid()}
      
      <AnimatePresence>
        {renderAsset('background')}
        {renderAsset('character')}
        {renderDialogue()}
      </AnimatePresence>
    </div>
  );
});

// Enhanced typewriter effect component
const TypewriterEffect = ({ text, speed = 50, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  return displayText;
};

Canvas.displayName = 'Canvas';

export default Canvas;