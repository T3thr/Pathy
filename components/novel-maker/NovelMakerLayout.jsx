'use client';

import { useState, useEffect, useCallback } from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import Canvas from './Canvas';

export default function NovelMakerLayout() {
    // States for managing images and properties
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [characterImage, setCharacterImage] = useState(null);
    const [dialogue, setDialogue] = useState('');
    const [characterName, setCharacterName] = useState('');
    const [characterNameInput, setCharacterNameInput] = useState('');
    const [imageType, setImageType] = useState('background');

    // States for background properties
    const [backgroundProps, setBackgroundProps] = useState({
        posX: 0,
        posY: 0,
        width: 500,
        height: 500,
        rotation: 0,
        opacity: 1,
    });

    // States for character properties
    const [characterProps, setCharacterProps] = useState({
        posX: 0,
        posY: 0,
        width: 500,
        height: 500,
        rotation: 0,
        opacity: 1,
    });

    // States for text properties
    const [textProps, setTextProps] = useState({
        frameSize: 200,
        fontSize: 16,
        opacity: 0.7,
        color: '#FFFFFF',
    });

    // Load saved data from localStorage
    useEffect(() => {
        try {
            const loadFromStorage = (key) => {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            };

            setBackgroundImage(loadFromStorage('backgroundImage'));
            setCharacterImage(loadFromStorage('characterImage'));
            setDialogue(loadFromStorage('dialogue') || '');
            setCharacterName(loadFromStorage('characterName') || '');
            setBackgroundProps(loadFromStorage('backgroundProps') || backgroundProps);
            setCharacterProps(loadFromStorage('characterProps') || characterProps);
            setTextProps(loadFromStorage('textProps') || textProps);
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
        }
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        try {
            const saveToStorage = (key, value) => {
                localStorage.setItem(key, JSON.stringify(value));
            };

            saveToStorage('backgroundImage', backgroundImage);
            saveToStorage('characterImage', characterImage);
            saveToStorage('dialogue', dialogue);
            saveToStorage('characterName', characterName);
            saveToStorage('backgroundProps', backgroundProps);
            saveToStorage('characterProps', characterProps);
            saveToStorage('textProps', textProps);
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    }, [backgroundImage, characterImage, dialogue, characterName, backgroundProps, characterProps, textProps]);

    // Handle image upload
    const handleImageUpload = useCallback((file, type) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'background') setBackgroundImage(reader.result);
            if (type === 'character') setCharacterImage(reader.result);
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
                        backgroundProps={backgroundProps}
                        characterProps={characterProps}
                        textProps={textProps}
                    />
                </div>

                {/* Right Panel */}
                <div className="w-full lg:w-1/4">
                    <RightPanel
                        backgroundProps={backgroundProps}
                        setBackgroundProps={setBackgroundProps}
                        characterProps={characterProps}
                        setCharacterProps={setCharacterProps}
                        textProps={textProps}
                        setTextProps={setTextProps}
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
