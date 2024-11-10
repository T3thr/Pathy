'use client';
import { useState, useEffect } from 'react';
import TopToolbar from './TopToolbar';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import Canvas from './Canvas';
import styles from './NovelMakerLayout.module.css';

export default function NovelMakerLayout() {
    const [backgroundImage, setBackgroundImage] = useState(localStorage.getItem('backgroundImage') || null);
    const [characterImage, setCharacterImage] = useState(localStorage.getItem('characterImage') || null);
    const [dialogue, setDialogue] = useState(localStorage.getItem('dialogue') || '');
    const [characterName, setCharacterName] = useState(localStorage.getItem('characterName') || '');
    const [backgroundZoom, setBackgroundZoom] = useState(1);
    const [backgroundPositionX, setBackgroundPositionX] = useState(0);
    const [backgroundPositionY, setBackgroundPositionY] = useState(0);
    const [characterZoom, setCharacterZoom] = useState(1);
    const [characterPositionX, setCharacterPositionX] = useState(0);
    const [characterPositionY, setCharacterPositionY] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [textFrameSize, setTextFrameSize] = useState(200);
    const [fontSize, setFontSize] = useState(16);

    useEffect(() => {
        // Load data from localStorage when the component mounts
        const savedDialogue = localStorage.getItem('dialogue');
        if (savedDialogue) setDialogue(savedDialogue);

        const savedCharacterName = localStorage.getItem('characterName');
        if (savedCharacterName) setCharacterName(savedCharacterName);

        const savedBackgroundImage = localStorage.getItem('backgroundImage');
        if (savedBackgroundImage) setBackgroundImage(savedBackgroundImage);

        const savedCharacterImage = localStorage.getItem('characterImage');
        if (savedCharacterImage) setCharacterImage(savedCharacterImage);
    }, []);

    useEffect(() => {
        // Update localStorage whenever images or dialogue change
        if (backgroundImage) localStorage.setItem('backgroundImage', backgroundImage);
        if (characterImage) localStorage.setItem('characterImage', characterImage);
        if (dialogue) localStorage.setItem('dialogue', dialogue);
        if (characterName) localStorage.setItem('characterName', characterName);
    }, [backgroundImage, characterImage, dialogue, characterName]);

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

    return (
        <div className={styles.layout}>
            <div className={styles.topToolbar}>
                <TopToolbar />
            </div>
            <div className={styles.container}>
                <div className={styles.leftPanel}>
                    <LeftPanel
                        onImageUpload={handleImageUpload}
                        setDialogue={setDialogue}
                        setCharacterName={setCharacterName}
                        characterName={characterName} // Pass characterName
                        dialogue={dialogue} // Pass dialogue
                    />
                </div>

                <div className={styles.rightPanel}>
                    <RightPanel
                        backgroundZoom={backgroundZoom}
                        setBackgroundZoom={setBackgroundZoom}
                        backgroundPositionX={backgroundPositionX}
                        setBackgroundPositionX={setBackgroundPositionX}
                        backgroundPositionY={backgroundPositionY}
                        setBackgroundPositionY={setBackgroundPositionY}
                        characterZoom={characterZoom}
                        setCharacterZoom={setCharacterZoom}
                        characterPositionX={characterPositionX}
                        setCharacterPositionX={setCharacterPositionX}
                        characterPositionY={characterPositionY}
                        setCharacterPositionY={setCharacterPositionY}
                        flipped={flipped}
                        setFlipped={setFlipped}
                        textFrameSize={textFrameSize}
                        setTextFrameSize={setTextFrameSize}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                    />
                </div>

                <div className={styles.canvas}>
                    <Canvas
                        backgroundImage={backgroundImage}
                        characterImage={characterImage}
                        dialogue={dialogue}
                        characterName={characterName}
                        backgroundZoom={backgroundZoom}
                        backgroundPositionX={backgroundPositionX}
                        backgroundPositionY={backgroundPositionY}
                        characterZoom={characterZoom}
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
