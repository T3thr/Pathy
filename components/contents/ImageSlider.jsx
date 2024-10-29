'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ImageSlider.module.css';

const images = [
  '/images/novel1.png',
  '/images/novel2.png',
  '/images/novel3.png',
  '/images/novel4.png',
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  let touchStartX = 0;
  let touchEndX = 0;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Automatically loop through images every 5 seconds
  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, []);

  // Function to detect swipe direction
  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      handleNext(); // Swipe left, go to the next image
    }
    if (touchEndX - touchStartX > 50) {
      handlePrevious(); // Swipe right, go to the previous image
    }
  };

  return (
    
    <div
      className="relative w-full max-w-screen mx-auto my-8 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
        
      <div className={styles.navigationDots}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
          />
        ))}
      </div>
      
      <div className={styles.imageContainer}>
        {images.map((image, index) => {
          const offset = index - currentIndex;
          const displayClass =
            offset === 0
              ? styles.centerImage
              : offset === -1 || (currentIndex === 0 && index === images.length - 1)
              ? styles.leftImage
              : offset === 1 || (currentIndex === images.length - 1 && index === 0)
              ? styles.rightImage
              : styles.hiddenImage;

          return (
            <div key={index} className={`${styles.imageWrapper} ${displayClass}`}>
              <Image src={image} alt={`Slide ${index}`} width={640} height={360} />
            </div>
          );
        })}
      </div>

      <button onClick={handlePrevious} className={styles.arrowButtonLeft}>&#10094;</button>
      <button onClick={handleNext} className={styles.arrowButtonRight}>&#10095;</button>
    </div>
  );
}
