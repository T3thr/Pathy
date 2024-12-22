'use client';

import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AuthContext from '@/context/AuthContext';
import { Save, FolderOpen, Play, Home, Settings, Undo, Redo, Plus, BookOpen } from 'lucide-react';

export default function TopToolbar({ onSave, onLoad, onPreviewToggle, isPreviewMode }) {
    const { user } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showProjectMenu, setShowProjectMenu] = useState(false);

    useEffect(() => {
        if (isMenuOpen || showProjectMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen, showProjectMenu]);

    const handleSave = async () => {
        try {
            await onSave();
            toast.success('Project saved successfully!');
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error('Failed to save project');
        }
    };

    const handleLoad = async () => {
        try {
            await onLoad();
            toast.success('Project loaded successfully!');
        } catch (error) {
            console.error('Error loading projects:', error);
            toast.error('Failed to load projects');
        }
    };

    if (!user) {
        return <div className="font-poppins text-xl text-gray-600 font-medium text-center mt-5">Loading...</div>;
    }

    return (
        <div className="z-50 sticky top-0">
            <div className="bg-[#1a1a1a] text-white shadow-2xl">
                {/* Main Toolbar */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                    {/* Left Section - Logo and Title */}
                    <div className="flex items-center space-x-4">
                        <h1 className="font-poppins text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Novel Maker
                        </h1>
                    </div>

                    {/* Center Section - Main Tools */}
                    <div className="hidden md:flex items-center space-x-2">
                        <button onClick={handleSave} className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md transition-all">
                            <Save size={16} />
                            <span className="font-poppins text-sm">Save</span>
                        </button>
                        <button onClick={handleLoad} className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md transition-all">
                            <FolderOpen size={16} />
                            <span className="font-poppins text-sm">Load</span>
                        </button>
                        <div className="h-6 w-px bg-gray-700 mx-2" />
                        <button onClick={() => onPreviewToggle()} className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md transition-all">
                            <Play size={16} />
                            <span className="font-poppins text-sm">{isPreviewMode ? 'Edit' : 'Preview'}</span>
                        </button>
                    </div>

                    {/* Right Section - User Profile and Additional Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 rounded-md">
                            <img className="w-8 h-8 rounded-full border-2 border-blue-500" src={'/images/default.png'} alt="User Profile" />
                            <span className="font-poppins text-sm text-gray-200">{user.name}</span>
                        </div>
                        <button onClick={() => window.location.href = '/'} className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md transition-all">
                            <Home size={16} />
                            <span className="font-poppins text-sm">Exit</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 hover:bg-gray-700 rounded-md" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Settings size={20} />
                    </button>
                </div>

                {/* Secondary Toolbar */}
                <div className="hidden md:flex items-center justify-between px-4 py-2 bg-[#2a2a2a]">
                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-700 rounded-md transition-all">
                            <Undo size={16} />
                            <span className="font-poppins text-sm">Undo</span>
                        </button>
                        <button className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-700 rounded-md transition-all">
                            <Redo size={16} />
                            <span className="font-poppins text-sm">Redo</span>
                        </button>
                        <div className="h-4 w-px bg-gray-700 mx-2" />
                        <button className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-700 rounded-md transition-all">
                            <Plus size={16} />
                            <span className="font-poppins text-sm">New Scene</span>
                        </button>
                        <button className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-700 rounded-md transition-all">
                            <BookOpen size={16} />
                            <span className="font-poppins text-sm">Story Flow</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)} />
                    <div className="fixed top-0 right-0 w-64 h-full bg-[#1a1a1a] p-4 z-50 shadow-xl">
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center space-x-2 mb-6">
                                <img className="w-10 h-10 rounded-full border-2 border-blue-500" src={'/images/default.png'} alt="User Profile" />
                                <span className="font-poppins text-white">{user.name}</span>
                            </div>
                            <button onClick={handleSave} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-all">
                                <Save size={16} />
                                <span className="font-poppins text-sm">Save</span>
                            </button>
                            <button onClick={handleLoad} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-all">
                                <FolderOpen size={16} />
                                <span className="font-poppins text-sm">Load</span>
                            </button>
                            <button onClick={() => onPreviewToggle()} className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white transition-all">
                                <Play size={16} />
                                <span className="font-poppins text-sm">{isPreviewMode ? 'Edit' : 'Preview'}</span>
                            </button>
                            <div className="h-px bg-gray-700 my-2" />
                            <button onClick={() => window.location.href = '/'} className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition-all">
                                <Home size={16} />
                                <span className="font-poppins text-sm">Exit</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}