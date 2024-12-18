export default function Canvas({
    backgroundImage, characterImage, dialogue, characterName,
    backgroundPositionX, backgroundPositionY,
    characterPositionX, characterPositionY, flipped,
    backgroundWidth, backgroundHeight, characterWidth, characterHeight
}) {
    const centerPosition = {
        x: window.innerWidth / 2 - backgroundWidth / 2, // Center based on canvas width
        y: window.innerHeight / 2 - backgroundHeight / 2 // Center based on canvas height
    };

    return (
        <div className="relative w-full h-3/4 overflow-hidden my-auto rounded-lg shadow-lg">
            {backgroundImage && (
                <img
                    src={backgroundImage}
                    alt="Background"
                    className="absolute object-cover"
                    style={{
                        left: `${backgroundPositionX === 0 ? centerPosition.x : backgroundPositionX}px`,
                        top: `${backgroundPositionY === 0 ? centerPosition.y : backgroundPositionY}px`,
                        width: `${backgroundWidth}px`,
                        height: `${backgroundHeight}px`,
                    }}
                />
            )}
            {characterImage && (
                <img
                    src={characterImage}
                    alt="Character"
                    className={`absolute ${flipped ? 'scale-x-[-1]' : ''}`}
                    style={{
                        left: `${characterPositionX === 0 ? centerPosition.x : characterPositionX}px`,
                        top: `${characterPositionY === 0 ? centerPosition.y : characterPositionY}px`,
                        width: `${characterWidth}px`,
                        height: `${characterHeight}px`,
                    }}
                />
            )}

            {/* Character Name and Dialogue Frames */}
            <div className="absolute bottom-5 left-2.5 w-full max-w-full h-[100px] bg-opacity-70 bg-black p-2.5 rounded-md overflow-y-auto z-0">
                {characterName && (
                    <div className="relative font-bold text-white">
                        <div className="text-sm">{characterName}</div>
                    </div>
                )}
                <div className="text-white text-base text-left">{dialogue}</div>
            </div>

            {/* Optional: Add border or toolbar for editor-like design */}
            <div className="absolute inset-0 border-4 border-gray-700 dark:border-gray-500 rounded-lg pointer-events-none" />

        </div>
    );
}
