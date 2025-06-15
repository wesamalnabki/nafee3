import React, { useEffect } from 'react';
import './Lightbox.css';

const Lightbox = ({ 
  images, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev 
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="lightbox" onClick={handleBackdropClick}>
      <button className="lightbox-close" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
      
      <button 
        className="lightbox-nav lightbox-prev"
        onClick={onPrev}
        disabled={currentIndex === 0}
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      <div className="lightbox-content">
        <img 
          src={images[currentIndex]} 
          alt={`Image ${currentIndex + 1}`}
          className="lightbox-image"
        />
        <div className="lightbox-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <button 
        className="lightbox-nav lightbox-next"
        onClick={onNext}
        disabled={currentIndex === images.length - 1}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Lightbox; 