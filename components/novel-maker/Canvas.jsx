'use client';
import { useEffect, useRef, useState } from 'react';

export default function Canvas({
    backgroundImage, characterImage, dialogue, characterName,
    backgroundPositionX, backgroundPositionY,
    characterPositionX, characterPositionY,
    backgroundWidth, backgroundHeight,
    characterWidth, characterHeight,
    backgroundRotation = 0, characterRotation = 0,
    backgroundOpacity = 1, characterOpacity = 1,
    textFrameSize = 200, fontSize = 16,
    textOpacity = 0.7, textColor = "#FFFFFF"
}) {
    const canvasRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        const updateCanvasSize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setCanvasSize({
                    width: width,
                    height: height
                });
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    const calculatePosition = (posX, posY, width, height) => {
        return {
            x: (canvasSize.width / 2) + posX - (width / 2),
            y: (canvasSize.height / 2) + posY - (height / 2)
        };
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-[700px] h-[520px] overflow-hidden bg-black rounded-lg"
        >
            {/* Background Layer */}
            {backgroundImage && (
                <div
                    className="absolute transition-all duration-300 ease-in-out"
                    style={{
                        ...calculatePosition(backgroundPositionX, backgroundPositionY, backgroundWidth, backgroundHeight),
                        width: `${backgroundWidth}px`,
                        height: `${backgroundHeight}px`,
                        transform: `rotate(${backgroundRotation}deg)`,
                        opacity: backgroundOpacity
                    }}
                >
                    <img
                        src={backgroundImage}
                        alt="Background"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
            )}

            {/* Character Layer */}
            {characterImage && (
                <div
                    className="absolute transition-all duration-300 ease-in-out"
                    style={{
                        ...calculatePosition(characterPositionX, characterPositionY, characterWidth, characterHeight),
                        width: `${characterWidth}px`,
                        height: `${characterHeight}px`,
                        transform: `rotate(${characterRotation}deg)`,
                        opacity: characterOpacity
                    }}
                >
                    <img
                        src={characterImage}
                        alt="Character"
                        className="w-full h-full object-contain"
                    />
                </div>
            )}

            {/* Text Layer */}
            {(dialogue || characterName) && (
                <div 
                    className="absolute bottom-0 left-0 w-full p-4 transition-all duration-300"
                    style={{
                        background: `rgba(0, 0, 0, ${textOpacity})`,
                        minHeight: `${textFrameSize}px`
                    }}
                >
                    {characterName && (
                        <div 
                            className="font-bold mb-2"
                            style={{
                                color: textColor,
                                fontSize: `${fontSize + 4}px`
                            }}
                        >
                            {characterName}
                        </div>
                    )}
                    <div
                        className="text-left whitespace-pre-wrap"
                        style={{
                            color: textColor,
                            fontSize: `${fontSize}px`
                        }}
                    >
                        {dialogue}
                    </div>
                </div>
            )}

        </div>
    );
}