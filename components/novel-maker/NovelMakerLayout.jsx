import { useState, useEffect, useCallback, useRef } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { useHotkeys } from 'react-hotkeys-hook';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Maximize2, Minimize2, PanelLeftClose, 
  PanelRightClose, Menu, X, Settings
} from 'lucide-react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import Canvas from './Canvas';
import TopToolbar from './TopToolbar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

// Enhanced project store with persistence
const useProjectStore = create(
  persist(
    (set, get) => ({
      currentScene: 0,
      scenes: [{
        id: 0,
        name: 'Opening Scene',
        background: null,
        character: null,
        dialogue: '',
        characterName: '',
        backgroundProps: {
          posX: 0,
          posY: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          visible: true,
          flip: false,
          filters: {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0
          },
          transitions: {
            enter: 'fade',
            exit: 'fade',
            duration: 500
          }
        },
        characterProps: {
          posX: 0,
          posY: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          visible: true,
          flip: false,
          filters: {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0
          },
          transitions: {
            enter: 'slide',
            exit: 'fade',
            duration: 300
          }
        },
        textProps: {
          size: 'lg',
          alignment: 'left',
          color: 'white',
          shadow: true,
          bold: false,
          italic: false,
          typewriterSpeed: 50
        },
        audio: {
          bgm: null,
          sfx: null,
          volume: 1,
          fadeIn: 1000,
          fadeOut: 500
        }
      }],
      
      setCurrentScene: (sceneId) => set({ currentScene: sceneId }),
      
      updateScene: (sceneId, updates) => set((state) => ({
        scenes: state.scenes.map(scene => 
          scene.id === sceneId ? { ...scene, ...updates } : scene
        )
      })),
      
      addScene: () => set((state) => {
        const newScene = {
          ...state.scenes[0],
          id: state.scenes.length,
          name: `Scene ${state.scenes.length + 1}`,
          background: null,
          character: null,
          dialogue: '',
          characterName: ''
        };
        return {
          scenes: [...state.scenes, newScene],
          currentScene: state.scenes.length
        };
      }),
      
      duplicateScene: (sceneId) => set((state) => {
        const sceneToDuplicate = state.scenes.find(scene => scene.id === sceneId);
        if (!sceneToDuplicate) return state;
        
        const newScene = {
          ...sceneToDuplicate,
          id: state.scenes.length,
          name: `${sceneToDuplicate.name} (Copy)`
        };
        
        return {
          scenes: [...state.scenes, newScene],
          currentScene: state.scenes.length
        };
      }),
      
      deleteScene: (sceneId) => set((state) => {
        if (state.scenes.length <= 1) {
          toast.error("Cannot delete the last scene");
          return state;
        }
        
        const newScenes = state.scenes.filter(scene => scene.id !== sceneId);
        const newCurrentScene = state.currentScene >= newScenes.length ? 
          newScenes.length - 1 : state.currentScene;
        
        return {
          scenes: newScenes,
          currentScene: newCurrentScene
        };
      }),

      // Asset Management
      updateAsset: (sceneId, assetType, assetData) => set((state) => ({
        scenes: state.scenes.map(scene => 
          scene.id === sceneId 
            ? { ...scene, [assetType]: assetData }
            : scene
        )
      })),
      
      updateAssetProps: (sceneId, assetType, props) => set((state) => ({
        scenes: state.scenes.map(scene => 
          scene.id === sceneId 
            ? { 
                ...scene, 
                [`${assetType}Props`]: { 
                  ...scene[`${assetType}Props`], 
                  ...props 
                }
              }
            : scene
        )
      }))
    }),
    {
      name: 'novel-maker-storage',
      version: 1,
    }
  )
);

