'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// Array of images to display in the slider
const images = [
  '/images/novel1.png',
  '/images/novel2.png',
  '/images/novel3.png',
  '/images/novel4.png',
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  // Get indices of images to display
  const getDisplayedIndices = () => {
    const totalImages = images.length;
    const leftIndex = (currentIndex - 1 + totalImages) % totalImages; // Previous index
    const rightIndex = (currentIndex + 1) % totalImages; // Next index
    return [leftIndex, currentIndex, rightIndex];
  };

  const displayedIndices = getDisplayedIndices();

  // Handle touch start event
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  // Handle touch end event
  const handleTouchEnd = (e) => {
    setTouchEndX(e.changedTouches[0].clientX);
    handleSwipe();
  };

  // Handle swipe event
  const handleSwipe = () => {
    if (touchStartX === null || touchEndX === null) return;

    if (touchStartX > touchEndX + 50) {
      // Swipe left
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    } else if (touchStartX < touchEndX - 50) {
      // Swipe right
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
    setTouchStartX(null); // Reset touch states
    setTouchEndX(null);
  };

  // Change index with left/right arrows
  const handleArrowClick = (direction) => {
    if (direction === 'left') {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-8 overflow-hidden">
      <div
        className="flex justify-center items-center space-x-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {displayedIndices.map((index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-1/2 transition-transform duration-700 ease-in-out" // Adjust width here
            style={{ transform: index === currentIndex ? 'scale(1)' : 'scale(0.8)' }}
          >
            <div className="relative w-full h-64 overflow-hidden shadow-lg rounded-lg">
              <Image
                src={images[index]}
                alt={`Novel ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              {/* Dark overlay for non-centered images */}
              <div className={`absolute inset-0 bg-black transition-opacity duration-700 ${index === currentIndex ? 'opacity-0' : 'opacity-50'}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Left and Right Arrow Navigation */}
      <button
        onClick={() => handleArrowClick('left')}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10"
      >
        &lt;
      </button>
      <button
        onClick={() => handleArrowClick('right')}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10"
      >
        &gt;
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-300 ${currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`}
          ></span>
        ))}
      </div>
    </div>
  );
}
