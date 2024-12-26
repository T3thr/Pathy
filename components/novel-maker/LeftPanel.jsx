import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, ChevronRight, ChevronDown, Edit2, 
  Trash2, Copy, Image, Users, Music, 
  Volume2, Upload, FolderOpen
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';

const ASSET_CATEGORIES = {
  backgrounds: {
    id: 'backgrounds',
    title: 'Backgrounds',
    icon: Image,
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024, // 5MB
    description: 'Upload background images (JPG, PNG, WebP)',
    platformAssets: [
      '/images/background/1.png',
      '/images/backgrounds/cafe.jpg',
      '/images/backgrounds/park.jpg'
    ]
  },
  characters: {
    id: 'characters',
    title: 'Characters',
    icon: Users,
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024,
    description: 'Upload character sprites (PNG with transparency)',
    platformAssets: [
      '/images/characters/student.png',
      '/images/characters/teacher.png'
    ]
  },
  bgm: {
    id: 'bgm',
    title: 'Background Music',
    icon: Music,
    accept: 'audio/*',
    maxSize: 10 * 1024 * 1024, // 10MB
    description: 'Upload background music (MP3, WAV)',
    platformAssets: [
      '/audio/bgm/happy.mp3',
      '/audio/bgm/sad.mp3'
    ]
  },
  sfx: {
    id: 'sfx',
    title: 'Sound Effects',
    icon: Volume2,
    accept: 'audio/*',
    maxSize: 2 * 1024 * 1024, // 2MB
    description: 'Upload sound effects (MP3, WAV)',
    platformAssets: [
      '/audio/sfx/click.mp3',
      '/audio/sfx/door.mp3'
    ]
  }
};

