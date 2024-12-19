'use client';
import { useRef, useState, useCallback } from 'react';
import { FolderUp, Upload, Image, Film, Library } from 'lucide-react';

export default function LeftPanel({ onImageUpload, imageType, setImageType }) {
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('platform');
    const [activeAssetType, setActiveAssetType] = useState('background');
    const [selectedCategory, setSelectedCategory] = useState('backgrounds');

    // Simulated platform assets (replace with your actual assets)
    const platformAssets = {
        backgrounds: [
            { id: 1, src: '/images/background/1.png', title: 'School' },

        ],
        characters: [
            { id: 1, src: '/images/character/doraemon.png', title: 'Doraemon' },

        ]
    };

    const handleFileChange = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;

        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const validVideoTypes = ['video/mp4', 'video/webm'];

        if (validImageTypes.includes(file.type) || validVideoTypes.includes(file.type)) {
            onImageUpload(file, activeAssetType);
        } else {
            alert('Please upload a valid image or video file.');
        }
    }, [activeAssetType, onImageUpload]);

    const handleAssetSelect = useCallback((asset) => {
        fetch(asset.src)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], asset.src.split('/').pop(), { 
                    type: asset.src.endsWith('.mp4') ? 'video/mp4' : 'image/png' 
                });
                onImageUpload(file, activeAssetType);
            })
            .catch(error => {
                console.error("Error loading asset:", error);
                alert('Failed to load the selected asset. Please try again.');
            });
    }, [activeAssetType, onImageUpload]);

    const renderAssetGrid = () => {
        const assets = selectedCategory === 'backgrounds' 
            ? platformAssets.backgrounds 
            : platformAssets.characters;

        return (
            <div className="grid grid-cols-2 gap-4 mt-4">
                {assets.map((asset) => (
                    <div
                        key={asset.id}
                        className="relative group cursor-pointer"
                        onClick={() => handleAssetSelect(asset)}
                    >
                        <img
                            src={asset.src}
                            alt={asset.title}
                            className="w-full h-32 object-cover rounded-lg transition-transform transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <p className="text-white text-sm font-medium">{asset.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-5 text-white w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Assets Manager</h3>
            
            {/* Main Tab Selection */}
            <div className="flex gap-2 mb-4">
                <button
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition ${
                        activeTab === 'platform' ? 'bg-blue-700' : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    onClick={() => setActiveTab('platform')}
                >
                    <Library size={16} /> Platform Assets
                </button>
                <button
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition ${
                        activeTab === 'upload' ? 'bg-blue-700' : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    onClick={() => setActiveTab('upload')}
                >
                    <Upload size={16} /> Upload
                </button>
            </div>

            {/* Asset Type Selection */}
            <div className="flex gap-2 mb-4">
                <button
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition ${
                        activeAssetType === 'background' ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    onClick={() => {
                        setActiveAssetType('background');
                        setImageType('background');
                        setSelectedCategory('backgrounds');
                    }}
                >
                    <Image size={16} /> Background
                </button>
                <button
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition ${
                        activeAssetType === 'character' ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    onClick={() => {
                        setActiveAssetType('character');
                        setImageType('character');
                        setSelectedCategory('characters');
                    }}
                >
                    <Film size={16} /> Character
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'platform' ? (
                <div className="flex-1 overflow-y-auto">
                    {renderAssetGrid()}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                        <FolderUp className="mx-auto mb-4" size={32} />
                        <p className="text-gray-300 mb-4">
                            Drag and drop your files here, or click to select files
                        </p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Choose File
                        </button>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,video/mp4,video/webm"
                        style={{ display: 'none' }}
                    />
                    <p className="text-sm text-gray-400 text-center">
                        Supported formats: PNG, JPEG, GIF, WEBP, MP4, WEBM
                    </p>
                </div>
            )}
        </div>
    );
}