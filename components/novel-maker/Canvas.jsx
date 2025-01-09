import React, { forwardRef, useEffect, useRef, useState, useCallback, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { create } from 'zustand';
import { cn } from "@/lib/utils";

const useCanvasStore = create((set) => ({
  zoom: 100,
  grid: { show: false, size: 20 },
  isPlaying: false,
  isPreviewMode: false,
  viewportDimensions: { width: 960, height: 540 },
  activeAsset: null,
  selectedElement: null,
  
  setZoom: (zoom) => set({ zoom }),
  setGrid: (grid) => set({ grid }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsPreviewMode: (isPreviewMode) => set({ isPreviewMode }),
  setActiveAsset: (asset) => set({ activeAsset: asset }),
  setSelectedElement: (element) => set({ selectedElement: element }),
  setViewportDimensions: (dimensions) => set({ viewportDimensions: dimensions })
}));

const TypewriterText = ({ text, speed = 50, styles = {}, onComplete, setAnimations }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    setDisplayText('');
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(prev => prev + text[index]);
        setAnimations(prev => ({
          ...prev,
          dialogue: {
            isTyping: true,
            progress: (index + 1) / text.length * 100
          }
        }));
        index++;
      } else {
        clearInterval(interval);
        setAnimations(prev => ({
          ...prev,
          dialogue: { isTyping: false, progress: 100 }
        }));
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete, setAnimations]);

  return (
    <span style={styles}>
      {displayText}
    </span>
  );
};

