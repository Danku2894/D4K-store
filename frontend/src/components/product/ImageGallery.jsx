import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * ImageGallery Component - Street Style
 * Gallery ảnh sản phẩm với thumbnails
 * 
 * @param {Array} images - Array of image URLs
 * @param {String} productName - Product name for alt text
 */
const ImageGallery = ({ images = [], productName = 'Product' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Nếu không có ảnh, dùng placeholder
  const imageList = images.length > 0 ? images : ['/placeholder-product.jpg'];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] bg-light-200 border-2 border-dark-950 overflow-hidden group">
        {/* Main Image */}
        <img
          src={imageList[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-500
                    ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={toggleZoom}
        />

        {/* Grunge Overlay */}
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>

        {/* Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 
                       bg-light-50 border-2 border-dark-950 
                       hover:bg-dark-950 hover:text-light-50 
                       transition-all flex items-center justify-center
                       opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <FiChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 
                       bg-light-50 border-2 border-dark-950 
                       hover:bg-dark-950 hover:text-light-50 
                       transition-all flex items-center justify-center
                       opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {imageList.length > 1 && (
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-dark-950 text-light-50 
                        text-xs font-bold uppercase tracking-wider">
            {currentIndex + 1} / {imageList.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {imageList.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`
                aspect-square overflow-hidden border-2 transition-all
                ${index === currentIndex 
                  ? 'border-dark-950 scale-95' 
                  : 'border-gray-300 hover:border-dark-950'
                }
              `}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover transition-all"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

