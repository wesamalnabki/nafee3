import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import Lightbox from './Lightbox';
import './ProfileImages.css';

const LazyImage = ({ src, alt, onError, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observerRef.current.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div 
      ref={imgRef}
      className={`lazy-image-container ${isLoaded ? 'loaded' : ''}`}
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="image-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={onError}
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
        />
      )}
    </div>
  );
};

const ProfileImages = ({ 
  profilePhoto, 
  portfolioPhotos = [], 
  isProfilePage = false,
  onImageClick,
  maxDisplay = 5
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [imageError, setImageError] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    const checkImages = async () => {
      setLoading(true);
      setError(null);
      const newLoadedImages = {};
      const newImageError = {};
      const images = [];

      try {
        // Check profile photo
        if (profilePhoto) {
          const { data, error } = await supabase.storage
            .from('profile-photos')
            .getPublicUrl(profilePhoto);
          
          if (error) throw error;
          newLoadedImages.profile = data.publicUrl;
          images.push(data.publicUrl);
        }

        // Check portfolio photos
        for (let i = 0; i < portfolioPhotos.length; i++) {
          const photo = portfolioPhotos[i];
          const { data, error } = await supabase.storage
            .from('profile-photos')
            .getPublicUrl(photo);
          
          if (error) {
            newImageError[i] = true;
          } else {
            newLoadedImages[i] = data.publicUrl;
            images.push(data.publicUrl);
          }
        }

        setLoadedImages(newLoadedImages);
        setImageError(newImageError);
        setAllImages(images);
      } catch (err) {
        setError('Failed to load images');
        console.error('Error loading images:', err);
      } finally {
        setLoading(false);
      }
    };

    checkImages();
  }, [profilePhoto, portfolioPhotos]);

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  const handleLightboxNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handleLightboxPrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const renderProfilePhoto = () => {
    if (loading) {
      return (
        <div className="profile-photo loading">
          <div className="loading-spinner"></div>
        </div>
      );
    }

    if (error || !loadedImages.profile) {
      return (
        <div className="profile-photo error">
          <i className="fas fa-user"></i>
        </div>
      );
    }

    return (
      <div className="profile-photo">
        <LazyImage
          src={loadedImages.profile}
          alt="Profile"
          onError={() => handleImageError('profile')}
          onClick={() => handleImageClick(0)}
        />
      </div>
    );
  };

  const renderPortfolioPhotos = () => {
    if (!portfolioPhotos.length) return null;

    const displayPhotos = portfolioPhotos.slice(0, maxDisplay);
    const remainingCount = portfolioPhotos.length - maxDisplay;

    return (
      <div className="portfolio-grid">
        {displayPhotos.map((_, index) => {
          if (loading) {
            return (
              <div key={index} className="portfolio-item loading">
                <div className="loading-spinner"></div>
              </div>
            );
          }

          if (imageError[index] || !loadedImages[index]) {
            return (
              <div key={index} className="portfolio-item error">
                <i className="fas fa-image"></i>
              </div>
            );
          }

          return (
            <div key={index} className="portfolio-item">
              <LazyImage
                src={loadedImages[index]}
                alt={`Portfolio ${index + 1}`}
                onError={() => handleImageError(index)}
                onClick={() => handleImageClick(index + 1)}
              />
              {index === maxDisplay - 1 && remainingCount > 0 && (
                <div className="remaining-count">
                  +{remainingCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="profile-images">
      {isProfilePage ? (
        <>
          {renderProfilePhoto()}
          {renderPortfolioPhotos()}
        </>
      ) : (
        renderProfilePhoto()
      )}

      {lightboxOpen && (
        <Lightbox
          images={allImages}
          currentIndex={currentImageIndex}
          onClose={handleLightboxClose}
          onNext={handleLightboxNext}
          onPrev={handleLightboxPrev}
        />
      )}
    </div>
  );
};

export default ProfileImages; 