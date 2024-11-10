'use client';

import NovelMakerLayout from '@/components/novel-maker/NovelMakerLayout';
import { useState } from 'react';

export default function NovelMakerPage() {
    const [image, setImage] = useState(null);
    const [dialogue, setDialogue] = useState("Welcome to your novel!");
    const [zoom, setZoom] = useState(1);
    const [flipped, setFlipped] = useState(false);
    const [textFrameSize, setTextFrameSize] = useState(200);
    const [fontSize, setFontSize] = useState(16);

    const handleImageUpload = (file) => {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
    };

    return (
        <NovelMakerLayout
            image={image}
            setImage={setImage}
            dialogue={dialogue}
            setDialogue={setDialogue}
            zoom={zoom}
            setZoom={setZoom}
            flipped={flipped}
            setFlipped={setFlipped}
            textFrameSize={textFrameSize}
            setTextFrameSize={setTextFrameSize}
            fontSize={fontSize}
            setFontSize={setFontSize}
            onImageUpload={handleImageUpload}
        />
    );
}
