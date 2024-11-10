'use client'
import { useState } from 'react';
import styles from './RightPanel.module.css';

export default function RightPanel({
    backgroundZoom, setBackgroundZoom, backgroundPositionX, setBackgroundPositionX, backgroundPositionY, setBackgroundPositionY,
    characterZoom, setCharacterZoom, characterPositionX, setCharacterPositionX, characterPositionY, setCharacterPositionY,
    flipped, setFlipped, textFrameSize, setTextFrameSize, fontSize, setFontSize, clearImage
}) {
    const [activeTab, setActiveTab] = useState('image');
    const [activeImageTab, setActiveImageTab] = useState('background');

    return (
        <div className={styles.rightPanel}>
            <h3>Editor Panel</h3>
            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'image' && styles.activeTab}`}
                    onClick={() => setActiveTab('image')}
                >
                    Image Settings
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'text' && styles.activeTab}`}
                    onClick={() => setActiveTab('text')}
                >
                    Text Settings
                </button>
            </div>

            {activeTab === 'image' && (
                <>
                    <div className={styles.imageTypeTabContainer}>
                        <button
                            className={`${styles.imageTypeTabButton} ${activeImageTab === 'background' && styles.activeImageTab}`}
                            onClick={() => setActiveImageTab('background')}
                        >
                            Background
                        </button>
                        <button
                            className={`${styles.imageTypeTabButton} ${activeImageTab === 'character' && styles.activeImageTab}`}
                            onClick={() => setActiveImageTab('character')}
                        >
                            Character
                        </button>
                    </div>

                    {activeImageTab === 'background' && (
                        <>
                            <label>
                                Zoom:
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={backgroundZoom}
                                    onChange={(e) => setBackgroundZoom(parseFloat(e.target.value))}
                                />
                            </label>
                            <button onClick={() => clearImage('background')} className={styles.deleteButton}>
                                Delete Background Image
                            </button>
                            <label>
                                Position X:
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    step="1"
                                    value={backgroundPositionX}
                                    onChange={(e) => setBackgroundPositionX(parseInt(e.target.value))}
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
                                    onChange={(e) => setBackgroundPositionY(parseInt(e.target.value))}
                                />
                            </label>
                        </>
                    )}

                    {activeImageTab === 'character' && (
                        <>
                            <label>
                                Zoom:
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={characterZoom}
                                    onChange={(e) => setCharacterZoom(parseFloat(e.target.value))}
                                />
                            </label>
                            <button onClick={() => clearImage('character')} className={styles.deleteButton}>
                                Delete Character Image
                            </button>
                            <label>
                                Position X:
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    step="1"
                                    value={characterPositionX}
                                    onChange={(e) => setCharacterPositionX(parseInt(e.target.value))}
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
                                    onChange={(e) => setCharacterPositionY(parseInt(e.target.value))}
                                />
                            </label>
                        </>
                    )}
                </>
            )}

            {activeTab === 'text' && (
                <>
                    <label>
                        Text Frame Size:
                        <input
                            type="range"
                            min="100"
                            max="400"
                            step="10"
                            value={textFrameSize}
                            onChange={(e) => setTextFrameSize(parseInt(e.target.value))}
                        />
                    </label>
                    <label>
                        Font Size:
                        <input
                            type="range"
                            min="12"
                            max="36"
                            step="1"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                        />
                    </label>
                </>
            )}
        </div>
    );
}