const Canvas = forwardRef(({ 
  scene,
  onSceneUpdate,
  onAssetSelect,
  onElementSelect,
  className,
  style,
  isPreviewMode,
  isPlaying,
}, ref) => {
  const canvasRef = useRef(null);
  const dialogueRef = useRef(null);
  
  const {
    zoom,
    grid,
    viewportDimensions,
    activeAsset,
    setActiveAsset,
  } = useCanvasStore();

  const [assets, setAssets] = useState({
    background: { 
      transform: { x: 0, y: 0, scale: 1, rotation: 0 }, 
      filters: {},
      visible: true,
      flip: false
    },
    character: { 
      transform: { x: 0, y: 0, scale: 1, rotation: 0 }, 
      filters: {},
      visible: true,
      flip: false
    }
  });

  const [animations, setAnimations] = useState({
    background: { isAnimating: false, type: null, duration: 1000, delay: 0 },
    character: { isAnimating: false, type: null, duration: 1000, delay: 0 },
    dialogue: { isTyping: false, progress: 0 }
  });

  // Sync with scene data from RightPanel
  useEffect(() => {
    if (scene) {
      setAssets({
        background: {
          transform: {
            x: scene.backgroundProps?.x || 0,
            y: scene.backgroundProps?.y || 0,
            scale: scene.backgroundProps?.scale || 1,
            rotation: scene.backgroundProps?.rotation || 0
          },
          filters: scene.backgroundFilters || {},
          visible: scene.backgroundProps?.visible ?? true,
          flip: scene.backgroundProps?.flip || false,
          opacity: scene.backgroundProps?.opacity || 1
        },
        character: {
          transform: {
            x: scene.characterProps?.x || 0,
            y: scene.characterProps?.y || 0,
            scale: scene.characterProps?.scale || 1,
            rotation: scene.characterProps?.rotation || 0
          },
          filters: scene.characterFilters || {},
          visible: scene.characterProps?.visible ?? true,
          flip: scene.characterProps?.flip || false,
          opacity: scene.characterProps?.opacity || 1
        }
      });
    }
  }, [scene]);

  const getFilterString = useCallback((filters) => {
    return Object.entries(filters)
      .map(([key, value]) => {
        switch (key) {
          case 'brightness':
          case 'contrast':
          case 'saturation':
            return `${key}(${value}%)`;
          case 'blur':
            return `${key}(${value}px)`;
          case 'sepia':
          case 'grayscale':
            return `${key}(${value}%)`;
          default:
            return '';
        }
      })
      .filter(Boolean)
      .join(' ');
  }, []);

  const handleAssetTransform = useCallback((assetType, transform) => {
    setAssets(prev => ({
      ...prev,
      [assetType]: {
        ...prev[assetType],
        transform: {
          ...prev[assetType].transform,
          ...transform
        }
      }
    }));

    onSceneUpdate({
      ...scene,
      [`${assetType}Props`]: {
        ...scene[`${assetType}Props`],
        ...transform
      }
    });
  }, [scene, onSceneUpdate]);

  const bindGestures = useGesture({
    onDrag: ({ movement: [mx, my], first, last, target }) => {
      if (isPreviewMode) return;
      
      const assetType = target.getAttribute('data-asset-type');
      if (!assetType) return;

      if (first) {
        setActiveAsset(assetType);
        onAssetSelect?.(assetType);
      }

      handleAssetTransform(assetType, {
        x: assets[assetType].transform.x + mx,
        y: assets[assetType].transform.y + my
      });
    }
  });

  const renderDialogue = useCallback(() => {
    if (!scene?.dialogue && !scene?.characterName) return null;

    const textStyles = {
      fontWeight: scene.textStyles?.bold ? 'bold' : 'normal',
      fontStyle: scene.textStyles?.italic ? 'italic' : 'normal',
      textDecoration: scene.textStyles?.underline ? 'underline' : 'none',
      fontSize: `${scene.textStyles?.fontSize || 16}px`,
      color: scene.textStyles?.color || '#ffffff',
      textAlign: scene.textStyles?.alignment || 'left'
    };

    return (
      <motion.div
        ref={dialogueRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-0 left-0 right-0 mx-auto max-w-screen p-6 rounded-t-lg backdrop-blur-sm z-30 bg-black/80"
        onClick={() => onElementSelect?.('dialogue')}
      >
        {scene.characterName && (
          <motion.div 
            className="font-bold mb-2 text-xl text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {scene.characterName}
          </motion.div>
        )}
        
        <motion.div className="text-lg leading-relaxed">
          {isPlaying ? (
            <TypewriterText 
              text={scene.dialogue}
              speed={scene.typewriterSpeed || 50}
              styles={textStyles}
              onComplete={() => {
                setAnimations(prev => ({
                  ...prev,
                  dialogue: { isTyping: false, progress: 100 }
                }));
              }}
              setAnimations={setAnimations}
            />
          ) : (
            <span style={textStyles}>{scene.dialogue}</span>
          )}
        </motion.div>
      </motion.div>
    );
  }, [scene, isPlaying, onElementSelect]);

  const renderAsset = useCallback((type) => {
    const asset = scene?.[type];
    if (!asset || !assets[type].visible) return null;

    const { transform, filters, opacity, flip } = assets[type];
    const animation = animations[type];

    const variants = {
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      },
      slide: {
        initial: { x: type === 'character' ? -100 : 0, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: type === 'character' ? 100 : 0, opacity: 0 }
      },
      zoom: {
        initial: { scale: 0.5, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.5, opacity: 0 }
      }
    };

    return (
      <motion.div
        className={cn(
          "absolute",
          type === 'character' ? 'left-1/2 bottom-[0%]' : 'inset-0',
          !isPreviewMode && 'cursor-move'
        )}
        style={{
          transform: `
            translate(${transform.x}px, ${transform.y}px)
            rotate(${transform.rotation}deg)
            scale(${transform.scale})
          `,
          filter: getFilterString(filters),
          opacity,
          zIndex: type === 'character' ? 2 : 1
        }}
        data-asset-type={type}
        {...bindGestures()}
        onClick={() => {
          if (!isPreviewMode) {
            onAssetSelect?.(type);
            onElementSelect?.(type);
          }
        }}
        variants={variants[animation.type]}
        initial={animation.isAnimating ? 'initial' : false}
        animate={animation.isAnimating ? 'animate' : false}
        exit={animation.isAnimating ? 'exit' : false}
        transition={{
          duration: animation.duration / 1000,
          delay: animation.delay / 1000
        }}
      >
        <img 
          src={asset}
          alt={type}
          className={cn(
            type === 'character' ? 'max-h-[30vh] object-contain' : 'w-full h-full object-cover',
            flip && 'scale-x-[-1]'
          )}
          draggable={false}
        />
      </motion.div>
    );
  }, [scene, assets, animations, isPreviewMode, bindGestures, onAssetSelect, onElementSelect, getFilterString]);

  useImperativeHandle(ref, () => ({
    updateAsset: (type, props) => {
      setAssets(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          ...props
        }
      }));
    },
    playAnimation: (type, params) => {
      setAnimations(prev => ({
        ...prev,
        [type]: { 
          isAnimating: true, 
          type: params.type,
          duration: params.duration,
          delay: params.delay
        }
      }));

      setTimeout(() => {
        setAnimations(prev => ({
          ...prev,
          [type]: { 
            isAnimating: false, 
            type: null,
            duration: 1000,
            delay: 0
          }
        }));
      }, (params.duration + params.delay));
    }
  }));

  return (
    <div 
      ref={canvasRef}
      className={cn(
        "relative overflow-hidden shadow-2xl",
        isPreviewMode ? "bg-black" : "bg-gray-900",
        className
      )}
      style={{
        width: viewportDimensions.width,
        height: viewportDimensions.height,
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'center center',
        ...style
      }}
    >
      {grid.show && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,.1) 1px, transparent 1px)
            `,
            backgroundSize: `${grid.size}px ${grid.size}px`
          }}
        />
      )}
      
      <AnimatePresence mode="wait">
        {renderAsset('background')}
        {renderAsset('character')}
        {renderDialogue()}
      </AnimatePresence>
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;