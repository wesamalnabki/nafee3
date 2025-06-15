import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../services/supabaseClient';
import ImageCropper from './ImageCropper';
import './ImageUpload.css';

const ImageUpload = ({ 
  onUploadComplete, 
  maxFiles = 1, 
  maxSizeMB = 0.5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  isProfilePhoto = false,
  existingImages = []
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [croppingImage, setCroppingImage] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      throw new Error(`Only ${acceptedTypes.map(type => type.split('/')[1]).join(', ')} files are allowed`);
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`File size must be less than ${maxSizeMB}MB`);
    }
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      return file;
    }
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    setError(null);
    setProgress(0);

    try {
      // Validate all files first
      files.forEach(validateFile);

      // Check total number of files
      if (existingImages.length + files.length > maxFiles) {
        throw new Error(`Maximum ${maxFiles} ${isProfilePhoto ? 'profile photo' : 'portfolio photos'} allowed`);
      }

      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

      // If it's a profile photo, show cropping interface
      if (isProfilePhoto && files.length > 0) {
        setCroppingImage(URL.createObjectURL(files[0]));
        return;
      }

      await processAndUploadFiles(files);
    } catch (error) {
      setError(error.message);
      setPreviewUrls([]);
    }
  };

  const processAndUploadFiles = async (files) => {
    setUploading(true);
    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Compress image
        const compressedFile = await compressImage(file);
        
        const fileExt = compressedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${isProfilePhoto ? 'profile-photos' : 'portfolio-photos'}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('profile-photos')
          .upload(filePath, compressedFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
        setProgress(((i + 1) / files.length) * 100);
      } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
      }
    }

    onUploadComplete(uploadedUrls);
    setPreviewUrls([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploading(false);
    setProgress(0);
  };

  const handleCropComplete = async (croppedBlob) => {
    try {
      const file = new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' });
      await processAndUploadFiles([file]);
      setCroppingImage(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
      handleFileChange({ target: { files: dataTransfer.files } });
    }
  };

  if (croppingImage) {
    return (
      <div className="image-upload-container">
        <ImageCropper
          image={croppingImage}
          onCropComplete={handleCropComplete}
          aspectRatio={isProfilePhoto ? 1 : undefined}
        />
        <button 
          className="cancel-crop"
          onClick={() => {
            setCroppingImage(null);
            setPreviewUrls([]);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div 
      className="image-upload-container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="upload-area">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileChange}
          multiple={!isProfilePhoto}
          disabled={uploading}
          className="file-input"
        />
        <div className="upload-content">
          <i className="fas fa-cloud-upload-alt"></i>
          <p>Drag and drop files here or click to browse</p>
          <p className="upload-hint">
            {isProfilePhoto ? 'Upload profile photo' : 'Upload up to 5 portfolio photos'}
            <br />
            Max size: {maxSizeMB}MB per file
          </p>
        </div>
      </div>

      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{Math.round(progress)}%</span>
        </div>
      )}

      {error && (
        <div className="upload-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {previewUrls.length > 0 && (
        <div className="preview-container">
          {previewUrls.map((url, index) => (
            <div key={index} className="preview-item">
              <img src={url} alt={`Preview ${index + 1}`} />
              <button 
                className="remove-preview"
                onClick={() => {
                  setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                  URL.revokeObjectURL(url);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 