export default function LeftPanel({
  scenes,
  currentScene,
  onSceneAdd,
  onSceneSelect,
  onSceneDelete,
  onSceneDuplicate,
  onSceneUpdate,
  onAssetUpload,
  onAssetSelect,
}) {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('scenes');
  const [selectedCategory, setSelectedCategory] = useState('backgrounds');
  const [expandedScenes, setExpandedScenes] = useState([]);
  const [editingSceneId, setEditingSceneId] = useState(null);
  const [sceneNameInput, setSceneNameInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Handle scene expansion toggle
  const handleSceneExpand = useCallback((sceneId) => {
    setExpandedScenes(prev => 
      prev.includes(sceneId) ? prev.filter(id => id !== sceneId) : [...prev, sceneId]
    );
  }, []);

  // Handle scene name editing
  const handleSceneNameEdit = useCallback((scene) => {
    setEditingSceneId(scene.id);
    setSceneNameInput(scene.name);
  }, []);

  const handleSceneNameSave = useCallback((scene) => {
    if (!sceneNameInput.trim()) return;
    onSceneUpdate(scene.id, { name: sceneNameInput.trim() });
    setEditingSceneId(null);
  }, [sceneNameInput, onSceneUpdate]);

  // Enhanced file validation and upload
  const validateFile = useCallback((file, category) => {
    const config = ASSET_CATEGORIES[category];
    
    if (!file.type.startsWith(config.accept.split('/')[0])) {
      toast.error(`Invalid file type. Please upload ${config.description}`);
      return false;
    }
    
    if (file.size > config.maxSize) {
      toast.error(`File too large. Maximum size is ${config.maxSize / (1024 * 1024)}MB`);
      return false;
    }
    
    return true;
  }, []);

      // Handle asset selection and upload
    const handleAssetSelect = useCallback((asset, category) => {
      const assetType = ASSET_CATEGORIES[category].id === 'backgrounds' ? 'background' : 
                       ASSET_CATEGORIES[category].id === 'characters' ? 'character' : category;
      
      onAssetSelect?.({
        type: assetType,
        path: asset.path,
        id: asset.id
      });
  
      // Update current scene with the new asset
      if (currentScene) {
        const updatedScene = {
          ...currentScene,
          [assetType]: asset.path,
          [`${assetType}Props`]: {
            ...currentScene[`${assetType}Props`],
            visible: true,
            transform: { x: 0, y: 0, scale: 1, rotation: 0 }
          }
        };
        onSceneUpdate(currentScene.id, updatedScene);
      }
    }, [currentScene, onAssetSelect, onSceneUpdate]);

  // Enhanced file upload handler
  const handleFileUpload = useCallback(async (event) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      if (!validateFile(file, selectedCategory)) continue;
      
      try {
        const assetType = ASSET_CATEGORIES[selectedCategory].id === 'backgrounds' ? 'background' : 
                         ASSET_CATEGORIES[selectedCategory].id === 'characters' ? 'character' : 
                         selectedCategory;

        // Create a URL for the uploaded file
        const fileUrl = URL.createObjectURL(file);
        
        // Create asset object
        const newAsset = {
          id: `uploaded-${Date.now()}`,
          path: fileUrl,
          type: assetType,
          name: file.name
        };

        // Handle the upload
        await onAssetUpload(newAsset, selectedCategory);
        
        // Update current scene if exists
        if (currentScene) {
          const updatedScene = {
            ...currentScene,
            [assetType]: fileUrl,
            [`${assetType}Props`]: {
              ...currentScene[`${assetType}Props`],
              visible: true,
              transform: { x: 0, y: 0, scale: 1, rotation: 0 }
            }
          };
          onSceneUpdate(currentScene.id, updatedScene);
        }

        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [selectedCategory, onAssetUpload, currentScene, onSceneUpdate, validateFile]);

  const renderPlatformAssets = () => (
    <div className="mt-6">
      <h4 className="text-sm font-medium mb-3">Platform Assets</h4>
      <ScrollArea className="h-[calc(100vh-26rem)]">
        <div className="grid grid-cols-2 gap-3">
          {ASSET_CATEGORIES[selectedCategory].platformAssets.map((asset) => (
            <Card
              key={asset.id}
              className="group cursor-pointer hover:border-blue-500"
              onClick={() => handleAssetSelect(asset, selectedCategory)}
            >
              {selectedCategory === 'bgm' || selectedCategory === 'sfx' ? (
                <div className="aspect-square flex items-center justify-center bg-gray-800">
                  <Music className="w-8 h-8 text-gray-400" />
                </div>
              ) : (
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={asset.path}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-2 text-sm truncate">
                {asset.path.split('/').pop()}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

// Add handleDrop function before return statement
const handleDrop = useCallback((event) => {
  event.preventDefault();
  setIsDragging(false);
  
  const files = Array.from(event.dataTransfer.files);
  if (!files.length) return;
  
  handleFileUpload({ target: { files } });
}, [handleFileUpload]);

return (
  <div className="h-full flex flex-col bg-var-container border-r border-[var(--divider)]">
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger 
          value="scenes" 
          className="data-[state=active]:bg-[var(--container)] text-[var(--foreground)]"
        >
          Scenes
        </TabsTrigger>
        <TabsTrigger 
          value="assets" 
          className="data-[state=active]:bg-[var(--container)] text-[var(--foreground)]"
        >
          Assets
        </TabsTrigger>
      </TabsList>

      <TabsContent value="scenes" className="flex-1 p-0">
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Scenes</h3>
            <Button 
              size="sm" 
              onClick={onSceneAdd}
              className="flex items-center gap-2 bg-[hsl(var(--primary))]
                        hover:bg-[hsl(var(--primary))]"
            >
              <Plus className="w-4 h-4" />
              Add Scene
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)] scrollbar-thin scrollbar-thumb-rounded-lg">
            <div className="space-y-2 pr-4">
              {scenes.map((scene) => (
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`
                      border transition-colors duration-200 
                      hover:bg-[var(--container)] 
                      ${currentScene?.id === scene.id 
                        ? 'border-[hsl(var(--primary))] bg-[var(--container)]' 
                        : 'border-[var(--divider)]'}
                    `}
                  >
                    <div className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSceneExpand(scene.id)}
                          className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                        >
                          {expandedScenes.includes(scene.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        {editingSceneId === scene.id ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleSceneNameSave(scene);
                            }}
                            className="flex-1"
                          >
                            <Input
                              value={sceneNameInput}
                              onChange={(e) => setSceneNameInput(e.target.value)}
                              onBlur={() => handleSceneNameSave(scene)}
                              className="h-8 bg-[var(--container)]"
                              autoFocus
                            />
                          </form>
                        ) : (
                          <button
                            onClick={() => onSceneSelect(scene.id)}
                            className="flex-1 text-left font-medium truncate text-[var(--foreground)]"
                          >
                            {scene.name}
                          </button>
                        )}

                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSceneNameEdit(scene)}
                            className="hover:bg-[var(--container)]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onSceneDuplicate(scene.id)}
                            className="hover:bg-[var(--container)]"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onSceneDelete(scene.id)}
                            className="text-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive))] hover:bg-[var(--container)]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {expandedScenes.includes(scene.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 pl-6 space-y-2"
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <Image className="w-4 h-4 text-[var(--muted)]" />
                            <span className="text-[var(--muted)]">
                              {scene.background ? 
                                scene.background.split('/').pop() : 
                                'No background'
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-[var(--muted)]" />
                            <span className="text-[var(--muted)]">
                              {scene.character ? 
                                scene.character.split('/').pop() : 
                                'No character'
                              }
                            </span>
                          </div>
                          {scene.dialogue && (
                            <div className="text-sm text-[var(--muted)] line-clamp-2 italic">
                              &quot;{scene.dialogue}&quot;
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </TabsContent>

      <TabsContent value="assets" className="flex-1 p-0">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {Object.values(ASSET_CATEGORIES).map(({ id, title, icon: Icon }) => (
              <Button
                key={id}
                variant={selectedCategory === id ? 'default' : 'secondary'}
                onClick={() => setSelectedCategory(id)}
                className={`
                  justify-start transition-colors
                  ${selectedCategory === id 
                    ? 'bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]' 
                    : 'hover:bg-[var(--container)]'}
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {title}
              </Button>
            ))}
          </div>

          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center
              transition-all duration-200
              ${isDragging 
                ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]' 
                : 'border-[var(--divider)]'}
              hover:border-[var(--muted)] hover:bg-[var(--container)]
            `}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--muted)]" />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="mb-2"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            <p className="text-sm text-[var(--muted)]">
              or drag and drop files here
            </p>
            <p className="text-xs text-[var(--muted)] mt-2">
              {ASSET_CATEGORIES[selectedCategory].description}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept={ASSET_CATEGORIES[selectedCategory].accept}
              className="hidden"
              multiple
            />
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3 text-[var(--muted)]">Platform Assets</h4>
            <ScrollArea className="h-[calc(100vh-26rem)] scrollbar-thin scrollbar-thumb-rounded-lg">
              <div className="grid grid-cols-2 gap-3 pr-4">
                {ASSET_CATEGORIES[selectedCategory].platformAssets.map((asset, index) => (
                  <Card
                    key={index}
                    className="group cursor-pointer hover:border-[hsl(var(--primary))] 
                              transition-colors bg-[var(--container)]"
                    onClick={() => handleAssetSelect({ path: asset }, selectedCategory)}
                  >
                    {selectedCategory === 'bgm' || selectedCategory === 'sfx' ? (
                      <div className="aspect-square flex items-center justify-center bg-[var(--background)]">
                        <Music className="w-8 h-8 text-[var(--muted)]" />
                      </div>
                    ) : (
                      <div className="aspect-video relative overflow-hidden rounded-t-lg bg-[var(--background)]">
                        <img
                          src={asset}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-2 text-sm truncate text-[var(--muted)]">
                      {asset.split('/').pop()}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

}
