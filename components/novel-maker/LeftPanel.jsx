// LeftPanel.jsx
'use client';
import { useRef, useState, useCallback } from 'react';
import { Upload, Image, X } from 'lucide-react';

export default function LeftPanel({ onImageUpload, imageType, setImageType }) {
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('gallery');
    const [activeUploadTab, setActiveUploadTab] = useState('background');
    const [dragOver, setDragOver] = useState(false);

    // Preset images configuration
    const presetImages = {
        background: [
            { src: '/images/background/1.png', alt: 'School' },
            { src: '/images/background/2.png', alt: 'City' },
            { src: '/images/background/3.png', alt: 'Park' },
        ],
        character: [
            { src: '/images/character/doraemon.png', alt: 'Doraemon' },
            { src: '/images/character/char1.png', alt: 'Character 1' },
            { src: '/images/character/char2.png', alt: 'Character 2' },
        ]
    };

    const handleFileChange = useCallback((event) => {
        const files = event.target.files || (event.dataTransfer?.files ?? null);
        if (!files) return;

        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                onImageUpload(file, activeUploadTab);
            } else {
                alert('Please upload a valid image file.');
            }
        });
    }, [activeUploadTab, onImageUpload]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        handleFileChange(e);
    }, [handleFileChange]);

    const handlePresetImageClick = useCallback((imageSrc, type) => {
        fetch(imageSrc)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], imageSrc.split('/').pop(), { type: 'image/png' });
                onImageUpload(file, type);
            })
            .catch(error => {
                console.error("Error loading preset image:", error);
            });
    }, [onImageUpload]);

    return (
        <div className="flex flex-col items-center justify-start p-4 bg-gray-100 rounded-lg shadow-md max-w-[300px] mx-auto w-full h-full">
            <h3 className="text-lg font-bold mb-4">Assets Manager</h3>
            
            {/* Main Tabs */}
            <div className="flex justify-around w-full border-b-2 border-gray-300 mb-4">
                {['gallery', 'upload'].map((tab) => (
                    <button
                        key={tab}
                        className={`flex-1 py-2 text-white rounded-t-md transition-all duration-200
                            ${activeTab === tab ? 'bg-blue-700 transform scale-105' : 'bg-blue-500 hover:bg-blue-600'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Asset Type Selection */}
            <div className="flex gap-4 w-full mb-4">
                {['background', 'character'].map((type) => (
                    <button
                        key={type}
                        className={`flex-1 py-2 px-4 rounded-md transition-all duration-200
                            ${activeUploadTab === type ? 'bg-green-600 text-white transform scale-105' : 'bg-gray-200 hover:bg-gray-300'}`}
                        onClick={() => {
                            setActiveUploadTab(type);
                            setImageType(type);
                        }}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {/* Gallery View */}
            {activeTab === 'gallery' && (
                <div className="grid grid-cols-2 gap-4 w-full mt-4 p-2 max-h-[500px] overflow-y-auto">
                    {presetImages[activeUploadTab].map((image, index) => (
                        <div
                            key={index}
                            className="relative group cursor-pointer"
                            onClick={() => handlePresetImageClick(image.src, activeUploadTab)}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-32 object-cover rounded-md transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md">
                                <div className="absolute bottom-2 left-2 text-white text-sm opacity-0 group-hover:opacity-100">
                                    {image.alt}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Section */}
            {activeTab === 'upload' && (
                <div
                    className={`w-full mt-4 p-8 border-2 border-dashed rounded-lg transition-colors duration-200
                        ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center gap-4">
                        <Upload size={48} className="text-gray-400" />
                        <p className="text-center text-gray-600">
                            Drag and drop your {activeUploadTab} image here, or
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-blue-500 hover:text-blue-600 ml-1"
                            >
                                browse
                            </button>
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                            multiple
                        />
                    </div>
                </div>
            )}
        </div>
    );
}