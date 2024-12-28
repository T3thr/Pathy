import { useState, useCallback, useEffect, useRef } from "react";
import { 
  Sliders, Image, Type, RotateCw, Trash2, 
  RefreshCw, Move, Volume2, Eye, EyeOff,
  FlipHorizontal, ZoomIn, ZoomOut, Palette,
  AlignLeft, AlignCenter, AlignRight, Bold,
  Italic, Underline, List, Filter, Undo,
  Redo, Save, Copy, PlusCircle, Layers,
  MessageSquare, Settings, PlayCircle
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
import { toast } from "react-hot-toast";

const RightPanel = ({
  currentScene,
  onSceneUpdate,
  onAssetTransform,
  onDialogueUpdate,
  onHistoryUndo,
  onHistoryRedo,
  canUndo,
  canRedo,
  onAnimationAdd,
  onEffectAdd,
}) => {
  // Enhanced state management
  const [activeTab, setActiveTab] = useState("asset");
  const [activeAsset, setActiveAsset] = useState("background");
  const [dialogueInput, setDialogueInput] = useState("");
  const [characterNameInput, setCharacterNameInput] = useState("");
  const [dialogueState, setDialogueState] = useState({
    text: "",
    characterName: "",
    typewriterSpeed: 50,
    alignment: "left",
    styles: {
      bold: false,
      italic: false,
      underline: false,
      fontSize: 16,
      color: "#ffffff"
    }
  });
  
  // Enhanced transform controls
  const [transformState, setTransformState] = useState({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    opacity: 1,
    visible: true,
    flip: false
  });

  // Enhanced visual effects
  const [effectsState, setEffectsState] = useState({
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      sepia: 0,
      grayscale: 0
    },
    animation: {
      entrance: "none",
      duration: 1000,
      delay: 0,
      easing: "easeOut"
    }
  });

  // Sync with current scene
  useEffect(() => {
    if (currentScene) {
      const assetProps = currentScene[`${activeAsset}Props`] || {};
      const filters = currentScene[`${activeAsset}Filters`] || {};
      
      setTransformState({
        position: { 
          x: assetProps.x || 0, 
          y: assetProps.y || 0 
        },
        scale: assetProps.scale || 1,
        rotation: assetProps.rotation || 0,
        opacity: assetProps.opacity || 1,
        visible: assetProps.visible !== false,
        flip: assetProps.flip || false
      });

      setEffectsState(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          ...filters
        }
      }));

      setDialogueState({
        text: currentScene.dialogue || "",
        characterName: currentScene.characterName || "",
        typewriterSpeed: currentScene.typewriterSpeed || 50,
        alignment: currentScene.textStyles?.alignment || "left",
        styles: {
          ...currentScene.textStyles,
          fontSize: currentScene.textStyles?.fontSize || 16,
          color: currentScene.textStyles?.color || "#ffffff"
        }
      });
    }
  }, [currentScene, activeAsset]);

  // Enhanced handlers
  const handleTransformUpdate = useCallback((property, value) => {
    setTransformState(prev => {
      const newState = {
        ...prev,
        [property]: value
      };
      
      onAssetTransform(activeAsset, newState);
      return newState;
    });
  }, [activeAsset, onAssetTransform]);

  const handleEffectUpdate = useCallback((type, property, value) => {
    setEffectsState(prev => {
      const newState = {
        ...prev,
        [type]: {
          ...prev[type],
          [property]: value
        }
      };

      if (type === 'filters') {
        onSceneUpdate({
          ...currentScene,
          [`${activeAsset}Filters`]: newState.filters
        });
      } else if (type === 'animation') {
        onAnimationAdd(activeAsset, newState.animation);
      }

      return newState;
    });
  }, [activeAsset, currentScene, onSceneUpdate, onAnimationAdd]);

  const handleDialogueUpdate = useCallback((property, value) => {
    setDialogueState(prev => {
      const newState = {
        ...prev,
        [property]: value
      };

      onDialogueUpdate({
        dialogue: newState.text,
        characterName: newState.characterName,
        typewriterSpeed: newState.typewriterSpeed,
        textStyles: {
          alignment: newState.alignment,
          ...newState.styles
        }
      });

      return newState;
    });
  }, [onDialogueUpdate]);

  // Render asset controls
  const renderAssetControls = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onHistoryUndo}
            disabled={!canUndo}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onHistoryRedo}
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
                    value={[transformState.scale]}
                    onValueChange={([value]) => handleTransformUpdate("scale", value)}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1">Rotation</label>
                  <Slider
                    min={-180}
                    max={180}
                    value={[transformState.rotation]}
                    onValueChange={([value]) => handleTransformUpdate("rotation", value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm mb-1">Opacity</label>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[transformState.opacity]}
                  onValueChange={([value]) => handleTransformUpdate("opacity", value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="X Position"
                  value={transformState.position.x}
                  onChange={(e) => handleTransformUpdate("position", {
                    ...transformState.position,
                    x: Number(e.target.value)
                  })}
                />
                <Input
                  type="number"
                  placeholder="Y Position"
                  value={transformState.position.y}
                  onChange={(e) => handleTransformUpdate("position", {
                    ...transformState.position,
                    y: Number(e.target.value)
                  })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="effects">
          <AccordionTrigger>
            <Filter className="w-4 h-4 mr-2" /> Effects
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {Object.entries(effectsState.filters).map(([filter, value]) => (
                <div key={filter}>
                  <label className="text-sm mb-1 capitalize">{filter}</label>
                  <Slider
                    min={0}
                    max={filter === "blur" ? 20 : 200}
                    value={[value]}
                    onValueChange={([newValue]) => 
                      handleEffectUpdate("filters", filter, newValue)
                    }
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="animation">
          <AccordionTrigger>
            <PlayCircle className="w-4 h-4 mr-2" /> Animation
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Select
                value={effectsState.animation.entrance}
                onValueChange={(value) => 
                  handleEffectUpdate("animation", "entrance", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entrance animation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-2">
                <label className="text-sm">Duration (ms)</label>
                <Input
                  type="number"
                  value={effectsState.animation.duration}
                  onChange={(e) => 
                    handleEffectUpdate("animation", "duration", Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Delay (ms)</label>
                <Input
                  type="number"
                  value={effectsState.animation.delay}
                  onChange={(e) => 
                    handleEffectUpdate("animation", "delay", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="p-4 space-y-2 bg-var-background">
        <div className="flex justify-between bg-var-container text-var-foreground">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTransformUpdate("visible", !transformState.visible)}
          >
            {transformState.visible ? 
              <Eye className="w-4 h-4" /> : 
              <EyeOff className="w-4 h-4" />
            }
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTransformUpdate("flip", !transformState.flip)}
          >
            <FlipHorizontal className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              handleTransformUpdate("visible", false);
              toast.success(`${activeAsset} hidden`);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );

  // Render dialogue controls
  const renderDialogueControls = () => (
    <div className="fixed space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Character Name"
          value={dialogueState.characterName}
          onChange={(e) => handleDialogueUpdate("characterName", e.target.value)}
          className="bg-var-container"
        />
        
        <div className="flex gap-2">
          {["left", "center", "right"].map(align => (
            <Button
              key={align}
              variant={dialogueState.alignment === align ? "default" : "outline"}
              size="sm"
              onClick={() => handleDialogueUpdate("alignment", align)}
            >
              {align === "left" && <AlignLeft className="w-4 h-4" />}
              {align === "center" && <AlignCenter className="w-4 h-4" />}
              {align === "right" && <AlignRight className="w-4 h-4" />}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant={dialogueState.styles.bold ? "default" : "outline"}
            size="sm"
            onClick={() => handleDialogueUpdate("styles", {
              ...dialogueState.styles,
              bold: !dialogueState.styles.bold
            })}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant={dialogueState.styles.italic ? "default" : "outline"}
            size="sm"
            onClick={() => handleDialogueUpdate("styles", {
              ...dialogueState.styles,
              italic: !dialogueState.styles.italic
            })}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant={dialogueState.styles.underline ? "default" : "outline"}
            size="sm"
            onClick={() => handleDialogueUpdate("styles", {
              ...dialogueState.styles,
              underline: !dialogueState.styles.underline
            })}
          >
            <Underline className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Typewriter Speed (ms)</label>
        <Slider
          min={10}
          max={200}
          value={[dialogueState.typewriterSpeed]}
          onValueChange={([value]) => handleDialogueUpdate("typewriterSpeed", value)}
        />
      </div>

    <div className="space-y-2 mt-4">
    <label className="text-sm">Dialogue Text</label>
    <textarea
      className="w-full min-h-[100px] p-2 rounded-md bg-var-container resize-none"
      placeholder="Enter dialogue text..."
      value={dialogueState.text}
      onChange={(e) => handleDialogueUpdate("text", e.target.value)}
    />
    </div>

    <div className="space-y-2">
    <label className="text-sm">Text Color</label>
    <div className="flex gap-2">
      <Input
        type="color"
        value={dialogueState.styles.color}
        onChange={(e) => handleDialogueUpdate("styles", {
          ...dialogueState.styles,
          color: e.target.value
        })}
        className="w-12 h-8 p-1"
      />
      <Input
        type="text"
        value={dialogueState.styles.color}
        onChange={(e) => handleDialogueUpdate("styles", {
          ...dialogueState.styles,
          color: e.target.value
        })}
        className="flex-1"
      />
    </div>
    </div>

    <div className="space-y-2">
    <label className="text-sm">Font Size</label>
    <Slider
      min={12}
      max={32}
      value={[dialogueState.styles.fontSize]}
      onValueChange={([value]) => handleDialogueUpdate("styles", {
        ...dialogueState.styles,
        fontSize: value
      })}
    />
    <div className="text-xs text-muted-foreground text-right">
      {dialogueState.styles.fontSize}px
    </div>
    <Button 
  className="w-full"
  onClick={() => {
    onSceneUpdate({
      ...currentScene,
      dialogue: dialogueState.text,
      characterName: dialogueState.characterName,
      typewriterSpeed: dialogueState.typewriterSpeed,
      textStyles: {
        alignment: dialogueState.alignment,
        bold: dialogueState.styles.bold,
        italic: dialogueState.styles.italic,
        underline: dialogueState.styles.underline,
        fontSize: dialogueState.styles.fontSize,
        color: dialogueState.styles.color
      }
    });
    toast.success('Dialogue updated successfully');
  }}
>
  Update Dialogue
</Button>
    </div>
    </div>
    );
      // Render settings controls
      const renderSettingsControls = () => (
        <div className="fixed space-y-4 max-w-64">
          <Card className="p-4 bg-var-background text-var-foreground">
            <h3 className="text-sm font-medium mb-3">Scene Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-1 block">Scene Duration (ms)</label>
                <Input
                  type="number"
                  value={currentScene?.duration || 3000}
                  onChange={(e) => onSceneUpdate({
                    ...currentScene,
                    duration: Number(e.target.value)
                  })}
                  min={1000}
                  step={100}
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">Transition Effect</label>
                <Select
                  value={currentScene?.transition || "fade"}
                  onValueChange={(value) => onSceneUpdate({
                    ...currentScene,
                    transition: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="slide">Slide</SelectItem>
                    <SelectItem value="dissolve">Dissolve</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-1 block">Background Music</label>
                <div className="flex gap-2">
                  <Select
                    value={currentScene?.bgm || "none"}
                    onValueChange={(value) => onSceneUpdate({
                      ...currentScene,
                      bgm: value
                    })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="happy">Happy</SelectItem>
                      <SelectItem value="sad">Sad</SelectItem>
                      <SelectItem value="dramatic">Dramatic</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4  bg-var-background text-var-foreground">
            <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTransformState({
                    position: { x: 0, y: 0 },
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    visible: true,
                    flip: false
                  });
                  onAssetTransform(activeAsset, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    visible: true,
                    flip: false
                  });
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Transform
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEffectsState(prev => {
                    const resetFilters = {
                      brightness: 100,
                      contrast: 100,
                      saturation: 100,
                      blur: 0,
                      sepia: 0,
                      grayscale: 0
                    };
                    onSceneUpdate({
                      ...currentScene,
                      [`${activeAsset}Filters`]: resetFilters
                    });
                    return {
                      ...prev,
                      filters: resetFilters
                    };
                  });
                }}
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Reset Effects
              </Button>
            </div>
          </Card>
        </div>
      );

      return (
        <div className="fixed flex justify-center h-screen w-full bg-var-container border-l border-[var(--divider)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="asset" className="flex-1">
                <Layers className="w-4 h-4 mr-2" />
                Assets
              </TabsTrigger>
              <TabsTrigger value="dialogue" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                Dialogue
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList></div>

            <div className="p-4">
              <TabsContent value="asset">
                {renderAssetControls()}
              </TabsContent>
              <TabsContent value="dialogue">
                {renderDialogueControls()}
              </TabsContent>
              <TabsContent value="settings">
                {renderSettingsControls()}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      );
    };

export default RightPanel;