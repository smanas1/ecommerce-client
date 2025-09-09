import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Carousel = ({ images, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval, images.length]);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl">
      {/* Slides */}
      <div className="relative h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </div>

      {/* Navigation Arrows with Enhanced Glassmorphism */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-md hover:bg-white rounded-full w-12 h-12 shadow-xl border border-white/30"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-md hover:bg-white rounded-full w-12 h-12 shadow-xl border border-white/30"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </Button>

      {/* Indicators with Enhanced Glassmorphism */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-8 backdrop-blur-md shadow-lg'
                : 'bg-white/60 backdrop-blur-sm'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;