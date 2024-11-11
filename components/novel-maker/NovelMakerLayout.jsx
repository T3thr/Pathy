'use client';
import { useState, useEffect } from 'react';
import TopToolbar from './TopToolbar';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import Canvas from './Canvas';
import styles from './NovelMakerLayout.module.css';

export default function NovelMakerLayout() {
    // State to manage images, dialogue, and character data
    const [backgroundImage, setBackgroundImage] = useState(localStorage.getItem('backgroundImage') || null);
    const [characterImage, setCharacterImage] = useState(localStorage.getItem('characterImage') || null);
    const [dialogue, setDialogue] = useState(localStorage.getItem('dialogue') || '');
    const [characterName, setCharacterName] = useState(localStorage.getItem('characterName') || '');

    // States for image properties
    const [backgroundPositionX, setBackgroundPositionX] = useState(0);
    const [backgroundPositionY, setBackgroundPositionY] = useState(0);
    const [backgroundWidth, setBackgroundWidth] = useState(100);
    const [backgroundHeight, setBackgroundHeight] = useState(100);

    const [characterPositionX, setCharacterPositionX] = useState(0);
    const [characterPositionY, setCharacterPositionY] = useState(0);
    const [characterWidth, setCharacterWidth] = useState(100);
    const [characterHeight, setCharacterHeight] = useState(100);

    const [flipped, setFlipped] = useState(false);
    const [textFrameSize, setTextFrameSize] = useState(200);
    const [fontSize, setFontSize] = useState(16);
    const [imageType, setImageType] = useState('background');
    const [characterNameInput, setCharacterNameInput] = useState('');

    // Default scale and position values
    const defaultScale = 500;
    const defaultPosition = { x: 0, y: 0 };

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedDialogue = localStorage.getItem('dialogue');
        if (savedDialogue) setDialogue(savedDialogue);

        const savedCharacterName = localStorage.getItem('characterName');
        if (savedCharacterName) setCharacterName(savedCharacterName);

        const savedBackgroundImage = localStorage.getItem('backgroundImage');
        if (savedBackgroundImage) setBackgroundImage(savedBackgroundImage);

        const savedCharacterImage = localStorage.getItem('characterImage');
        if (savedCharacterImage) setCharacterImage(savedCharacterImage);
    }, []);

    // Update localStorage whenever data changes
    useEffect(() => {
        if (backgroundImage) localStorage.setItem('backgroundImage', backgroundImage);
        if (characterImage) localStorage.setItem('characterImage', characterImage);
        if (dialogue) localStorage.setItem('dialogue', dialogue);
        if (characterName) localStorage.setItem('characterName', characterName);
    }, [backgroundImage, characterImage, dialogue, characterName]);

    // Handle image file upload
    const handleImageUpload = (file, type) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'background') {
                setBackgroundImage(reader.result);
            } else if (type === 'character') {
                setCharacterImage(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    // Clear image from localStorage and state
    const clearImage = (type) => {
        if (type === 'background') {
            setBackgroundImage(null);
            localStorage.removeItem('backgroundImage');
        }
        if (type === 'character') {
            setCharacterImage(null);
            localStorage.removeItem('characterImage');
        }
    };

    // Handle adding text for dialogue or character name
    const handleAddText = () => {
        setDialogue(dialogue);
    };

    const handleAddCharacterName = () => {
        setCharacterName(characterNameInput); // Set character name as dialogue for display
    };

    // Position change handler
    const handlePositionChange = (axis, value) => {
        if (imageType === 'background') {
            axis === 'x' ? setBackgroundPositionX(value) : setBackgroundPositionY(value);
        } else {
            axis === 'x' ? setCharacterPositionX(value) : setCharacterPositionY(value);
        }
    };

    // Reset scale handler
    const handleResetScale = () => {
        setBackgroundWidth(defaultScale);
        setBackgroundHeight(defaultScale);
        setCharacterWidth(defaultScale);
        setCharacterHeight(defaultScale);
    };

    // Reset position handler
    const handleResetPosition = () => {
        setBackgroundPositionX(defaultPosition.x);
        setBackgroundPositionY(defaultPosition.y);
        setCharacterPositionX(defaultPosition.x);
        setCharacterPositionY(defaultPosition.y);
    };

    return (
        <div className={styles.layout}>
            {/* Top Toolbar */}
            <div className={styles.topToolbar}>
                <TopToolbar />
            </div>

            {/* Main Content Layout */}
            <div className={styles.container}>
                {/* Left Panel for Image Uploads */}
                <div className={styles.leftPanel}>
                    <LeftPanel
                        onImageUpload={handleImageUpload}
                        imageType={imageType}
                        setImageType={setImageType}
                    />
                </div>

                {/* Right Panel for Image & Text Customization */}
                <div className={styles.rightPanel}>
                    <RightPanel
                        backgroundPositionX={backgroundPositionX}
                        setBackgroundPositionX={setBackgroundPositionX}
                        backgroundPositionY={backgroundPositionY}
                        setBackgroundPositionY={setBackgroundPositionY}
                        backgroundWidth={backgroundWidth}
                        setBackgroundWidth={setBackgroundWidth}
                        backgroundHeight={backgroundHeight}
                        setBackgroundHeight={setBackgroundHeight}
                        characterPositionX={characterPositionX}
                        setCharacterPositionX={setCharacterPositionX}
                        characterPositionY={characterPositionY}
                        setCharacterPositionY={setCharacterPositionY}
                        characterWidth={characterWidth}
                        setCharacterWidth={setCharacterWidth}
                        characterHeight={characterHeight}
                        setCharacterHeight={setCharacterHeight}
                        flipped={flipped}
                        setFlipped={setFlipped}
                        textFrameSize={textFrameSize}
                        setTextFrameSize={setTextFrameSize}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        characterNameInput={characterNameInput}
                        setCharacterNameInput={setCharacterNameInput}
                        setCharacterName={setCharacterName}
                        setDialogue={setDialogue}
                        clearImage={clearImage}
                        handlePositionChange={handlePositionChange}
                        handleResetScale={handleResetScale}
                        handleResetPosition={handleResetPosition}
                    />
                </div>

                {/* Canvas for Previewing Changes */}
                <div className={styles.canvas}>
                    <Canvas
                        backgroundImage={backgroundImage}
                        characterImage={characterImage}
                        dialogue={dialogue}
                        characterName={characterName}
                        backgroundPositionX={backgroundPositionX}
                        backgroundPositionY={backgroundPositionY}
                        characterPositionX={characterPositionX}
                        characterPositionY={characterPositionY}
                        flipped={flipped}
                        textFrameSize={textFrameSize}
                        fontSize={fontSize}
                    />
                </div>
            </div>
        </div>
    );
}
