import { useRef, useState, useCallback } from 'react';
import { 
  FolderUp, Image, Film, Library, 
  Music, VolumeX, Users, Plus, Save,
  Folder, ChevronRight, ChevronDown, 
  Trash2, Edit2, MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

const ASSET_CATEGORIES = {
  backgrounds: {
    id: 'backgrounds',
    icon: Image,
    title: 'Backgrounds',
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    platformAssets: [
      '/images/background/1.png',
      '/images/backgrounds/cafe.jpg',
      '/images/backgrounds/park.jpg'
    ]
  },
  characters: {
    id: 'characters',
    icon: Users,
    title: 'Characters',
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    platformAssets: [
      '/images/characters/student.png',
      '/images/characters/teacher.png'
    ]
  },
  music: {
    id: 'music',
    icon: Music,
    title: 'BGM',
    accept: ['audio/mpeg', 'audio/wav'],
    platformAssets: [
      '/audio/bgm/happy.mp3',
      '/audio/bgm/sad.mp3'
    ]
  },
  sfx: {
    id: 'sfx',
    icon: VolumeX,
    title: 'SFX',
    accept: ['audio/mpeg', 'audio/wav'],
    platformAssets: [
      '/audio/sfx/click.mp3',
      '/audio/sfx/door.mp3'
    ]
  }
};

const LeftPanel = ({
  scenes = [],
  currentScene,
  onSceneAdd,
  onSceneSelect,
  onSceneDelete,
  onSceneDuplicate,
  onSceneUpdate,
  onAssetUpload
}) => {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('scenes');
  const [selectedCategory, setSelectedCategory] = useState('backgrounds');
  const [expandedScenes, setExpandedScenes] = useState([]);
  const [editingScene, setEditingScene] = useState(null);
  const [sceneNameInput, setSceneNameInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const toggleSceneExpand = useCallback((sceneId) => {
    setExpandedScenes(prev => 
      prev.includes(sceneId) 
        ? prev.filter(id => id !== sceneId)
        : [...prev, sceneId]
    );
  }, []);

  const handleSceneNameEdit = useCallback((scene) => {
    setEditingScene(scene.id);
    setSceneNameInput(scene.name);
  }, []);

  const handleSceneNameSave = useCallback((scene) => {
    if (sceneNameInput.trim()) {
      onSceneUpdate(scene.id, { name: sceneNameInput.trim() });
    }
    setEditingScene(null);
  }, [sceneNameInput, onSceneUpdate]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const category = ASSET_CATEGORIES[selectedCategory];
    if (!category.accept.includes(file.type)) {
      toast.error(`Please upload a valid ${category.title} file`);
      return;
    }

    onAssetUpload?.(file, selectedCategory);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [selectedCategory, onAssetUpload]);

  const renderSceneManager = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Scenes</h3>
        <Button onClick={onSceneAdd} size="sm" variant="secondary">
          <Plus className="w-4 h-4 mr-1" /> Add Scene
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        {scenes.map((scene) => (
          <Card
            key={scene.id}
            className={`mb-2 ${
              currentScene?.id === scene.id ? 'border-blue-500' : 'border-gray-700'
            }`}
          >
            <div className="p-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSceneExpand(scene.id)}
                  className="text-gray-400 hover:text-white"
                >
                  {expandedScenes.includes(scene.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {editingScene === scene.id ? (
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
                      autoFocus
                      className="h-7"
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => onSceneSelect(scene)}
                    className="flex-1 text-left font-medium"
                  >
                    {scene.name || `Scene ${scene.id}`}
                  </button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleSceneNameEdit(scene)}>
                      <Edit2 className="w-4 h-4 mr-2" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSceneDuplicate(scene)}>
                      <Save className="w-4 h-4 mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onSceneDelete(scene.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {expandedScenes.includes(scene.id) && (
                <div className="mt-3 pl-6 space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    {scene.background ? (
                      <span>Background: {scene.background.split('/').pop()}</span>
                    ) : (
                      <span className="italic">No background set</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {scene.character ? (
                      <span>Character: {scene.character.split('/').pop()}</span>
                    ) : (
                      <span className="italic">No character set</span>
                    )}
                  </div>
                  {scene.dialogue && (
                    <div className="flex items-center gap-2">
                      <div className="line-clamp-2">
                        "{scene.dialogue}"
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );

  const renderAssetManager = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {Object.values(ASSET_CATEGORIES).map(({ id, icon: Icon, title }) => (
          <Button
            key={id}
            variant={selectedCategory === id ? "default" : "secondary"}
            onClick={() => setSelectedCategory(id)}
            className="justify-start"
          >
            <Icon className="w-4 h-4 mr-2" />
            {title}
          </Button>
        ))}
      </div>

      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center
          ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer?.files[0];
          if (!file) return;

          const category = ASSET_CATEGORIES[selectedCategory];
          if (category.accept.includes(file.type)) {
            onAssetUpload?.(file, selectedCategory);
          } else {
            toast.error(`Please upload a valid ${category.title} file`);
          }
        }}
      >
        <FolderUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <Button
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose File
        </Button>
        <p className="mt-2 text-sm text-gray-400">
          or drag and drop your files here
        </p>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept={ASSET_CATEGORIES[selectedCategory].accept.join(',')}
          className="hidden"
        />
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Platform Assets</h4>
        <ScrollArea className="h-[calc(100vh-26rem)]">
          <div className="grid grid-cols-2 gap-3">
            {ASSET_CATEGORIES[selectedCategory].platformAssets.map((asset, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:border-blue-500"
                onClick={() => onAssetUpload(asset, selectedCategory)}
              >
                {selectedCategory === 'music' || selectedCategory === 'sfx' ? (
                  <div className="aspect-square flex items-center justify-center bg-gray-800">
                    <Music className="w-8 h-8 text-gray-400" />
                  </div>
                ) : (
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={asset}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-2 text-sm truncate">
                  {asset.split('/').pop()}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-xl">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Visual Novel Maker</h2>
      </div>

      <div className="flex gap-2 p-4 border-b border-gray-700">
        <Button
          variant={activeTab === 'scenes' ? "default" : "secondary"}
          onClick={() => setActiveTab('scenes')}
          className="flex-1"
        >
          <Folder className="w-4 h-4 mr-2" />
          Scenes
        </Button>
        <Button
          variant={activeTab === 'assets' ? "default" : "secondary"}
          onClick={() => setActiveTab('assets')}
          className="flex-1"
        >
          <Library className="w-4 h-4 mr-2" />
          Assets
        </Button>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        {activeTab === 'scenes' ? renderSceneManager() : renderAssetManager()}
      </div>
    </div>
  );
};

export default LeftPanel;