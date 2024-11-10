import styles from './Canvas.module.css';

export default function Canvas({
    backgroundImage, characterImage, dialogue, characterName,
    backgroundZoom, backgroundPositionX, backgroundPositionY,
    characterZoom, characterPositionX, characterPositionY, flipped,
    textFrameSize, fontSize
}) {
    return (
        <div className={styles.canvas}>
            {backgroundImage && (
                <img
                    src={backgroundImage}
                    alt="Background"
                    className={styles.backgroundImage}
                    style={{
                        transform: `scale(${backgroundZoom})`,
                        left: `${backgroundPositionX}px`,
                        top: `${backgroundPositionY}px`,
                    }}
                />
            )}
            {characterImage && (
                <img
                    src={characterImage}
                    alt="Character"
                    className={styles.characterImage}
                    style={{
                        transform: `scale(${characterZoom}) ${flipped ? 'scaleX(-1)' : ''}`,
                        left: `${characterPositionX}px`,
                        top: `${characterPositionY}px`,
                    }}
                />
            )}
            <div
                className={styles.dialogueFrame}
                style={{ width: `${textFrameSize}px`, fontSize: `${fontSize}px` }}
            >
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
