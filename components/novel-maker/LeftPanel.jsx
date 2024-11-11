'use client';
import { useRef, useState } from 'react';
import styles from './LeftPanel.module.css';

export default function LeftPanel({ onImageUpload, imageType, setImageType }) {
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('gallery');
    const [activeUploadTab, setActiveUploadTab] = useState('background');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                onImageUpload(file, activeUploadTab);
            } else {
                alert('Please upload a valid image file.');
            }
        }
    };

    // Handle the click for preset gallery images
    const handlePresetImageClick = (imageSrc, type) => {
        // Create a temporary Blob from the image source if it is not a file
        fetch(imageSrc)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], imageSrc.split('/').pop(), { type: 'image/png' });
                onImageUpload(file, type); // Call the onImageUpload with the file and type
            })
            .catch(error => {
                console.error("Error loading preset image:", error);
            });
    };

    return (
        <div className={styles.leftPanel}>
            <h3>Assets Manager</h3>
            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'gallery' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('gallery')}
                >
                    Gallery
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'upload' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('upload')}
                >
                    Upload
                </button>
            </div>

            {activeTab === 'gallery' && (
                <div className={styles.galleryTabContainer}>
                    <button
                        className={`${styles.galleryTabButton} ${activeUploadTab === 'background' ? styles.activeGalleryTab : ''}`}
                        onClick={() => { setActiveUploadTab('background'); setImageType('background'); }}
                    >
                        Background
                    </button>
                    <button
                        className={`${styles.galleryTabButton} ${activeUploadTab === 'character' ? styles.activeGalleryTab : ''}`}
                        onClick={() => { setActiveUploadTab('character'); setImageType('character'); }}
                    >
                        Character
                    </button>

                    <div className={styles.imageGallery}>
                        {activeUploadTab === 'background' && (
                            <img
                                src='/images/background/1.png'
                                alt="Background"
                                className={styles.imagePreview}
                                onClick={() => handlePresetImageClick('/images/background/1.png', 'background')}
                            />
                        )}
                        {activeUploadTab === 'character' && (
                            <img
                                src='/images/character/1.png'
                                alt="Character"
                                className={styles.imagePreview}
                                onClick={() => handlePresetImageClick('/images/character/1.png', 'character')}
                            />
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'upload' && (
                <>
                    <div className={styles.uploadTabContainer}>
                        <button
                            className={`${styles.uploadTabButton} ${activeUploadTab === 'background' ? styles.activeUploadTab : ''}`}
                            onClick={() => setActiveUploadTab('background')}
                        >
                            Upload Background Image
                        </button>
                        <button
                            className={`${styles.uploadTabButton} ${activeUploadTab === 'character' ? styles.activeUploadTab : ''}`}
                            onClick={() => setActiveUploadTab('character')}
                        >
                            Upload Character Image
                        </button>
                    </div>

                    <button onClick={() => fileInputRef.current.click()} className={styles.uploadButton}>
                        Upload {activeUploadTab} Image
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                </>
            )}
        </div>
    );
}
