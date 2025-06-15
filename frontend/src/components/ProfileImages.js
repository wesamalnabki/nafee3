import React from 'react';
import { supabase } from '../services/supabaseClient';
import './ProfileImages.css';

const ProfileImages = ({ profilePhoto, portfolioPhotos }) => {
  const getImageUrl = (path) => {
    if (!path) return null;
    const { data } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="profile-images">
      {profilePhoto && (
        <div className="profile-photo">
          <img
            src={getImageUrl(profilePhoto)}
            alt="Profile"
            className="profile-photo-img"
          />
        </div>
      )}
      
      {portfolioPhotos && portfolioPhotos.length > 0 && (
        <div className="portfolio-photos">
          <h3>Portfolio</h3>
          <div className="portfolio-grid">
            {portfolioPhotos.map((photo, index) => (
              <div key={index} className="portfolio-item">
                <img
                  src={getImageUrl(photo)}
                  alt={`Portfolio ${index + 1}`}
                  className="portfolio-img"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImages; 