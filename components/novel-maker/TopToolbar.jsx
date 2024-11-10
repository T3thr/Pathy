'use client';

import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext'; // Adjust the import path if needed
import styles from './TopToolbar.module.css';

export default function TopToolbar({ onSave, onLoad }) {
    const { user } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Lock scrolling when the menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';  // Lock the scrolling
        } else {
            document.body.style.overflow = '';  // Restore normal scrolling
        }

        // Cleanup the overflow style when the component is unmounted or the menu is toggled off
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]); // Runs when isMenuOpen changes

    const handleSave = async () => {
        try {
            await axios.post('/api/projects', { userId: user._id, ...onSave() });
            alert('Project saved!');
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleLoad = async () => {
        try {
            const response = await axios.get(`/api/projects?userId=${user._id}`);
            onLoad(response.data.data);
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    };

    if (!user) {
        return <div className={styles.loading}>Loading...</div>;
    }

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className="z-50">
            <div className={styles.toolbar}>
                <div className={styles.leftSection}>
                    <h1 className={styles.title}>Novel Maker</h1>
                </div>
                <div className={styles.rightSectionDesktop}>
                    <img className={styles.profileImage} src={'/images/default.png'} alt="User Profile" />
                    <span className={styles.username}>{user.name}</span>
                    <div className={styles.buttonGroup}>
                        <button onClick={handleSave} className={styles.button}>Save</button>
                        <button onClick={handleLoad} className={styles.button}>Load</button>
                        <button className={styles.button}>Test Story</button>
                        <button onClick={() => window.location.href = '/'} className={styles.button}>Exit</button>
                    </div>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button className={styles.menuButton} onClick={toggleMenu}>
                    Menu
                </button>

                {/* Sidebar Overlay for Mobile Menu */}
                {isMenuOpen && (
                    <div className={styles.overlay} onClick={closeMenu} />
                )}

                {/* Sidebar for Mobile Menu */}
                <div className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : ''}`}>
                    <img className={styles.profileImage} src={'/images/default.png'} alt="User Profile" />
                    <span className={styles.username}>{user.name}</span>
                    <div className={styles.buttonGroup}>
                        <button onClick={handleSave} className={styles.button}>Save</button>
                        <button onClick={handleLoad} className={styles.button}>Load</button>
                        <button className={styles.button}>Test Story</button>
                        <button onClick={() => window.location.href = '/'} className={styles.button}>Exit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
