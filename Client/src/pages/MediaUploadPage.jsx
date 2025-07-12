// MediaUploadPage.jsx
import React, { useState } from 'react';
import mediaService from '../services/mediaService';
import { useToast } from '../components/Toast';
import { validateImage, getFilePreview, formatFileSize } from '../utils/validateFile';

const MediaUploadPage = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const { showSuccess, showError } = useToast();

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];

    selectedFiles.forEach(file => {
      const validation = validateImage(file);
      if (validation.valid) {
        validFiles.push({
          file,
          preview: getFilePreview(file),
          id: Math.random().toString(36).substr(2, 9)
        });
      } else {
        showError(`${file.name}: ${validation.error}`);
      }
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      showError('Please select files to upload');
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(f => mediaService.uploadMedia(f.file));
      const results = await Promise.all(uploadPromises);
      
      setUploadedFiles(prev => [...prev, ...results]);
      setFiles([]);
      showSuccess(`Successfully uploaded ${results.length} files`);
    } catch (error) {
      showError('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Media Upload</h1>
          <p className="text-gray-600 mt-1">Upload images for your profile, skills, or groups</p>
        </div>

        <div className="p-6 space-y-6">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span>
                  {' '}or drag and drop
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </label>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Files</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map(f => (
                  <div key={f.id} className="relative border rounded-lg p-4">
                    <img
                      src={f.preview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <p className="text-sm font-medium text-gray-900 truncate">{f.file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(f.file.size)}</p>
                    <button
                      onClick={() => removeFile(f.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button
                  onClick={uploadFiles}
                  disabled={uploading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : `Upload ${files.length} Files`}
                </button>
              </div>
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <img
                      src={file.url}
                      alt="Uploaded"
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600">✅ Uploaded</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(file.url)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaUploadPage;
