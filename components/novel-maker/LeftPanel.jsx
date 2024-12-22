// LeftPanel.jsx
import { useRef, useState, useCallback } from 'react';
import { 
  FolderUp, Upload, Image, Film, Library, 
  Music, VolumeX, Users, Palette, Save, Plus,
  Folder, ChevronRight, ChevronDown, Trash2
} from 'lucide-react';

const ACCEPTED_TYPES = {
  backgrounds: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  characters: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  music: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  sfx: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  videos: ['video/mp4', 'video/webm']
};

const CATEGORY_CONFIG = [
  { id: 'backgrounds', icon: Image, title: 'Backgrounds' },
  { id: 'characters', icon: Users, title: 'Characters' },
  { id: 'music', icon: Music, title: 'BGM' },
  { id: 'sfx', icon: VolumeX, title: 'SFX' },
  { id: 'effects', icon: Palette, title: 'Effects' }
];

const LeftPanel = ({ 
  onAssetUpload, 
  platformAssets = {}, 
  scenes = [], 
  currentScene,
  onSceneAdd,
  onSceneSelect,
  onSceneDelete,
  onSceneDuplicate 
}) => {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('scenes'); // New default tab
  const [selectedCategory, setSelectedCategory] = useState('backgrounds');
  const [isDragging, setIsDragging] = useState(false);
  const [expandedScenes, setExpandedScenes] = useState([]);

  const toggleSceneExpand = (sceneId) => {
    setExpandedScenes(prev => 
      prev.includes(sceneId) 
        ? prev.filter(id => id !== sceneId)
        : [...prev, sceneId]
    );
  };

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ACCEPTED_TYPES[selectedCategory];
    if (!validTypes?.includes(file.type)) {
      alert(`Please upload a valid ${selectedCategory} file.`);
      return;
    }

    onAssetUpload?.(file, selectedCategory);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedCategory, onAssetUpload]);

  // Scene Management UI
  const renderSceneManager = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Scenes</h3>
        <button
          onClick={() => onSceneAdd()}
          className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="space-y-2">
        {scenes.map((scene) => (
          <div 
            key={scene.id}
            className={`
              rounded-lg overflow-hidden border border-gray-700
              ${currentScene?.id === scene.id ? 'bg-blue-600' : 'bg-gray-700'}
            `}
          >
            <div className="flex items-center p-3">
              <button
                onClick={() => toggleSceneExpand(scene.id)}
                className="mr-2 text-gray-400 hover:text-white"
              >
                {expandedScenes.includes(scene.id) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
              
              <button
                onClick={() => onSceneSelect(scene)}
                className="flex-1 text-left text-sm font-medium text-white"
              >
                {scene.name || `Scene ${scene.id}`}
              </button>
              
              <button
                onClick={() => onSceneDuplicate(scene)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <Save size={14} />
              </button>
              
              <button
                onClick={() => onSceneDelete(scene.id)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <Trash2 size={14} />
              </button>
            </div>
            
            {expandedScenes.includes(scene.id) && (
              <div className="px-4 py-2 bg-gray-800">
                <div className="text-sm text-gray-400">
                  {scene.background && (
                    <div className="flex items-center gap-2">
                      <Image size={14} />
                      <span>Background: {scene.background}</span>
                    </div>
                  )}
                  {scene.character && (
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>Character: {scene.character}</span>
                    </div>
                  )}
                  {scene.dialogue && (
                    <div className="mt-1 text-gray-300">
                      "{scene.dialogue.substring(0, 50)}..."
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-xl">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Visual Novel Maker</h2>
      </div>

      <div className="flex gap-2 p-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('scenes')}
          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-all
            ${activeTab === 'scenes' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
        >
          <Folder size={18} />
          <span className="text-sm font-medium">Scenes</span>
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-all
            ${activeTab === 'assets' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
        >
          <Library size={18} />
          <span className="text-sm font-medium">Assets</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'scenes' ? (
          renderSceneManager()
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {CATEGORY_CONFIG.map(({ id, icon: Icon, title }) => (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`
                    flex items-center gap-2 w-full p-3 rounded-lg transition-all
                    ${selectedCategory === id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}
                  `}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{title}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-4">
              <div 
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-600 hover:border-blue-500'}
                `}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer?.files[0];
                  if (file) {
                    const validTypes = ACCEPTED_TYPES[selectedCategory];
                    if (validTypes?.includes(file.type)) {
                      onAssetUpload?.(file, selectedCategory);
                    } else {
                      alert(`Please upload a valid ${selectedCategory} file.`);
                    }
                  }
                }}
              >
                <FolderUp className="mx-auto mb-4 text-gray-400" size={32} />
                <p className="text-gray-300 mb-4">
                  Drag and drop your files here, or click to select files
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={ACCEPTED_TYPES[selectedCategory]?.join(',')}
                  className="hidden"
                />
              </div>
              
              {platformAssets[selectedCategory]?.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {platformAssets[selectedCategory].map((asset) => (
                    <div
                      key={asset.id}
                      className="group relative cursor-pointer rounded-lg overflow-hidden"
                      onClick={() => onAssetUpload(asset, selectedCategory)}
                    >
                      {selectedCategory === 'music' || selectedCategory === 'sfx' ? (
                        <div className="aspect-square bg-gray-700 flex items-center justify-center">
                          <Music size={32} className="text-gray-400" />
                        </div>
                      ) : (
                        <img
                          src={asset.src}
                          alt={asset.title}
                          className="w-full aspect-video object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {asset.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;