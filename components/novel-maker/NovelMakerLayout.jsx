'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { useHotkeys } from 'react-hotkeys-hook';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import Canvas from './Canvas';
import TopToolbar from './TopToolbar';

// Enhanced project store with additional features
const useProjectStore = create((set, get) => ({
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
      width: 700,
      height: 400,
      rotation: 0,
      opacity: 1,
      scale: 1,
      visible: true,
      flip: false,
      transitions: {
        enter: 'fade',
        exit: 'fade',
        duration: 500
      }
    },
    characterProps: {
      posX: 0,
      posY: 0,
      width: 150,
      height: 300,
      rotation: 0,
      opacity: 1,
      scale: 1,
      visible: true,
      flip: false,
      transitions: {
        enter: 'slide',
        exit: 'fade',
        duration: 300
      }
    },
    textProps: {
      frameSize: 800,
      fontSize: 16,
      opacity: 0.8,
      color: '#FFFFFF',
      position: 'bottom',
      typewriterSpeed: 50,
      fontFamily: 'Inter',
      textShadow: true
    },
    audio: {
      bgm: null,
      sfx: null,
      volume: 1,
      fadeIn: 1000,
      fadeOut: 500
    },
    choices: [],
    variables: {},
    conditions: []
  }],
  
  // Scene Management
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
            [`${assetType}Props`]: { ...scene[`${assetType}Props`], ...props }
          }
        : scene
    )
  })),
  
  // Project Management
  exportProject: () => {
    const state = get();
    return {
      version: '1.0.0',
      scenes: state.scenes,
      metadata: {
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    };
  },
  
  importProject: (projectData) => {
    if (!projectData.scenes || !Array.isArray(projectData.scenes)) {
      throw new Error('Invalid project data');
    }
    set({ scenes: projectData.scenes, currentScene: 0 });
  }
}));

