'use client'
import { useState, useEffect } from 'react';

// Array of images to display in the slider
const images = [
  '/images/novel1.png',
  '/images/novel2.png',
  '/images/novel3.png',
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change every 3 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto my-8 overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)`, width: `${images.length * 100}%` }}
      >
        {images.map((src, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img
              src={src}
              alt={`Novel ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
