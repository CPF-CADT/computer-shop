import { useState, useEffect, useRef } from 'react';
import banner1 from '../../assets/LoopBanner/banner1.webp';
import banner2 from '../../assets/LoopBanner/banner2.webp';
import banner3 from '../../assets/LoopBanner/banner3.webp';

const bannerImages = [banner1, banner2, banner3];

export default function LoopBanner({ height = "h-64", className = "", interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startX = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, interval);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [currentIndex, interval]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleDotClick = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Mouse/touch drag handlers
  const handleDragStart = (e) => {
    startX.current = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
  };

  const handleDragEnd = (e) => {
    if (startX.current === null) return;
    const endX = e.type === "touchend"
      ? e.changedTouches[0].clientX
      : e.clientX;
    const diff = endX - startX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    startX.current = null;
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${height} ${className} bg-transparent p-0`}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
    >
      <div className="h-full w-full relative rounded-lg overflow-hidden">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={image}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
