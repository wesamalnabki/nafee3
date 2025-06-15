import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import './ImageUpload.css';

const ImageUpload = ({ onUploadComplete, maxFiles = 1, type = 'profile' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (event) => {
    try {
      setUploading(true);
      setError(null);

      const files = event.target.files;
      if (!files || files.length === 0) return;

      // Check file size (512KB limit)
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 512 * 1024) {
          throw new Error('File size must be less than 512KB');
        }
      }

      const uploadedPaths = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${type}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        uploadedPaths.push(filePath);
      }

      onUploadComplete(uploadedPaths);
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        accept="image/*"
        multiple={maxFiles > 1}
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ImageUpload; 