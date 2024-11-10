'use client';
import { useRef, useState, useEffect } from 'react';
import styles from './LeftPanel.module.css';

export default function LeftPanel({ onImageUpload, setDialogue, setCharacterName, imageType, setImageType }) {
    const fileInputRef = useRef(null);
    const [text, setText] = useState(localStorage.getItem('dialogue') || '');
    const [characterNameInput, setCharacterNameInput] = useState('');
    const [activeTab, setActiveTab] = useState('background');

    useEffect(() => {
        localStorage.setItem('dialogue', text);
        setDialogue(text);
    }, [text, setDialogue]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                onImageUpload(file, activeTab);
            } else {
                alert('Please upload a valid image file.');
            }
        }
    };

    const handleAddText = () => {
        setDialogue(text);
        setCharacterName(characterNameInput);
    };

    return (
        <div className={styles.leftPanel}>
            <h3>Assets Manager</h3>
            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'background' ? styles.activeTab : ''}`}
                    onClick={() => { setActiveTab('background'); setImageType('background'); }}
                >
                    Background
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'character' ? styles.activeTab : ''}`}
                    onClick={() => { setActiveTab('character'); setImageType('character'); }}
                >
                    Character
                </button>
            </div>
            <button onClick={() => fileInputRef.current.click()} className={styles.uploadButton}>
                Upload {activeTab} Image
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*"
            />
            <label className={styles.label}>Character Name:</label>
            <input
                type="text"
                className={styles.textInput}
                value={characterNameInput}
                onChange={(e) => setCharacterNameInput(e.target.value)}
                placeholder="Enter character name"
            />
            <button onClick={handleAddText} className={styles.addTextButton}>
                Add Character Name
            </button>
            <label className={styles.label}>Dialogue:</label>
            <textarea
                className={styles.textArea}
                placeholder="Enter dialogue text here"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleAddText} className={styles.addTextButton}>
                Add Text
            </button>
        </div>
    );
}
