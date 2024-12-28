'use client';

import { useCallback, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AuthContext from '@/context/AuthContext';
import { create } from 'zustand';
import {
  Save,
  FolderOpen,
  Play,
  Home,
  Settings,
  Undo,
  Redo,
  Plus,
  BookOpen,
  FileText,
  Download,
  Upload,
  Grid3X3,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';

const useToolbarStore = create((set) => ({
  undoStack: [],
  redoStack: [],
  pushUndo: (state) => set((prev) => ({ 
    undoStack: [...prev.undoStack, state],
    redoStack: [] 
  })),
  undo: () => set((prev) => {
    if (prev.undoStack.length === 0) return prev;
    const newUndo = [...prev.undoStack];
    const state = newUndo.pop();
    return {
      undoStack: newUndo,
      redoStack: [...prev.redoStack, state]
    };
  }),
  redo: () => set((prev) => {
    if (prev.redoStack.length === 0) return prev;
    const newRedo = [...prev.redoStack];
    const state = newRedo.pop();
    return {
      redoStack: newRedo,
      undoStack: [...prev.undoStack, state]
    };
  }),
}));

export default function TopToolbar({
  onSave,
  onLoad,
  onNewScene,
  onPreviewToggle,
  onExport,
  onImport,
  isPreviewMode,
  canvasRef,
  scenes,
  currentScene,
}) {
  const { user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  
  const {
    undoStack,
    redoStack,
    pushUndo,
    undo,
    redo
  } = useToolbarStore();

  const handleSave = async () => {
    try {
      await onSave();
      toast.success('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  };

  const handleLoad = async () => {
    try {
      await onLoad();
      toast.success('Project loaded successfully!');
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
    }
  };

  const handleZoomChange = useCallback((value) => {
    setZoom(value);
    if (canvasRef.current) {
      canvasRef.current.style.transform = `scale(${value / 100})`;
    }
  }, [canvasRef]);

  const handleGridToggle = useCallback(() => {
    setShowGrid(!showGrid);
    if (canvasRef.current) {
      canvasRef.current.toggleGrid?.(!showGrid);
    }
  }, [showGrid, canvasRef]);

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      undo();
      // Apply the previous state from undoStack
      const previousState = undoStack[undoStack.length - 1];
      if (previousState && currentScene) {
        // Update the current scene with the previous state
        onSceneUpdate(currentScene.id, previousState);
      }
    }
  }, [undoStack, currentScene]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      redo();
      // Apply the next state from redoStack
      const nextState = redoStack[redoStack.length - 1];
      if (nextState && currentScene) {
        // Update the current scene with the next state
        onSceneUpdate(currentScene.id, nextState);
      }
    }
  }, [redoStack, currentScene]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleUndo, handleRedo, handleSave]);

  if (!user) {
    return <div className="font-poppins text-xl text-gray-600 font-medium text-center mt-5">Loading...</div>;
  }

  return (
    <div className="z-50 sticky top-0">
      <div className="bg-[#1a1a1a] text-white shadow-2xl">
        {/* Main Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center space-x-4">
            <h1 className="font-poppins text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Novel Maker
            </h1>
          </div>

          {/* Center Section - Main Tools */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              onClick={handleSave}
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save size={16} className="mr-2" />
              Save
            </Button>
            <Button
              onClick={handleLoad}
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FolderOpen size={16} className="mr-2" />
              Load
            </Button>
            
            <div className="h-6 w-px bg-gray-700 mx-2" />
            
            <Button
              onClick={onPreviewToggle}
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Play size={16} className="mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText size={16} className="mr-2" />
                  File
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onExport}>
                  <Download size={16} className="mr-2" />
                  Export Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onImport}>
                  <Upload size={16} className="mr-2" />
                  Import Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Section - User Profile and Additional Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 rounded-md">
              <img
                className="w-8 h-8 rounded-full border-2 border-blue-500"
                src="/images/default.png"
                alt="User Profile"
              />
              <span className="font-poppins text-sm text-gray-200">
                {user.name}
              </span>
            </div>
            <Button
              onClick={() => window.location.href = '/'}
              variant="destructive"
              size="sm"
            >
              <Home size={16} className="mr-2" />
              Exit
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            className="md:hidden"
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Settings size={20} />
          </Button>
        </div>

        {/* Secondary Toolbar */}
        <div className="hidden md:flex items-center justify-between px-4 py-2 bg-[#2a2a2a]">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
            >
              <Undo size={16} className="mr-2" />
              Undo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
            >
              <Redo size={16} className="mr-2" />
              Redo
            </Button>
            
            <div className="h-4 w-px bg-gray-700 mx-2" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewScene}
            >
              <Plus size={16} className="mr-2" />
              New Scene
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGridToggle}
            >
              <Grid3X3 size={16} className="mr-2" />
              Grid
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleZoomChange(Math.max(25, zoom - 25))}
              >
                <ZoomOut size={16} />
              </Button>
              <Slider
                value={[zoom]}
                onValueChange={([value]) => handleZoomChange(value)}
                min={25}
                max={200}
                step={25}
                className="w-32"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleZoomChange(Math.min(200, zoom + 25))}
              >
                <ZoomIn size={16} />
              </Button>
              <span className="text-sm text-gray-400 w-16">
                {zoom}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 w-64 h-full bg-[#1a1a1a] p-4 z-50 shadow-xl">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2 mb-6">
                <img
                  className="w-10 h-10 rounded-full border-2 border-blue-500"
                  src="/images/default.png"
                  alt="User Profile"
                />
                <span className="font-poppins text-white">{user.name}</span>
              </div>
              <Button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Save size={16} className="mr-2" />
                Save
              </Button>
              <Button
                onClick={handleLoad}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <FolderOpen size={16} className="mr-2" />
                Load
              </Button>
              <Button
                onClick={onPreviewToggle}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Play size={16} className="mr-2" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              <div className="h-px bg-gray-700 my-2" />
              <Button
                onClick={() => window.location.href = '/'}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Home size={16} className="mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}