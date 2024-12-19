"use client";
import { useState, useCallback } from "react";
import { Sliders, Image, Type, RotateCw, Trash2, RefreshCw, Move } from "lucide-react";

export default function RightPanel({
    // Image properties
    backgroundPositionX, setBackgroundPositionX,
    backgroundPositionY, setBackgroundPositionY,
    characterPositionX, setCharacterPositionX,
    characterPositionY, setCharacterPositionY,
    backgroundWidth, setBackgroundWidth,
    backgroundHeight, setBackgroundHeight,
    characterWidth, setCharacterWidth,
    characterHeight, setCharacterHeight,
    backgroundRotation = 0, setBackgroundRotation,
    characterRotation = 0, setCharacterRotation,
    backgroundOpacity = 1, setBackgroundOpacity,
    characterOpacity = 1, setCharacterOpacity,
    // Text properties
    textFrameSize, setTextFrameSize,
    fontSize, setFontSize,
    textOpacity = 0.7, setTextOpacity,
    textColor = "#FFFFFF", setTextColor,
    characterNameInput, setCharacterNameInput,
    setDialogue, clearImage,
    characterName, setCharacterName
}) {
    const [activeTab, setActiveTab] = useState("image");
    const [activeImageTab, setActiveImageTab] = useState("background");
    const [text, setText] = useState("");
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

    // Constants for default values
    const DEFAULT_SCALE = 500;
    const DEFAULT_POSITION = { x: 0, y: 0 };
    const DEFAULT_ROTATION = 0;
    const DEFAULT_OPACITY = 1;

    // Memoized handlers for better performance
    const handlePositionChange = useCallback((axis, value, type) => {
        const setValue = type === "background" 
            ? (axis === "x" ? setBackgroundPositionX : setBackgroundPositionY)
            : (axis === "x" ? setCharacterPositionX : setCharacterPositionY);
        setValue(parseInt(value));
    }, [setBackgroundPositionX, setBackgroundPositionY, setCharacterPositionX, setCharacterPositionY]);

    const handleRotationChange = useCallback((value, type) => {
        const setRotation = type === "background" ? setBackgroundRotation : setCharacterRotation;
        setRotation(parseInt(value));
    }, [setBackgroundRotation, setCharacterRotation]);

    const handleOpacityChange = useCallback((value, type) => {
        const setOpacity = type === "background" ? setBackgroundOpacity : setCharacterOpacity;
        setOpacity(parseFloat(value));
    }, [setBackgroundOpacity, setCharacterOpacity]);

    const handleResetImage = useCallback((type) => {
        if (type === "background") {
            setBackgroundWidth(DEFAULT_SCALE);
            setBackgroundHeight(DEFAULT_SCALE);
            setBackgroundPositionX(DEFAULT_POSITION.x);
            setBackgroundPositionY(DEFAULT_POSITION.y);
            setBackgroundRotation(DEFAULT_ROTATION);
            setBackgroundOpacity(DEFAULT_OPACITY);
        } else {
            setCharacterWidth(DEFAULT_SCALE);
            setCharacterHeight(DEFAULT_SCALE);
            setCharacterPositionX(DEFAULT_POSITION.x);
            setCharacterPositionY(DEFAULT_POSITION.y);
            setCharacterRotation(DEFAULT_ROTATION);
            setCharacterOpacity(DEFAULT_OPACITY);
        }
    }, [
        setBackgroundWidth, setBackgroundHeight, setBackgroundPositionX, setBackgroundPositionY,
        setCharacterWidth, setCharacterHeight, setCharacterPositionX, setCharacterPositionY,
        setBackgroundRotation, setCharacterRotation, setBackgroundOpacity, setCharacterOpacity
    ]);

    const renderImageControls = (type) => {
        const isBackground = type === "background";
        const width = isBackground ? backgroundWidth : characterWidth;
        const height = isBackground ? backgroundHeight : characterHeight;
        const setWidth = isBackground ? setBackgroundWidth : setCharacterWidth;
        const setHeight = isBackground ? setBackgroundHeight : setCharacterHeight;
        const posX = isBackground ? backgroundPositionX : characterPositionX;
        const posY = isBackground ? backgroundPositionY : characterPositionY;
        const rotation = isBackground ? backgroundRotation : characterRotation;
        const opacity = isBackground ? backgroundOpacity : characterOpacity;

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Width</label>
                        <input
                            type="number"
                            className="w-full p-2 bg-gray-600 text-gray-200 rounded-lg"
                            value={width}
                            onChange={(e) => setWidth(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Height</label>
                        <input
                            type="number"
                            className="w-full p-2 bg-gray-600 text-gray-200 rounded-lg"
                            value={height}
                            onChange={(e) => setHeight(parseInt(e.target.value))}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">Position X</label>
                    <input
                        type="range"
                        min="-500"
                        max="500"
                        className="w-full"
                        value={posX}
                        onChange={(e) => handlePositionChange("x", e.target.value, type)}
                    />
                    <label className="block text-sm font-medium">Position Y</label>
                    <input
                        type="range"
                        min="-500"
                        max="500"
                        className="w-full"
                        value={posY}
                        onChange={(e) => handlePositionChange("y", e.target.value, type)}
                    />
                </div>

                {showAdvancedSettings && (
                    <>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Rotation</label>
                            <input
                                type="range"
                                min="-180"
                                max="180"
                                className="w-full"
                                value={rotation}
                                onChange={(e) => handleRotationChange(e.target.value, type)}
                            />
                            <label className="block text-sm font-medium">Opacity</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                className="w-full"
                                value={opacity}
                                onChange={(e) => handleOpacityChange(e.target.value, type)}
                            />
                        </div>
                    </>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={() => handleResetImage(type)}
                        className="flex items-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        <RefreshCw size={16} /> Reset All
                    </button>
                    <button
                        onClick={() => clearImage(type)}
                        className="flex items-center gap-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col p-5 bg-gray-800 rounded-lg shadow-md text-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Editor Panel</h3>
                <button
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    <Sliders size={16} />
                </button>
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition ${
                        activeTab === "image" ? "bg-blue-700" : "bg-gray-600 hover:bg-gray-500"
                    }`}
                    onClick={() => setActiveTab("image")}
                >
                    <Image size={16} /> Image
                </button>
                <button
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition ${
                        activeTab === "text" ? "bg-blue-700" : "bg-gray-600 hover:bg-gray-500"
                    }`}
                    onClick={() => setActiveTab("text")}
                >
                    <Type size={16} /> Text
                </button>
            </div>

            {activeTab === "image" && (
                <>
                    <div className="flex gap-2 mb-4">
                        <button
                            className={`flex-1 p-3 rounded-lg transition ${
                                activeImageTab === "background" ? "bg-blue-700" : "bg-gray-600 hover:bg-gray-500"
                            }`}
                            onClick={() => setActiveImageTab("background")}
                        >
                            Background
                        </button>
                        <button
                            className={`flex-1 p-3 rounded-lg transition ${
                                activeImageTab === "character" ? "bg-blue-700" : "bg-gray-600 hover:bg-gray-500"
                            }`}
                            onClick={() => setActiveImageTab("character")}
                        >
                            Character
                        </button>
                    </div>

                    {renderImageControls(activeImageTab)}
                </>
            )}

            {activeTab === "text" && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Text Frame Size</label>
                        <input
                            type="number"
                            className="w-full p-2 bg-gray-600 text-gray-200 rounded-lg"
                            value={textFrameSize}
                            onChange={(e) => setTextFrameSize(parseInt(e.target.value))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Font Size</label>
                        <input
                            type="number"
                            className="w-full p-2 bg-gray-600 text-gray-200 rounded-lg"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                        />
                    </div>

                    {showAdvancedSettings && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Text Color</label>
                                <input
                                    type="color"
                                    className="w-full p-1 bg-gray-600 rounded-lg"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Text Opacity</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    className="w-full"
                                    value={textOpacity}
                                    onChange={(e) => setTextOpacity(parseFloat(e.target.value))}
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Character Name</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-600 text-gray-200 rounded-lg"
                            value={characterNameInput}
                            onChange={(e) => setCharacterNameInput(e.target.value)}
                        />
                        <button
                            onClick={() => setCharacterName(characterNameInput)}
                            className="w-full mt-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Set Character Name
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Dialogue</label>
                        <textarea
                            className="w-full p-2 bg-gray-600 text-gray-200 rounded-lg"
                            rows="4"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <button
                            onClick={() => setDialogue(text)}
                            className="w-full mt-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Set Dialogue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}