// Enhanced history management with more features
const useHistory = (initialState) => {
  const [history, setHistory] = useState({
    past: [],
    present: initialState,
    future: [],
    lastSaved: initialState
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  const hasUnsavedChanges = JSON.stringify(history.present) !== JSON.stringify(history.lastSaved);

  const undo = useCallback(() => {
    setHistory(curr => {
      if (!curr.past.length) return curr;
      const previous = curr.past[curr.past.length - 1];
      const newPast = curr.past.slice(0, curr.past.length - 1);
      
      return {
        past: newPast,
        present: previous,
        future: [curr.present, ...curr.future],
        lastSaved: curr.lastSaved
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
        future: newFuture,
        lastSaved: curr.lastSaved
      };
    });
  }, []);

  const updatePresent = useCallback((newPresent) => {
    setHistory(curr => ({
      past: [...curr.past, curr.present],
      present: newPresent,
      future: [],
      lastSaved: curr.lastSaved
    }));
  }, []);

  const markAsSaved = useCallback(() => {
    setHistory(curr => ({
      ...curr,
      lastSaved: curr.present
    }));
  }, []);

  return { 
    history, 
    updatePresent, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    hasUnsavedChanges,
    markAsSaved 
  };
};

export default function NovelMakerLayout() {
  // Context and Refs
  const { user } = useContext(AuthContext);
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
    updateAssetProps,
    exportProject,
    importProject
  } = useProjectStore();

  // Enhanced UI State
  const [uiState, setUiState] = useState({
    isPreviewMode: false,
    isPlaying: false,
    showAdvancedSettings: false,
    activeAssetType: 'background',
    isDragging: false,
    zoom: 100,
    grid: {
      show: false,
      size: 20,
      snap: false
    },
    sidebar: {
      left: true,
      right: true
    },
    modal: {
      type: null,
      props: {}
    }
  });

  // History Management
  const { 
    history, 
    updatePresent, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    hasUnsavedChanges,
    markAsSaved 
  } = useHistory(scenes);

  // Hotkeys Setup
  useHotkeys('ctrl+z, cmd+z', (e) => {
    e.preventDefault();
    if (canUndo) undo();
  }, [canUndo, undo]);

  useHotkeys('ctrl+shift+z, cmd+shift+z', (e) => {
    e.preventDefault();
    if (canRedo) redo();
  }, [canRedo, redo]);

  useHotkeys('ctrl+s, cmd+s', (e) => {
    e.preventDefault();
    saveProject();
  }, []);

  // Asset Upload Handler
  const handleAssetUpload = useCallback(async (file, category) => {
    try {
      // You might want to implement actual file upload to a server here
      const fileUrl = URL.createObjectURL(file);
      
      if (category === 'backgrounds') {
        await updateAsset(currentScene, 'background', fileUrl);
      } else if (category === 'characters') {
        await updateAsset(currentScene, 'character', fileUrl);
      } else if (category === 'music' || category === 'sfx') {
        await updateScene(currentScene, {
          audio: {
            ...scenes[currentScene].audio,
            [category]: fileUrl
          }
        });
      }
      
      toast.success(`${category} uploaded successfully`);
      updatePresent(scenes);
    } catch (error) {
      console.error('Error uploading asset:', error);
      toast.error(`Failed to upload ${category}`);
    }
  }, [currentScene, scenes, updateAsset, updateScene, updatePresent]);

  // Scene Update Handler
  const handleSceneUpdate = useCallback((updates) => {
    try {
      updateScene(currentScene, updates);
      updatePresent(scenes);
    } catch (error) {
      console.error('Error updating scene:', error);
      toast.error('Failed to update scene');
    }
  }, [currentScene, scenes, updateScene, updatePresent]);

  // Asset Transform Handler
  const handleAssetTransform = useCallback((assetType, transforms) => {
    try {
      updateAssetProps(currentScene, assetType, transforms);
      updatePresent(scenes);
    } catch (error) {
      console.error('Error transforming asset:', error);
      toast.error('Failed to transform asset');
    }
  }, [currentScene, updateAssetProps, updatePresent]);

  // Save/Load Functions
  const saveProject = useCallback(async () => {
    try {
      const projectData = exportProject();
      localStorage.setItem('novelMakerProject', JSON.stringify(projectData));
      markAsSaved();
      toast.success('Project saved successfully');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  }, [exportProject, markAsSaved]);

  const loadProject = useCallback(async () => {
    try {
      const savedProject = localStorage.getItem('novelMakerProject');
      if (savedProject) {
        const projectData = JSON.parse(savedProject);
        importProject(projectData);
        updatePresent(projectData.scenes);
        toast.success('Project loaded successfully');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
    }
  }, [importProject, updatePresent]);

  // Auto-save
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    
    const timeoutId = setTimeout(() => {
      const projectData = exportProject();
      localStorage.setItem('novelMakerProject_autosave', JSON.stringify(projectData));
    }, 60000);

    return () => clearTimeout(timeoutId);
  }, [scenes, currentScene, hasUnsavedChanges, exportProject]);

  // Unsaved Changes Warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Current Scene Data
  const currentSceneData = useMemo(() => scenes[currentScene], [scenes, currentScene]);

  // Toggle Handlers
  const togglePreviewMode = useCallback(() => {
    setUiState(prev => ({ 
      ...prev, 
      isPreviewMode: !prev.isPreviewMode,
      isPlaying: !prev.isPreviewMode 
    }));
  }, []);

  const toggleSidebar = useCallback((side) => {
    setUiState(prev => ({
      ...prev,
      sidebar: {
        ...prev.sidebar,
        [side]: !prev.sidebar[side]
      }
    }));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <TopToolbar 
        onSave={saveProject}
        onLoad={loadProject}
        onUndo={canUndo ? undo : undefined}
        onRedo={canRedo ? redo : undefined}
        hasUnsavedChanges={hasUnsavedChanges}
        isPreviewMode={uiState.isPreviewMode}
        onPreviewToggle={togglePreviewMode}
        isPlaying={uiState.isPlaying}
        onPlayToggle={() => setUiState(prev => ({ 
          ...prev, 
          isPlaying: !prev.isPlaying 
        }))}
        zoom={uiState.zoom}
        onZoomChange={(zoom) => setUiState(prev => ({ ...prev, zoom }))}
        showGrid={uiState.grid.show}
        onToggleGrid={() => setUiState(prev => ({
          ...prev,
          grid: { ...prev.grid, show: !prev.grid.show }
        }))}
        onToggleLeftSidebar={() => toggleSidebar('left')}
        onToggleRightSidebar={() => toggleSidebar('right')}
      />
      
      <div className="flex flex-col lg:flex-row gap-4 p-4 flex-grow">
        <div className="w-full lg:w-1/4 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <LeftPanel
            onAssetUpload={handleAssetUpload}
            platformAssets={[]} // Add your platform assets here
            scenes={scenes}
            currentScene={currentSceneData}
            onSceneAdd={addScene}
            onSceneSelect={setCurrentScene}
            onSceneDelete={deleteScene}
            onSceneDuplicate={duplicateScene}
          />
        </div>

        <div className="w-full lg:w-2/4 flex items-center justify-center">
          <Canvas
            ref={canvasRef}
            scene={currentSceneData}
            isPreviewMode={uiState.isPreviewMode}
            isPlaying={uiState.isPlaying}
            zoom={uiState.zoom}
            onSceneUpdate={handleSceneUpdate}
            onAssetSelect={(type) => setUiState(prev => ({
              ...prev,
              activeAssetType: type
            }))}
          />
        </div>

        <div className="w-full lg:w-1/4 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <RightPanel
            currentScene={currentSceneData}
            onSceneUpdate={handleSceneUpdate}
            onAssetPreview={() => {}} // Implement preview functionality
            onAssetHide={(assetType) => handleAssetTransform(assetType, { visible: false })}
            showAdvancedSettings={uiState.showAdvancedSettings}
            onToggleAdvancedSettings={() => setUiState(prev => ({
              ...prev,
              showAdvancedSettings: !prev.showAdvancedSettings
            }))}
            activeAssetType={uiState.activeAssetType}
          />
        </div>
      </div>
    </div>
  );
}