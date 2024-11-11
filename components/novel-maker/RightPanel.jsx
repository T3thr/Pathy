'use client';
import { useState } from 'react';
import styles from './RightPanel.module.css';

export default function RightPanel({
    backgroundPositionX, setBackgroundPositionX, backgroundPositionY, setBackgroundPositionY,
    characterPositionX, setCharacterPositionX, characterPositionY, setCharacterPositionY,
    backgroundWidth, setBackgroundWidth, backgroundHeight, setBackgroundHeight,
    characterWidth, setCharacterWidth, characterHeight, setCharacterHeight,
    flipped, setFlipped, textFrameSize, setTextFrameSize, fontSize, setFontSize,
    characterNameInput, setCharacterNameInput, setDialogue, clearImage,
    backgroundImage, setBackgroundImage, characterImage, setCharacterImage, characterName, setCharacterName
}) {
    const [activeTab, setActiveTab] = useState('image');
    const [activeImageTab, setActiveImageTab] = useState('background');
    const [text, setText] = useState('');

    const defaultScale = 500; // Default width/height for images (adjustable)
    const defaultPosition = { x: 0, y: 0 }; // Default position (centered)

    const handlePositionChange = (axis, value) => {
        if (activeImageTab === 'background') {
            axis === 'x' ? setBackgroundPositionX(value) : setBackgroundPositionY(value);
        } else {
            axis === 'x' ? setCharacterPositionX(value) : setCharacterPositionY(value);
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
        <div className={styles.rightPanel}>
            <h3>Editor Panel</h3>
            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'image' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('image')}
                >
                    Image Settings
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'text' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('text')}
                >
                    Text Settings
                </button>
            </div>

            {activeTab === 'image' && (
                <>
                    <div className={styles.imageTypeTabContainer}>
                        <button
                            className={`${styles.imageTypeTabButton} ${activeImageTab === 'background' ? styles.activeImageTab : ''}`}
                            onClick={() => setActiveImageTab('background')}
                        >
                            Background
                        </button>
                        <button
                            className={`${styles.imageTypeTabButton} ${activeImageTab === 'character' ? styles.activeImageTab : ''}`}
                            onClick={() => setActiveImageTab('character')}
                        >
                            Character
                        </button>
                    </div>

                    {activeImageTab === 'background' && (
                        <>
                            <label>Width:</label>
                            <input
                                type="number"
                                value={backgroundWidth}
                                onChange={(e) => setBackgroundWidth(parseInt(e.target.value))}
                            />
                            <label>Height:</label>
                            <input
                                type="number"
                                value={backgroundHeight}
                                onChange={(e) => setBackgroundHeight(parseInt(e.target.value))}
                            />
                            
                            {/* Apply Change Button */}
                            <button onClick={handleApplyChange} className={styles.applyButton}>
                                Apply Change
                            </button>

                            <label>
                                Position X:
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    step="1"
                                    value={backgroundPositionX}
                                    onChange={(e) => handlePositionChange('x', parseInt(e.target.value))}
                                />
                            </label>
                            <label>
                                Position Y:
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    step="1"
                                    value={backgroundPositionY}
                                    onChange={(e) => handlePositionChange('y', parseInt(e.target.value))}
                                />
                            </label>
                            <button onClick={() => clearImage('background')} className={styles.deleteButton}>
                                Delete Background Image
                            </button>

                            {/* Reset Scale and Position buttons */}
                            <button onClick={handleResetScale} className={styles.resetButton}>
                                Reset Scale
                            </button>
                            <button onClick={handleResetPosition} className={styles.resetButton}>
                                Reset Position
                            </button>
                        </>
                    )}

                    {activeImageTab === 'character' && (
                        <>
                            <label>Width:</label>
                            <input
                                type="number"
                                value={characterWidth}
                                onChange={(e) => setCharacterWidth(parseInt(e.target.value))}
                            />
                            <label>Height:</label>
                            <input
                                type="number"
                                value={characterHeight}
                                onChange={(e) => setCharacterHeight(parseInt(e.target.value))}
                            />
                            
                            {/* Apply Change Button */}
                            <button onClick={handleApplyChange} className={styles.applyButton}>
                                Apply Change
                            </button>

                            <label>
                                Position X:
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    step="1"
                                    value={characterPositionX}
                                    onChange={(e) => handlePositionChange('x', parseInt(e.target.value))}
                                />
                            </label>
                            <label>
                                Position Y:
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    step="1"
                                    value={characterPositionY}
                                    onChange={(e) => handlePositionChange('y', parseInt(e.target.value))}
                                />
                            </label>

                            <button onClick={() => clearImage('character')} className={styles.deleteButton}>
                                Delete Character Image
                            </button>

                            {/* Reset Scale and Position buttons */}
                            <button onClick={handleResetScale} className={styles.resetButton}>
                                Reset Scale
                            </button>
                            <button onClick={handleResetPosition} className={styles.resetButton}>
                                Reset Position
                            </button>
                        </>
                    )}
                </>
            )}

            {activeTab === 'text' && (
                <>
                    <label>Character Name:</label>
                    <input
                        type="text"
                        value={characterNameInput}
                        onChange={(e) => setCharacterNameInput(e.target.value)}
                        placeholder="Enter character name"
                    />
                    <button onClick={handleAddCharacterName} className={styles.addTextButton}>
                        Add Character Name
                    </button>

                    <label>Dialogue:</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter dialogue text here"
                    />
                    <button onClick={handleAddText} className={styles.addTextButton}>
                        Add Text
                    </button>
                </>
            )}
        </div>
    );
}
