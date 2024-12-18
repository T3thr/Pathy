"use client";
import { useState } from "react";

export default function RightPanel({
    backgroundPositionX, setBackgroundPositionX, backgroundPositionY, setBackgroundPositionY,
    characterPositionX, setCharacterPositionX, characterPositionY, setCharacterPositionY,
    backgroundWidth, setBackgroundWidth, backgroundHeight, setBackgroundHeight,
    characterWidth, setCharacterWidth, characterHeight, setCharacterHeight,
    flipped, setFlipped, textFrameSize, setTextFrameSize, fontSize, setFontSize,
    characterNameInput, setCharacterNameInput, setDialogue, clearImage,
    backgroundImage, setBackgroundImage, characterImage, setCharacterImage, characterName, setCharacterName
}) {
    const [activeTab, setActiveTab] = useState("image");
    const [activeImageTab, setActiveImageTab] = useState("background");
    const [text, setText] = useState("");

    const defaultScale = 500; // Default width/height for images (adjustable)
    const defaultPosition = { x: 0, y: 0 }; // Default position (centered)

    const handlePositionChange = (axis, value) => {
        if (activeImageTab === "background") {
            axis === "x" ? setBackgroundPositionX(value) : setBackgroundPositionY(value);
        } else {
            axis === "x" ? setCharacterPositionX(value) : setCharacterPositionY(value);
        }
    };

    const handleAddText = () => {
        setDialogue(text); // Set the dialogue text only
    };

    const handleAddCharacterName = () => {
        setCharacterName(characterNameInput); // Set character name text for display
    };

    const handleResetScale = () => {
        // Reset the scale of the images to the default values
        setBackgroundWidth(defaultScale);
        setBackgroundHeight(defaultScale);
        setCharacterWidth(defaultScale);
        setCharacterHeight(defaultScale);
    };

    const handleResetPosition = () => {
        // Reset the position of the images to the default values (centered)
        setBackgroundPositionX(defaultPosition.x);
        setBackgroundPositionY(defaultPosition.y);
        setCharacterPositionX(defaultPosition.x);
        setCharacterPositionY(defaultPosition.y);
    };

    const handleApplyChange = () => {
        // The scale values are applied when the Apply Change button is clicked
        // For now, values are already bound to the state, so no extra action is needed here
    };

    return (
        <div className="flex flex-col p-5 bg-light-primary dark:bg-dark-primary rounded-lg shadow-md text-light-onPrimary dark:text-dark-onPrimary font-sans">
            <h3 className="text-lg font-bold mb-4">Editor Panel</h3>
            <div className="flex justify-between mb-4">
                <button
                    className={`flex-1 p-3 text-base rounded-lg transition transform border-2 ${activeTab === "image" ? "bg-blue-700 border-red-500 scale-105" : "bg-gray-500 border-gray-400 hover:bg-gray-400 hover:scale-102"}`}
                    onClick={() => setActiveTab("image")}
                >
                    Image Settings
                </button>
                <button
                    className={`flex-1 p-3 text-base rounded-lg transition transform border-2 ${activeTab === "text" ? "bg-blue-700 border-red-500 scale-105" : "bg-gray-500 border-gray-400 hover:bg-gray-400 hover:scale-102"}`}
                    onClick={() => setActiveTab("text")}
                >
                    Text Settings
                </button>
            </div>

            {activeTab === "image" && (
                <>
                    <div className="flex justify-between mb-4">
                        <button
                            className={`flex-1 p-3 text-base rounded-lg transition transform ${activeImageTab === "background" ? "bg-blue-700 scale-105" : "bg-gray-500 hover:bg-gray-400 hover:scale-102"}`}
                            onClick={() => setActiveImageTab("background")}
                        >
                            Background
                        </button>
                        <button
                            className={`flex-1 p-3 text-base rounded-lg transition transform ${activeImageTab === "character" ? "bg-blue-700 scale-105" : "bg-gray-500 hover:bg-gray-400 hover:scale-102"}`}
                            onClick={() => setActiveImageTab("character")}
                        >
                            Character
                        </button>
                    </div>

                    {activeImageTab === "background" && (
                        <>
                            <label>Width:</label>
                            <input
                                type="number"
                                className="p-2 mb-2 bg-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={backgroundWidth}
                                onChange={(e) => setBackgroundWidth(parseInt(e.target.value))}
                            />
                            <label>Height:</label>
                            <input
                                type="number"
                                className="p-2 mb-2 bg-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={backgroundHeight}
                                onChange={(e) => setBackgroundHeight(parseInt(e.target.value))}
                            />

                            <button onClick={handleApplyChange} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4">
                                Apply Change
                            </button>

                            <label>Position X:</label>
                            <input
                                type="range"
                                min="-100"
                                max="100"
                                step="1"
                                className="w-full mb-4"
                                value={backgroundPositionX}
                                onChange={(e) => handlePositionChange("x", parseInt(e.target.value))}
                            />
                            <label>Position Y:</label>
                            <input
                                type="range"
                                min="-100"
                                max="100"
                                step="1"
                                className="w-full mb-4"
                                value={backgroundPositionY}
                                onChange={(e) => handlePositionChange("y", parseInt(e.target.value))}
                            />
                            <button onClick={() => clearImage("background")} className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 mb-4">
                                Delete Background Image
                            </button>

                            <button onClick={handleResetScale} className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4">
                                Reset Scale
                            </button>
                            <button onClick={handleResetPosition} className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4">
                                Reset Position
                            </button>
                        </>
                    )}

                    {activeImageTab === "character" && (
                        <>
                            <label>Width:</label>
                            <input
                                type="number"
                                className="p-2 mb-2 bg-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={characterWidth}
                                onChange={(e) => setCharacterWidth(parseInt(e.target.value))}
                            />
                            <label>Height:</label>
                            <input
                                type="number"
                                className="p-2 mb-2 bg-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={characterHeight}
                                onChange={(e) => setCharacterHeight(parseInt(e.target.value))}
                            />

                            <button onClick={handleApplyChange} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4">
                                Apply Change
                            </button>

                            <label>Position X:</label>
                            <input
                                type="range"
                                min="-100"
                                max="100"
                                step="1"
                                className="w-full mb-4"
                                value={characterPositionX}
                                onChange={(e) => handlePositionChange("x", parseInt(e.target.value))}
                            />
                            <label>Position Y:</label>
                            <input
                                type="range"
                                min="-100"
                                max="100"
                                step="1"
                                className="w-full mb-4"
                                value={characterPositionY}
                                onChange={(e) => handlePositionChange("y", parseInt(e.target.value))}
                            />

                            <button onClick={() => clearImage("character")} className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 mb-4">
                                Delete Character Image
                            </button>

                            <button onClick={handleResetScale} className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4">
                                Reset Scale
                            </button>
                            <button onClick={handleResetPosition} className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4">
                                Reset Position
                            </button>
                        </>
                    )}
                </>
            )}

            {activeTab === "text" && (
                <>
                    <label>Frame Size:</label>
                    <input
                        type="number"
                        className="p-2 mb-2 bg-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={textFrameSize}
                        onChange={(e) => setTextFrameSize(parseInt(e.target.value))}
                    />

                    <label>Font Size:</label>
                    <input
                        type="number"
                        className="p-2 mb-2 bg-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                    />

                    <label>Character Name:</label>
                    <input
                        type="text"
                        className="p-2 mb-2 bg-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={characterNameInput}
                        onChange={(e) => setCharacterNameInput(e.target.value)}
                    />
                    <button onClick={handleAddCharacterName} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4">
                        Add Character Name
                    </button>

                    <label>Text:</label>
                    <textarea
                        className="p-2 mb-2 bg-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows="4"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button onClick={handleAddText} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4">
                        Add Text
                    </button>
                </>
            )}
        </div>
    );
}
