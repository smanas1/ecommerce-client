import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImprovedCarousel = ({
  images = [],
  autoPlay = true,
  interval = 5000,
  showIndicators = true,
  showArrows = true,
  showPlayPause = true,
  autoHeight = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Reset to first slide when images change
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(autoPlay);
  }, [images, autoPlay]);

  const nextSlide = useCallback(() => {
    if (!images || images.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images]);

  const prevSlide = useCallback(() => {
    if (!images || images.length <= 1) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  }, [images]);

  const goToSlide = useCallback(
    (index) => {
      if (!images || images.length <= 1) return;
      setCurrentIndex(index);
    },
    [images]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !images || images.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, interval, images, nextSlide]);

  // Don't render anything if no images
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-96 overflow-hidden  bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
        <span className="text-gray-500 text-lg">No images available</span>
      </div>
    );
  }

  // If only one image, just show it without controls
  if (images.length === 1) {
    return (
      <div
        className={`relative w-full overflow-hidden  bg-cover bg-center ${
          autoHeight ? "h-auto" : "h-96"
        }`}
        style={{
          backgroundImage: `url(${images[0]})`,
          height: autoHeight ? "auto" : "384px", // h-96 = 24rem = 384px
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden  ${
        autoHeight ? "h-auto" : "h-[550px]"
      }`}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
              index === currentIndex
                ? "opacity-100 scale-100 z-10"
                : index === (currentIndex + 1) % images.length
                ? "opacity-0 scale-110 z-0"
                : "opacity-0 scale-90 z-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "object-fit-cover",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-md hover:bg-white rounded-full w-12 h-12 shadow-xl border border-white/30 z-30"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-md hover:bg-white rounded-full w-12 h-12 shadow-xl border border-white/30 z-30"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </Button>
        </>
      )}

      {/* Play/Pause Button */}
      {showPlayPause && images.length > 1 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-md hover:bg-white rounded-full w-10 h-10 shadow-xl border border-white/30 z-30"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-gray-800" />
          ) : (
            <Play className="h-4 w-4 text-gray-800" />
          )}
        </Button>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-8 backdrop-blur-md shadow-lg"
                  : "bg-white/60 backdrop-blur-sm"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      <div className="absolute bottom-4 right-4 text-white text-sm z-30 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImprovedCarousel;
