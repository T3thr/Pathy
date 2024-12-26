import React, { forwardRef, useEffect, useRef, useState, useCallback, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { create } from 'zustand';
import { cn } from "@/lib/utils";

// Enhanced canvas store with better state management
const useCanvasStore = create((set) => ({
  zoom: 100,
  grid: { show: false, size: 20 },
  isPlaying: false,
  isPreviewMode: false,
  viewportDimensions: { width: 1280, height: 720 },
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

  // Asset state management
  const [assets, setAssets] = useState({
    background: { 
      transform: { x: 0, y: 0, scale: 1, rotation: 0 }, 
      filters: {},
      visible: true
    },
    character: { 
      transform: { x: 0, y: 0, scale: 1, rotation: 0 }, 
      filters: {},
      visible: true
    }
  });

  // Animation states
  const [animations, setAnimations] = useState({
    background: { isAnimating: false, type: null },
    character: { isAnimating: false, type: null },
    dialogue: { isTyping: false, progress: 0 }
  });

  // Initialize scene assets
  useEffect(() => {
    if (scene) {
      setAssets({
        background: {
          transform: scene.backgroundProps || { x: 0, y: 0, scale: 1, rotation: 0 },
          filters: scene.backgroundFilters || {},
          visible: scene.backgroundProps?.visible ?? true
        },
        character: {
          transform: scene.characterProps || { x: 0, y: 0, scale: 1, rotation: 0 },
          filters: scene.characterFilters || {},
          visible: scene.characterProps?.visible ?? true
        }
      });
    }
  }, [scene]);

  // Enhanced gesture handling
  const bindGestures = useGesture({
    onDrag: ({ movement: [mx, my], first, last, dragging, target }) => {
      if (isPreviewMode) return;
      
      const assetType = target.getAttribute('data-asset-type');
      if (!assetType) return;

      if (first) {
        setActiveAsset(assetType);
        onAssetSelect?.(assetType);
      }

      const updatedTransform = {
        ...assets[assetType].transform,
        x: assets[assetType].transform.x + mx,
        y: assets[assetType].transform.y + my
      };

      setAssets(prev => ({
        ...prev,
        [assetType]: {
          ...prev[assetType],
          transform: updatedTransform
        }
      }));

      if (last) {
        onSceneUpdate({
          ...scene,
          [`${assetType}Props`]: {
            ...scene[`${assetType}Props`],
            ...updatedTransform
          }
        });
      }
    },

    onPinch: ({ offset: [scale], first, last, target }) => {
      if (isPreviewMode) return;
      
      const assetType = target.getAttribute('data-asset-type');
      if (!assetType) return;

      const updatedTransform = {
        ...assets[assetType].transform,
        scale
      };

      setAssets(prev => ({
        ...prev,
        [assetType]: {
          ...prev[assetType],
          transform: updatedTransform
        }
      }));

      if (last) {
        onSceneUpdate({
          ...scene,
          [`${assetType}Props`]: {
            ...scene[`${assetType}Props`],
            ...updatedTransform
          }
        });
      }
    }
  });

  // Enhanced typewriter effect
  const TypewriterText = useCallback(({ text, speed = 50, onComplete }) => {
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
    }, [text, speed, onComplete]);

    return displayText;
  }, []);

  // Render dialogue box
  const renderDialogue = useCallback(() => {
    if (!scene?.dialogue && !scene?.characterName) return null;

    const dialogueStyle = {
      background: scene.dialogueStyle?.background || 'rgba(0, 0, 0, 0.8)',
      textAlign: scene.textProps?.alignment || 'left',
      fontSize: scene.textProps?.size || '1rem'
    };

    return (
      <motion.div
        ref={dialogueRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={cn(
          "absolute bottom-0 left-0 right-0",
          "mx-auto max-w-4xl p-6 rounded-t-lg",
          "backdrop-blur-sm z-30"
        )}
        style={dialogueStyle}
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
        
        <motion.div 
          className="text-lg leading-relaxed text-white"
          style={{
            fontWeight: scene.textProps?.bold ? 'bold' : 'normal',
            fontStyle: scene.textProps?.italic ? 'italic' : 'normal',
            textDecoration: scene.textProps?.underline ? 'underline' : 'none'
          }}
        >
          {isPlaying ? (
            <TypewriterText 
              text={scene.dialogue}
              speed={scene.textProps?.typewriterSpeed || 50}
              onComplete={() => {
                setAnimations(prev => ({
                  ...prev,
                  dialogue: { isTyping: false, progress: 100 }
                }));
              }}
            />
          ) : (
            scene.dialogue
          )}
        </motion.div>
      </motion.div>
    );
  }, [scene, isPlaying, TypewriterText, onElementSelect]);

  // Render asset with transformations
  const renderAsset = useCallback((type) => {
    const asset = scene?.[type];
    if (!asset || !assets[type].visible) return null;

    const { transform, filters } = assets[type];
    const animation = animations[type];

    const filterString = Object.entries(filters)
      .map(([key, value]) => {
        switch (key) {
          case 'brightness':
          case 'contrast':
          case 'saturate':
            return `${key}(${value}%)`;
          case 'blur':
            return `${key}(${value}px)`;
          default:
            return '';
        }
      })
      .filter(Boolean)
      .join(' ');

    return (
      <motion.div
        className={cn(
          "absolute",
          type === 'character' ? 'left-1/2 bottom-[20%]' : 'inset-0',
          !isPreviewMode && 'cursor-move'
        )}
        style={{
          transform: `
            translate(${transform.x}px, ${transform.y}px)
            rotate(${transform.rotation}deg)
            scale(${transform.scale})
          `,
          filter: filterString || 'none',
          zIndex: type === 'character' ? 2 : 1,
          opacity: scene[`${type}Props`]?.opacity ?? 1
        }}
        data-asset-type={type}
        {...bindGestures()}
        onClick={() => {
          if (!isPreviewMode) {
            onAssetSelect?.(type);
            onElementSelect?.(type);
          }
        }}
        initial={animation.isAnimating ? { opacity: 0, scale: 0.9 } : false}
        animate={animation.isAnimating ? { opacity: 1, scale: 1 } : false}
      >
        <img 
          src={asset}
          alt={type}
          className={cn(
            type === 'character' ? 'max-h-[80vh] object-contain' : 'w-full h-full object-cover',
            scene[`${type}Props`]?.flip && 'scale-x-[-1]'
          )}
          draggable={false}
        />
      </motion.div>
    );
  }, [scene, assets, animations, isPreviewMode, bindGestures, onAssetSelect, onElementSelect]);

  // Expose canvas methods to parent
  useImperativeHandle(ref, () => ({
    captureScreenshot: async () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      // Implementation for canvas capture
      const dataUrl = await html2canvas(canvas).then(canvas => canvas.toDataURL('image/png'));
      return dataUrl;
    },
    resetView: () => {
      setAssets({
        background: { 
          transform: { x: 0, y: 0, scale: 1, rotation: 0 }, 
          filters: {},
          visible: true
        },
        character: { 
          transform: { x: 0, y: 0, scale: 1, rotation: 0 }, 
          filters: {},
          visible: true
        }
      });
    },
    playAnimation: (type, params) => {
      setAnimations(prev => ({
        ...prev,
        [type]: { isAnimating: true, type: params?.type }
      }));

      setTimeout(() => {
        setAnimations(prev => ({
          ...prev,
          [type]: { isAnimating: false, type: null }
        }));
      }, params?.duration || 1000);
    },
    updateAsset: (type, props) => {
      setAssets(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          ...props
        }
      }));
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