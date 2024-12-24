import { useState, useCallback, useEffect, useRef } from "react";
import { 
  Sliders, Image, Type, RotateCw, Trash2, 
  RefreshCw, Move, Volume2, Eye, EyeOff,
  FlipHorizontal, ZoomIn, ZoomOut, Palette,
  AlignLeft, AlignCenter, AlignRight, Bold,
  Italic, Underline, List, Filter, Undo,
  Redo, Save, Copy, PlusCircle
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const RightPanel = ({
  currentScene,
  onSceneUpdate,
  onAssetPreview,
  onAssetHide,
  onHistoryUndo,
  onHistoryRedo,
  canUndo,
  canRedo
}) => {
  const [activeTab, setActiveTab] = useState("asset");
  const [activeAsset, setActiveAsset] = useState("background");
  const [dialogueInput, setDialogueInput] = useState("");
  const [characterNameInput, setCharacterNameInput] = useState("");
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  });
  const [textStyles, setTextStyles] = useState({
    alignment: "left",
    bold: false,
    italic: false,
    underline: false
  });
  
  const presetPositions = {
    center: { posX: 0, posY: 0 },
    left: { posX: -200, posY: 0 },
    right: { posX: 200, posY: 0 },
    custom: null
  };

  useEffect(() => {
    if (currentScene) {
      setDialogueInput(currentScene.dialogue || "");
      setCharacterNameInput(currentScene.characterName || "");
      setFilters(currentScene[`${activeAsset}Filters`] || {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0
      });
    }
  }, [currentScene, activeAsset]);

  const handleAssetUpdate = useCallback((property, value) => {
    if (!currentScene) return;
    const updates = {
      ...currentScene,
      [`${activeAsset}Props`]: {
        ...currentScene[`${activeAsset}Props`],
        [property]: value
      }
    };
    onSceneUpdate(updates);
  }, [currentScene, activeAsset, onSceneUpdate]);

  const handleFilterUpdate = useCallback((filter, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filter]: value };
      const updates = {
        ...currentScene,
        [`${activeAsset}Filters`]: newFilters
      };
      onSceneUpdate(updates);
      return newFilters;
    });
  }, [currentScene, activeAsset, onSceneUpdate]);

  const applyPresetPosition = (preset) => {
    if (!presetPositions[preset]) return;
    const { posX, posY } = presetPositions[preset];
    handleAssetUpdate("posX", posX);
    handleAssetUpdate("posY", posY);
  };

  const renderAssetControls = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onHistoryUndo()}
            disabled={!canUndo}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onHistoryRedo()}
            disabled={!canRedo}
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
        <Select 
          value={activeAsset} 
          onValueChange={setActiveAsset}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="background">Background</SelectItem>
            <SelectItem value="character">Character</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="transform">
          <AccordionTrigger>
            <Move className="w-4 h-4 mr-2" /> Transform
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1">Scale</label>
                  <Slider 
                    min={0.1}
                    max={2}
                    step={0.1}
                    value={[currentScene?.[`${activeAsset}Props`]?.scale || 1]}
                    onValueChange={([value]) => handleAssetUpdate("scale", value)}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1">Rotation</label>
                  <Slider
                    min={-180}
                    max={180}
                    value={[currentScene?.[`${activeAsset}Props`]?.rotation || 0]}
                    onValueChange={([value]) => handleAssetUpdate("rotation", value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm mb-1">Position Presets</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(presetPositions).map(preset => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPresetPosition(preset)}
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="filters">
          <AccordionTrigger>
            <Filter className="w-4 h-4 mr-2" /> Filters
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {Object.entries(filters).map(([filter, value]) => (
                <div key={filter}>
                  <label className="text-sm mb-1 capitalize">{filter}</label>
                  <Slider
                    min={filter === "blur" ? 0 : 0}
                    max={filter === "blur" ? 10 : 200}
                    value={[value]}
                    onValueChange={([newValue]) => handleFilterUpdate(filter, newValue)}
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="p-4 space-y-2">
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAssetUpdate("visible", !currentScene?.[`${activeAsset}Props`]?.visible)}
          >
            {currentScene?.[`${activeAsset}Props`]?.visible ? 
              <Eye className="w-4 h-4" /> : 
              <EyeOff className="w-4 h-4" />
            }
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAssetUpdate("flip", !currentScene?.[`${activeAsset}Props`]?.flip)}
          >
            <FlipHorizontal className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onAssetHide(activeAsset)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderDialogueControls = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Character Name"
          value={characterNameInput}
          onChange={(e) => setCharacterNameInput(e.target.value)}
        />
        <div className="flex gap-2">
          {["left", "center", "right"].map(align => (
            <Button
              key={align}
              variant={textStyles.alignment === align ? "default" : "outline"}
              size="sm"
              onClick={() => setTextStyles(prev => ({ ...prev, alignment: align }))}
            >
              {align === "left" && <AlignLeft className="w-4 h-4" />}
              {align === "center" && <AlignCenter className="w-4 h-4" />}
              {align === "right" && <AlignRight className="w-4 h-4" />}
            </Button>
          ))}
        </div>
      </div>

      <textarea
        className="w-full h-32 p-2 bg-gray-800 rounded-lg resize-none"
        placeholder="Enter dialogue..."
        value={dialogueInput}
        onChange={(e) => setDialogueInput(e.target.value)}
      />

      <div className="flex gap-2">
        <Button
          variant={textStyles.bold ? "default" : "outline"}
          size="sm"
          onClick={() => setTextStyles(prev => ({ ...prev, bold: !prev.bold }))}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant={textStyles.italic ? "default" : "outline"}
          size="sm"
          onClick={() => setTextStyles(prev => ({ ...prev, italic: !prev.italic }))}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant={textStyles.underline ? "default" : "outline"}
          size="sm"
          onClick={() => setTextStyles(prev => ({ ...prev, underline: !prev.underline }))}
        >
          <Underline className="w-4 h-4" />
        </Button>
      </div>

      <Button 
        className="w-full"
        onClick={() => {
          onSceneUpdate({
            ...currentScene,
            dialogue: dialogueInput,
            characterName: characterNameInput,
            textStyles
          });
        }}
      >
        Update Dialogue
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="p-4 border-b border-gray-700">
          <TabsList className="w-full">
            <TabsTrigger value="asset" className="flex-1">
              <Image className="w-4 h-4 mr-2" /> Assets
            </TabsTrigger>
            <TabsTrigger value="dialogue" className="flex-1">
              <Type className="w-4 h-4 mr-2" /> Dialogue
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="asset">
            {renderAssetControls()}
          </TabsContent>
          <TabsContent value="dialogue">
            {renderDialogueControls()}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default RightPanel;