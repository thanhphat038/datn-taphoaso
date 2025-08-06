import React, { useState } from 'react';
import { FaImage, FaUpload, FaTrash, FaTimes } from 'react-icons/fa';
import './ImageUploadToolbar.css';

import { getApiUrl } from '../../config/api.js';

const API_BASE_URL = getApiUrl('');

const ImageUploadToolbar = ({ onImageUpload, onImageSelect, maxImages = 5, maxSize = 2 * 1024 * 1024, isOpen = false, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Handle image selection with base64 conversion
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setError(`Kích thước file không được vượt quá ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    // Limit number of images
    if (files.length > maxImages) {
      setError(`Tối đa ${maxImages} hình ảnh`);
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Process each image to base64
      const imagePromises = files.map(async (file) => {
        // Convert image to base64
        const base64Image = await compressImageToBase64(file);
        return {
          base64: base64Image,
          originalFile: file,
          name: file.name
        };
      });

      const imageData = await Promise.all(imagePromises);
      
      // Call callback with image data (base64 + file info)
      if (onImageUpload) {
        onImageUpload(imageData);
      }
      
      // If onImageSelect is provided, call it for each image with base64
      if (onImageSelect) {
        imageData.forEach(data => {
          onImageSelect(data.base64, data);
        });
      }

      // Close modal after successful processing
      if (onClose) {
        onClose();
      }

    } catch (error) {
      setError('Lỗi khi xử lý hình ảnh: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Compress image to base64 function
  const compressImageToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set max dimensions - có thể điều chỉnh kích thước ở đây
          const maxWidth = 1200;  // Tăng từ 800 lên 1200
          const maxHeight = 800;  // Tăng từ 600 lên 800
          let { width, height } = img;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          resolve(compressedBase64);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Compress image function (for backward compatibility)
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set max dimensions - có thể điều chỉnh kích thước ở đây
          const maxWidth = 1200;  // Tăng từ 800 lên 1200
          const maxHeight = 800;  // Tăng từ 600 lên 800
          let { width, height } = img;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          }, 'image/jpeg', 0.7); // 70% quality
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Don't render anything if modal is not open
  if (!isOpen) {
    return null;
  }

  return (
    <div className="image-upload-modal-overlay">
      <div className="image-upload-modal">
        <div className="image-upload-modal-header">
          <h3 className="image-upload-modal-title">Chọn hình ảnh</h3>
          <button
            onClick={onClose}
            className="image-upload-modal-close"
            disabled={uploading}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="image-upload-modal-content">
          {/* Error Display */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="loading-message">
              <div className="flex items-center justify-center gap-2">
                <div className="spinner rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Đang xử lý hình ảnh...
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="upload-area">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              id="image-upload-toolbar"
              disabled={uploading}
            />
            <label
              htmlFor="image-upload-toolbar"
              className={`cursor-pointer flex flex-col items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaUpload className="w-6 h-6 text-gray-400" />
              <div className="text-sm text-gray-600">
                {uploading ? 'Đang xử lý...' : 'Kéo thả hoặc click để chọn hình ảnh'}
              </div>
              <div className="text-xs text-gray-500">
                PNG, JPG, GIF, WebP (tối đa {Math.round(maxSize / 1024 / 1024)}MB mỗi file, tối đa {maxImages} ảnh)
              </div>
              <div className="upload-button">
                <FaImage className="w-4 h-4" />
                Chọn file
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadToolbar; 