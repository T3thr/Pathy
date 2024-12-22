import { useState, useCallback, useEffect } from "react";
import { 
  Sliders, Image, Type, RotateCw, Trash2, 
  RefreshCw, Move, Volume2, Eye, EyeOff,
  FlipHorizontal, ZoomIn, ZoomOut
} from "lucide-react";

const RightPanel = ({
  currentScene,
  onSceneUpdate,
  onAssetPreview,
  onAssetHide
}) => {
  const [activeTab, setActiveTab] = useState("image");
  const [activeAsset, setActiveAsset] = useState("background");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Separate state for form inputs to prevent unnecessary rerenders
  const [dialogueInput, setDialogueInput] = useState("");
  const [characterNameInput, setCharacterNameInput] = useState("");

  // Initialize editor state from current scene
  useEffect(() => {
    if (currentScene) {
      setDialogueInput(currentScene.dialogue || "");
      setCharacterNameInput(currentScene.characterName || "");
    }
  }, [currentScene]);

  // Memoized update handlers
  const handleAssetUpdate = useCallback((property, value) => {
    if (!currentScene) return;
    
    const assetType = `${activeAsset}Props`;
    onSceneUpdate({
      ...currentScene,
      [assetType]: {
        ...currentScene[assetType],
        [property]: value
      }
    });
  }, [currentScene, activeAsset, onSceneUpdate]);

  const handleTextUpdate = useCallback((property, value) => {
    if (!currentScene) return;
    
    onSceneUpdate({
      ...currentScene,
      textProps: {
        ...currentScene.textProps,
        [property]: value
      }
    });
  }, [currentScene, onSceneUpdate]);

  const handleDialogueSubmit = useCallback(() => {
    if (!currentScene) return;
    
    onSceneUpdate({
      ...currentScene,
      dialogue: dialogueInput,
      characterName: characterNameInput
    });
  }, [currentScene, dialogueInput, characterNameInput, onSceneUpdate]);

  const handleAssetReset = useCallback(() => {
    if (!currentScene) return;
    
    const defaultProps = {
      posX: 0,
      posY: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
      width: 500,
      height: 500,
      flip: false,
      visible: true
    };

    onSceneUpdate({
      ...currentScene,
      [`${activeAsset}Props`]: defaultProps
    });
  }, [currentScene, activeAsset, onSceneUpdate]);

  // Asset control panel renderer
  const renderAssetControls = () => {
    if (!currentScene) return null;

    const assetProps = currentScene[`${activeAsset}Props`] || {};
    const asset = currentScene[activeAsset];

    return (
      <div className="space-y-4">
        {/* Asset Preview */}
        {asset && (
          <div className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden">
            <img 
              src={asset}
              alt={`${activeAsset} preview`}
              className="w-full h-full object-contain"
              style={{
                transform: `scale(${assetProps.flip ? -1 : 1}, 1)`
              }}
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleAssetUpdate('visible', !assetProps.visible)}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                {assetProps.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                onClick={() => handleAssetUpdate('flip', !assetProps.flip)}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <FlipHorizontal size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Basic Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Scale</label>
            <div className="flex gap-2">
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={assetProps.scale || 1}
                onChange={(e) => handleAssetUpdate('scale', parseFloat(e.target.value))}
                className="flex-1"
              />
              <div className="flex gap-1">
                <button
                  onClick={() => handleAssetUpdate('scale', (assetProps.scale || 1) - 0.1)}
                  className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  onClick={() => handleAssetUpdate('scale', (assetProps.scale || 1) + 0.1)}
                  className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                >
                  <ZoomIn size={14} />
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={assetProps.opacity || 1}
              onChange={(e) => handleAssetUpdate('opacity', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Position Controls */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Position</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400">X</label>
              <input
                type="range"
                min="-500"
                max="500"
                value={assetProps.posX || 0}
                onChange={(e) => handleAssetUpdate('posX', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400">Y</label>
              <input
                type="range"
                min="-500"
                max="500"
                value={assetProps.posY || 0}
                onChange={(e) => handleAssetUpdate('posY', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Advanced Controls */}
        {showAdvancedSettings && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rotation</label>
              <input
                type="range"
                min="-180"
                max="180"
                value={assetProps.rotation || 0}
                onChange={(e) => handleAssetUpdate('rotation', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Width</label>
                <input
                  type="number"
                  value={assetProps.width || 500}
                  onChange={(e) => handleAssetUpdate('width', parseInt(e.target.value))}
                  className="w-full p-2 bg-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Height</label>
                <input
                  type="number"
                  value={assetProps.height || 500}
                  onChange={(e) => handleAssetUpdate('height', parseInt(e.target.value))}
                  className="w-full p-2 bg-gray-700 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAssetReset}
            className="flex items-center gap-2 flex-1 justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw size={16} /> Reset
          </button>
          {asset && (
            <button
              onClick={() => onAssetHide(activeAsset)}
              className="flex items-center gap-2 flex-1 justify-center p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 size={16} /> Remove
            </button>
          )}
        </div>
      </div>
    );
  };

  // Text control panel renderer
  const renderTextControls = () => {
    if (!currentScene) return null;

    const textProps = currentScene.textProps || {};

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Character Name</label>
          <input
            type="text"
            value={characterNameInput}
            onChange={(e) => setCharacterNameInput(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded-lg"
            placeholder="Enter character name..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dialogue</label>
          <textarea
            value={dialogueInput}
            onChange={(e) => setDialogueInput(e.target.value)}
            rows={4}
            className="w-full p-2 bg-gray-700 rounded-lg resize-none"
            placeholder="Enter dialogue..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Text Size</label>
            <input
              type="range"
              min="12"
              max="32"
              value={textProps.fontSize || 16}
              onChange={(e) => handleTextUpdate('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Box Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={textProps.opacity || 0.8}
              onChange={(e) => handleTextUpdate('opacity', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {showAdvancedSettings && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Text Color</label>
              <input
                type="color"
                value={textProps.color || "#FFFFFF"}
                onChange={(e) => handleTextUpdate('color', e.target.value)}
                className="w-full h-10 p-1 bg-gray-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Box Width</label>
              <input
                type="range"
                min="400"
                max="1000"
                value={textProps.frameSize || 800}
                onChange={(e) => handleTextUpdate('frameSize', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}

        <button
          onClick={handleDialogueSubmit}
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Update Dialogue
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white rounded-lg shadow-xl">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold">Editor Panel</h2>
        <button
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          className={`p-2 rounded-lg transition ${
            showAdvancedSettings ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Sliders size={16} />
        </button>
      </div>

      <div className="flex gap-2 p-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("image")}
          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition ${
            activeTab === "image" ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Image size={16} /> Assets
        </button>
        <button
          onClick={() => setActiveTab("text")}
          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition ${
            activeTab === "text" ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Type size={16} /> Text
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "image" ? (
          <>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveAsset("background")}
                className={`flex-1 p-3 rounded-lg transition ${
                  activeAsset === "background" ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Background
              </button>
              <button
                onClick={() => setActiveAsset("character")}
                className={`flex-1 p-3 rounded-lg transition ${
                  activeAsset === "character" ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Character
              </button>
            </div>
            {renderAssetControls()}
          </>
        ) : (
          renderTextControls()
        )}
      </div>
    </div>
  );
};

export default RightPanel;