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
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
      <TopToolbar 
        onUndo={canUndo ? undo : undefined}
        onRedo={canRedo ? redo : undefined}
        isPreviewMode={isPreviewMode}
        onPreviewToggle={() => setIsPreviewMode(prev => !prev)}
        isPlaying={isPlaying}
        onPlayToggle={() => setIsPlaying(prev => !prev)}
        zoom={zoom}
        onZoomChange={setZoom}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(prev => !prev)}
        onExport={handleExport}
        onToggleLeftPanel={() => setUiState(prev => ({ 
          ...prev, 
          showLeftPanel: !prev.showLeftPanel 
        }))}
        onToggleRightPanel={() => setUiState(prev => ({ 
          ...prev, 
          showRightPanel: !prev.showRightPanel 
        }))}
        className="shrink-0"
      />
      <div className="w-full max-h-screen overflow-y-auto">
      <div className="flex flex-col lg:flex-row gap-4 p-4 flex-grow">
      
        {/* Left Panel - Assets & Scenes */}
        <AnimatePresence mode="wait">
          {uiState.showLeftPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "320px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full border-r border-gray-700 bg-gray-800"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Main Canvas Area */}
        <div className="relative flex-1 overflow-hidden">
        <div >
          <div 
            className={`
              absolute inset-0 top-24 w-[100%] h-[50%] max-h-xl mx-auto flex items-center justify-center
              transition-all duration-200 ease-in-out
              ${isPreviewMode ? 'bg-black' : 'bg-gray-900'}
            `}
          >
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
              className={`
                transition-transform duration-200
                ${isPreviewMode ? 'scale-100' : 'scale-90'}
              `}
            />
            </div>
          </div>
        </div>
  
        {/* Right Panel - Asset Controls */}
        <div>
        <AnimatePresence mode="wait">
          {uiState.showRightPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "320px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full border-l border-gray-700 bg-gray-800"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
        </div>
        </div>
      </div>
  
      {/* Upload Progress Dialog */}
      <Dialog 
        open={uiState.showUploadDialog}
        onOpenChange={(open) => setUiState(prev => ({ ...prev, showUploadDialog: open }))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Uploading Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Progress value={uiState.uploadProgress} className="w-full" />
            <p className="text-center text-sm text-gray-400">
              {uiState.uploadProgress}% complete
            </p>
          </div>
        </DialogContent>
      </Dialog>
  
      {/* Export Dialog */}
      <Dialog
        open={uiState.showExportDialog}
        onOpenChange={(open) => setUiState(prev => ({ ...prev, showExportDialog: open }))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setUiState(prev => ({ ...prev, showExportDialog: false }))}
              >
                Cancel
              </Button>
              <Button onClick={handleExport}>
                Export
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  

    </div>
  );
}