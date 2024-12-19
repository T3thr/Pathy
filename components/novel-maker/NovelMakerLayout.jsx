'use client';
import { useState, useEffect, useCallback } from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import Canvas from './Canvas';

export default function NovelMakerLayout() {
    // Image and content states
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [characterImage, setCharacterImage] = useState(null);
    const [dialogue, setDialogue] = useState('');
    const [characterName, setCharacterName] = useState('');
    const [characterNameInput, setCharacterNameInput] = useState('');
    const [imageType, setImageType] = useState('background');

    // Background image properties
    const [backgroundPositionX, setBackgroundPositionX] = useState(0);
    const [backgroundPositionY, setBackgroundPositionY] = useState(0);
    const [backgroundWidth, setBackgroundWidth] = useState(500);
    const [backgroundHeight, setBackgroundHeight] = useState(500);
    const [backgroundRotation, setBackgroundRotation] = useState(0);
    const [backgroundOpacity, setBackgroundOpacity] = useState(1);

    // Character image properties
    const [characterPositionX, setCharacterPositionX] = useState(0);
    const [characterPositionY, setCharacterPositionY] = useState(0);
    const [characterWidth, setCharacterWidth] = useState(500);
    const [characterHeight, setCharacterHeight] = useState(500);
    const [characterRotation, setCharacterRotation] = useState(0);
    const [characterOpacity, setCharacterOpacity] = useState(1);

    // Text properties
    const [textFrameSize, setTextFrameSize] = useState(200);
    const [fontSize, setFontSize] = useState(16);
    const [textOpacity, setTextOpacity] = useState(0.7);
    const [textColor, setTextColor] = useState("#FFFFFF");

    // Load saved data from localStorage on mount
    useEffect(() => {
        const loadFromStorage = (key) => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        };

        // Load images and text content
        const savedData = {
            backgroundImage: loadFromStorage('backgroundImage'),
            characterImage: loadFromStorage('characterImage'),
            dialogue: loadFromStorage('dialogue') || '',
            characterName: loadFromStorage('characterName') || '',
            
            // Load image properties
            backgroundProps: loadFromStorage('backgroundProps'),
            characterProps: loadFromStorage('characterProps'),
            textProps: loadFromStorage('textProps'),
        };

        // Set states from saved data
        if (savedData.backgroundImage) setBackgroundImage(savedData.backgroundImage);
        if (savedData.characterImage) setCharacterImage(savedData.characterImage);
        if (savedData.dialogue) setDialogue(savedData.dialogue);
        if (savedData.characterName) setCharacterName(savedData.characterName);

        // Set image properties if they exist
        if (savedData.backgroundProps) {
            const { posX, posY, width, height, rotation, opacity } = savedData.backgroundProps;
            setBackgroundPositionX(posX ?? 0);
            setBackgroundPositionY(posY ?? 0);
            setBackgroundWidth(width ?? 500);
            setBackgroundHeight(height ?? 500);
            setBackgroundRotation(rotation ?? 0);
            setBackgroundOpacity(opacity ?? 1);
        }

        if (savedData.characterProps) {
            const { posX, posY, width, height, rotation, opacity } = savedData.characterProps;
            setCharacterPositionX(posX ?? 0);
            setCharacterPositionY(posY ?? 0);
            setCharacterWidth(width ?? 500);
            setCharacterHeight(height ?? 500);
            setCharacterRotation(rotation ?? 0);
            setCharacterOpacity(opacity ?? 1);
        }

        if (savedData.textProps) {
            const { frameSize, font, opacity, color } = savedData.textProps;
            setTextFrameSize(frameSize ?? 200);
            setFontSize(font ?? 16);
            setTextOpacity(opacity ?? 0.7);
            setTextColor(color ?? "#FFFFFF");
        }
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        const saveToStorage = (key, value) => {
            localStorage.setItem(key, JSON.stringify(value));
        };

        // Save images and text content
        if (backgroundImage) saveToStorage('backgroundImage', backgroundImage);
        if (characterImage) saveToStorage('characterImage', characterImage);
        if (dialogue) saveToStorage('dialogue', dialogue);
        if (characterName) saveToStorage('characterName', characterName);

        // Save image properties
        saveToStorage('backgroundProps', {
            posX: backgroundPositionX,
            posY: backgroundPositionY,
            width: backgroundWidth,
            height: backgroundHeight,
            rotation: backgroundRotation,
            opacity: backgroundOpacity
        });

        saveToStorage('characterProps', {
            posX: characterPositionX,
            posY: characterPositionY,
            width: characterWidth,
            height: characterHeight,
            rotation: characterRotation,
            opacity: characterOpacity
        });

        saveToStorage('textProps', {
            frameSize: textFrameSize,
            font: fontSize,
            opacity: textOpacity,
            color: textColor
        });
    }, [
        backgroundImage, characterImage, dialogue, characterName,
        backgroundPositionX, backgroundPositionY, backgroundWidth, backgroundHeight,
        backgroundRotation, backgroundOpacity,
        characterPositionX, characterPositionY, characterWidth, characterHeight,
        characterRotation, characterOpacity,
        textFrameSize, fontSize, textOpacity, textColor
    ]);

    // Handle image upload
    const handleImageUpload = useCallback((file, type) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'background') {
                setBackgroundImage(reader.result);
            } else if (type === 'character') {
                setCharacterImage(reader.result);
            }
        };
        reader.readAsDataURL(file);
    }, []);

    // Handle image clearing
    const clearImage = useCallback((type) => {
        if (type === 'background') {
            setBackgroundImage(null);
            localStorage.removeItem('backgroundImage');
            localStorage.removeItem('backgroundProps');
        } else if (type === 'character') {
            setCharacterImage(null);
            localStorage.removeItem('characterImage');
            localStorage.removeItem('characterProps');
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-900">
            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-4 p-4 flex-grow">
                {/* Left Panel */}
                <div className="w-full lg:w-1/4">
                    <LeftPanel
                        onImageUpload={handleImageUpload}
                        imageType={imageType}
                        setImageType={setImageType}
                    />
                </div>

                {/* Canvas */}
                <div className="w-full lg:w-2/4 flex items-center justify-center">
                    <Canvas
                        backgroundImage={backgroundImage}
                        characterImage={characterImage}
                        dialogue={dialogue}
                        characterName={characterName}
                        backgroundPositionX={backgroundPositionX}
                        backgroundPositionY={backgroundPositionY}
                        characterPositionX={characterPositionX}
                        characterPositionY={characterPositionY}
                        backgroundWidth={backgroundWidth}
                        backgroundHeight={backgroundHeight}
                        characterWidth={characterWidth}
                        characterHeight={characterHeight}
                        backgroundRotation={backgroundRotation}
                        characterRotation={characterRotation}
                        backgroundOpacity={backgroundOpacity}
                        characterOpacity={characterOpacity}
                        textFrameSize={textFrameSize}
                        fontSize={fontSize}
                        textOpacity={textOpacity}
                        textColor={textColor}
                    />
                </div>

                {/* Right Panel */}
                <div className="w-full lg:w-1/4">
                    <RightPanel
                        backgroundPositionX={backgroundPositionX}
                        setBackgroundPositionX={setBackgroundPositionX}
                        backgroundPositionY={backgroundPositionY}
                        setBackgroundPositionY={setBackgroundPositionY}
                        characterPositionX={characterPositionX}
                        setCharacterPositionX={setCharacterPositionX}
                        characterPositionY={characterPositionY}
                        setCharacterPositionY={setCharacterPositionY}
                        backgroundWidth={backgroundWidth}
                        setBackgroundWidth={setBackgroundWidth}
                        backgroundHeight={backgroundHeight}
                        setBackgroundHeight={setBackgroundHeight}
                        characterWidth={characterWidth}
                        setCharacterWidth={setCharacterWidth}
                        characterHeight={characterHeight}
                        setCharacterHeight={setCharacterHeight}
                        backgroundRotation={backgroundRotation}
                        setBackgroundRotation={setBackgroundRotation}
                        characterRotation={characterRotation}
                        setCharacterRotation={setCharacterRotation}
                        backgroundOpacity={backgroundOpacity}
                        setBackgroundOpacity={setBackgroundOpacity}
                        characterOpacity={characterOpacity}
                        setCharacterOpacity={setCharacterOpacity}
                        textFrameSize={textFrameSize}
                        setTextFrameSize={setTextFrameSize}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        textOpacity={textOpacity}
                        setTextOpacity={setTextOpacity}
                        textColor={textColor}
                        setTextColor={setTextColor}
                        characterNameInput={characterNameInput}
                        setCharacterNameInput={setCharacterNameInput}
                        setDialogue={setDialogue}
                        clearImage={clearImage}
                        characterName={characterName}
                        setCharacterName={setCharacterName}
                    />
                </div>
            </div>
        </div>
    );
}