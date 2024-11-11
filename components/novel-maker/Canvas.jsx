import styles from './Canvas.module.css';

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
        <div className={styles.canvas}>
            {backgroundImage && (
                <img
                    src={backgroundImage}
                    alt="Background"
                    className={styles.backgroundImage}
                    style={{
                        left: `${backgroundPositionX === 0 ? centerPosition.x : backgroundPositionX}px`,
                        top: `${backgroundPositionY === 0 ? centerPosition.y : backgroundPositionY}px`,
                        width: `${backgroundWidth}px`,
                        height: `${backgroundHeight}px`,
                        position: 'absolute',
                    }}
                />
            )}
            {characterImage && (
                <img
                    src={characterImage}
                    alt="Character"
                    className={styles.characterImage}
                    style={{
                        left: `${characterPositionX === 0 ? centerPosition.x : characterPositionX}px`,
                        top: `${characterPositionY === 0 ? centerPosition.y : characterPositionY}px`,
                        width: `${characterWidth}px`,
                        height: `${characterHeight}px`,
                        transform: `${flipped ? 'scaleX(-1)' : ''}`,
                        position: 'absolute',
                    }}
                />
            )}

            {/* Character Name and Dialogue Frames */}
            <div className={styles.dialogueFrame}>
                {characterName && (
                    <div className={styles.characterNameFrame}>
                        <div className={styles.characterName}>{characterName}</div>
                    </div>
                )}
                <div className={styles.dialogueText}>{dialogue}</div>
            </div>
        </div>
    );
}
