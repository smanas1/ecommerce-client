import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Carousel = ({ images = [], autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset to first slide when images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const nextSlide = useCallback(() => {
    if (!images || images.length <= 1) return;
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
  }, [images]);

  const prevSlide = useCallback(() => {
    if (!images || images.length <= 1) return;
    setCurrentIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
  }, [images]);

  const goToSlide = useCallback((index) => {
    if (!images || images.length <= 1) return;
    setCurrentIndex(index);
  }, [images]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !images || images.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, images, nextSlide]);

  // Don't render anything if no images
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-[500px] overflow-hidden rounded-2xl bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  // If only one image, just show it without controls
  if (images.length === 1) {
    return (
      <div 
        className="relative w-full h-[500px] overflow-hidden rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${images[0]})` }}
      />
    );
  }

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

      {/* Navigation Arrows */}
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

      {/* Indicators */}
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