// Canvas state store
const useCanvasStore = create((set) => ({
  zoom: 100,
  isPlaying: false,
  isPreviewMode: false,
  showGrid: false,
  selectedAsset: null,
  
  setZoom: (zoom) => set({ zoom }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsPreviewMode: (isPreviewMode) => set({ isPreviewMode }),
  setShowGrid: (showGrid) => set({ showGrid }),
  setSelectedAsset: (asset) => set({ selectedAsset: asset })
}));

// History management hook
const useHistory = (initialState) => {
  const [history, setHistory] = useState({
    past: [],
    present: initialState,
    future: []
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const push = useCallback((newState) => {
    setHistory(curr => ({
      past: [...curr.past, curr.present],
      present: newState,
      future: []
    }));
  }, []);

  const undo = useCallback(() => {
    setHistory(curr => {
      if (!curr.past.length) return curr;
      const previous = curr.past[curr.past.length - 1];
      const newPast = curr.past.slice(0, curr.past.length - 1);
      
      return {
        past: newPast,
        present: previous,
        future: [curr.present, ...curr.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(curr => {
      if (!curr.future.length) return curr;
      const next = curr.future[0];
      const newFuture = curr.future.slice(1);
      
      return {
        past: [...curr.past, curr.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  return { history, push, undo, redo, canUndo, canRedo };
};

export default function NovelMakerLayout() {
     // Responsive Layout State
     const [layoutMode, setLayoutMode] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
     const [activePanel, setActivePanel] = useState('canvas'); // 'left', 'canvas', 'right'
   
     // Handle Responsive Layout
     useEffect(() => {
       const handleResize = () => {
         if (window.innerWidth >= 1280) {
           setLayoutMode('desktop');
         } else if (window.innerWidth >= 768) {
           setLayoutMode('tablet');
         } else {
           setLayoutMode('mobile');
         }
       };
   
       window.addEventListener('resize', handleResize);
       handleResize();
   
       return () => window.removeEventListener('resize', handleResize);
     }, []);
  // Refs
  const canvasRef = useRef(null);
  
  // Project State
  const { 
    currentScene, 
    scenes, 
    setCurrentScene, 
    updateScene, 
    addScene, 
    deleteScene, 
    duplicateScene,
    updateAsset,
    updateAssetProps
  } = useProjectStore();

  // Canvas State
  const {
    zoom,
    isPlaying,
    isPreviewMode,
    showGrid,
    selectedAsset,
    setZoom,
    setIsPlaying,
    setIsPreviewMode,
    setShowGrid,
    setSelectedAsset
  } = useCanvasStore();

  // UI State
  const [uiState, setUiState] = useState({
    showLeftPanel: true,
    showRightPanel: true,
    uploadProgress: 0,
    showUploadDialog: false,
    showExportDialog: false,
    isDraggingAsset: false
  });

  // History Management
  const { 
    history, 
    push: pushHistory, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useHistory(scenes);

  // Hotkeys
  useHotkeys('mod+z', (e) => {
    e.preventDefault();
    if (canUndo) undo();
  }, [canUndo]);

  useHotkeys('mod+shift+z', (e) => {
    e.preventDefault();
    if (canRedo) redo();
  }, [canRedo]);

  useHotkeys('space', (e) => {
    e.preventDefault();
    setIsPlaying(prev => !prev);
  }, []);

  // Asset Upload Handler
  const handleAssetUpload = useCallback(async (file, category) => {
    try {
      setUiState(prev => ({ ...prev, showUploadDialog: true }));
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUiState(prev => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 10, 100)
        }));
      }, 100);

      // You would implement actual file upload here
      const fileUrl = URL.createObjectURL(file);
      
      if (category === 'backgrounds') {
        await updateAsset(currentScene, 'background', fileUrl);
      } else if (category === 'characters') {
        await updateAsset(currentScene, 'character', fileUrl);
      }
      
      clearInterval(interval);
      setUiState(prev => ({ 
        ...prev, 
        showUploadDialog: false, 
        uploadProgress: 0 
      }));
      
      pushHistory(scenes);
      toast.success(`${category} uploaded successfully`);
    } catch (error) {
      console.error('Error uploading asset:', error);
      toast.error(`Failed to upload ${category}`);
      setUiState(prev => ({ 
        ...prev, 
        showUploadDialog: false, 
        uploadProgress: 0 
      }));
    }
  }, [currentScene, scenes, updateAsset, pushHistory]);

  // Scene Update Handler
  const handleSceneUpdate = useCallback((updates) => {
    updateScene(currentScene, updates);
    pushHistory(scenes);
  }, [currentScene, scenes, updateScene, pushHistory]);

  // Asset Transform Handler
  const handleAssetTransform = useCallback((assetType, transforms) => {
    updateAssetProps(currentScene, assetType, transforms);
    pushHistory(scenes);
  }, [currentScene, updateAssetProps, pushHistory]);

  // Export Project
  const handleExport = useCallback(async () => {
    try {
      const projectData = {
        version: '1.0.0',
        scenes,
        metadata: {
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
      };

      const blob = new Blob([JSON.stringify(projectData)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'visual-novel-project.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Project exported successfully');
    } catch (error) {
      console.error('Error exporting project:', error);
      toast.error('Failed to export project');
    }
  }, [scenes]);


 
   return (
     <div className="flex flex-col h-screen bg-gray-900">
       <TopToolbar 
         className="z-50 shrink-0 sticky top-0"
         {...topToolbarProps} 
       />
 
       {/* Mobile Navigation */}
       {layoutMode === 'mobile' && (
         <div className="flex justify-around p-2 bg-gray-800 border-b border-gray-700">
           <Button
             variant={activePanel === 'left' ? 'default' : 'ghost'}
             onClick={() => setActivePanel('left')}
             className="flex-1"
           >
             Assets
           </Button>
           <Button
             variant={activePanel === 'canvas' ? 'default' : 'ghost'}
             onClick={() => setActivePanel('canvas')}
             className="flex-1"
           >
             Canvas
           </Button>
           <Button
             variant={activePanel === 'right' ? 'default' : 'ghost'}
             onClick={() => setActivePanel('right')}
             className="flex-1"
           >
             Edit
           </Button>
         </div>
       )}
 
       {/* Main Content Area */}
       <div className="flex-1 overflow-hidden">
         <div className={cn(
           "flex h-full transition-all duration-300 ease-in-out",
           layoutMode === 'mobile' && 'flex-col'
         )}>
           {/* Left Panel */}
           <AnimatePresence mode="wait">
             {(layoutMode !== 'mobile' || activePanel === 'left') && (
               <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className={cn(
                   "bg-gray-800 border-r border-gray-700",
                   layoutMode === 'desktop' ? 'w-80' : 'w-full'
                 )}
               >
                 <div className="h-full overflow-hidden">
                   <LeftPanel 
                     scenes={scenes}
                     currentScene={scenes[currentScene]}
                     onSceneAdd={addScene}
                     onSceneSelect={setCurrentScene}
                     onSceneDelete={deleteScene}
                     onSceneDuplicate={duplicateScene}
                     onSceneUpdate={updateScene}
                     onAssetUpload={handleAssetUpload}
                   />
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
 
           {/* Canvas Area */}
           <AnimatePresence mode="wait">
             {(layoutMode !== 'mobile' || activePanel === 'canvas') && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className={cn(
                   "relative flex-1 overflow-hidden",
                   layoutMode === 'mobile' ? 'h-[70vh]' : 'h-full'
                 )}
               >
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                   <Canvas
                     ref={canvasRef}
                     scene={scenes[currentScene]}
                     isPreviewMode={isPreviewMode}
                     isPlaying={isPlaying}
                     zoom={zoom}
                     showGrid={showGrid}
                     selectedAsset={selectedAsset}
                     onSceneUpdate={handleSceneUpdate}
                     onAssetSelect={setSelectedAsset}
                     onAssetTransform={handleAssetTransform}
                     className={cn(
                       "transition-all duration-300 ease-in-out",
                       isPreviewMode ? 'scale-100' : 'scale-90',
                       layoutMode === 'mobile' && 'max-h-full w-auto'
                     )}
                   />
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
 
           {/* Right Panel */}
           <AnimatePresence mode="wait">
             {(layoutMode !== 'mobile' || activePanel === 'right') && (
               <motion.div
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className={cn(
                   "bg-gray-800 border-l border-gray-700",
                   layoutMode === 'desktop' ? 'w-80' : 'w-full'
                 )}
               >
                 <div className="h-full overflow-hidden">
                   <RightPanel
                     scene={scenes[currentScene]}
                     selectedAsset={selectedAsset}
                     onSceneUpdate={handleSceneUpdate}
                     onAssetTransform={handleAssetTransform}
                     onHistoryUndo={undo}
                     onHistoryRedo={redo}
                     canUndo={canUndo}
                     canRedo={canRedo}
                   />
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
         </div>
       </div>
 
       {/* Status Bar */}
       <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-t border-gray-700">
         <div className="text-sm text-gray-400">
           Scene {currentScene + 1} of {scenes.length}
         </div>
         <div className="flex items-center gap-4">
           <Button
             variant="ghost"
             size="sm"
             onClick={() => setShowGrid(!showGrid)}
           >
             Grid: {showGrid ? 'On' : 'Off'}
           </Button>
           <div className="text-sm text-gray-400">
             Zoom: {zoom}%
           </div>
         </div>
       </div>
 
       {/* Dialogs remain the same... */}
     </div>
   );
 }