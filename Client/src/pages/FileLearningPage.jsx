import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { fileService } from '../services/fileService';

const FileLearningPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }

    fetchFiles();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const fetchFiles = async () => {
    try {
      const response = await fileService.getFiles();
      setFiles(response.data || []);
    } catch (error) {
      showError('Failed to fetch files');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      showError('File size must be less than 25MB');
      return;
    }

    // Validate file type - be more permissive to match server validation
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp',
      // Documents
      'application/pdf', 'text/plain', 'text/csv', 'text/markdown',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Text and code files
      'text/html', 'text/xml', 'application/json', 'text/javascript', 'text/css',
      // Videos (for preview testing)
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/ogg'
    ];

    console.log('Selected file type:', file.type);
    if (!allowedTypes.includes(file.type)) {
      showError(`File type "${file.type}" not supported. Please choose a supported file format.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', selectedFile.name);
    formData.append('type', getFileType(selectedFile.type));

    try {
      await fileService.uploadFile(formData);
      showSuccess('File uploaded successfully');
      setSelectedFile(null);
      fetchFiles();
    } catch (error) {
      showError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = async (file) => {
    try {
      console.log('Previewing file:', file);
      console.log('File URL:', file.cloudinaryUrl);
      console.log('File type:', file.type);
      console.log('File mimetype:', file.mimetype);
      
      // First try to use the preview endpoint
      try {
        const response = await fileService.previewFile(file._id);
        console.log('Preview endpoint response:', response);
        const previewData = {
          ...response.data,
          url: response.data.previewUrl || response.data.cloudinaryUrl,
          type: response.data.type
        };
        console.log('Using preview endpoint data:', previewData);
        setPreviewFile(previewData);
        return;
      } catch (previewError) {
        console.log('Preview endpoint failed, using fallback:', previewError.message);
      }
      
      // Fallback to basic preview if endpoint fails
      const previewData = {
        ...file,
        url: file.cloudinaryUrl,
        type: file.type
      };
      console.log('Using fallback preview data:', previewData);
      setPreviewFile(previewData);
      
    } catch (error) {
      console.error('Preview error:', error);
      showError('Failed to load file preview');
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await fileService.downloadFile(fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess('File downloaded successfully');
    } catch (error) {
      showError('Failed to download file');
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await fileService.deleteFile(fileId);
      showSuccess('File deleted successfully');
      fetchFiles();
    } catch (error) {
      showError('Failed to delete file');
    }
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'spreadsheet';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'presentation';
    if (mimeType.startsWith('text/')) return 'text';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'other';
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'pdf': return '📄';
      case 'document': return '📝';
      case 'spreadsheet': return '📊';
      case 'presentation': return '📋';
      case 'text': return '📄';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      default: return '📁';
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || file.type === filter;
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/skill-learning')}
              className="p-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl border border-white/30 dark:border-gray-700/30 hover:bg-white/30 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">File Learning</h1>
              <p className="text-gray-600 dark:text-gray-400">Share and access learning materials</p>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl border border-white/30 dark:border-gray-700/30 hover:bg-white/30 transition-all duration-200"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Upload Section */}
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30 dark:border-gray-700/30">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload File</h2>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <input
                type="file"
                onChange={handleFileSelect}
                className="w-full px-4 py-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-lg text-gray-900 dark:text-white"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.csv,video/*,audio/*"
              />
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </div>
              )}
            </div>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30 dark:border-gray-700/30">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-lg text-gray-900 dark:text-white"
            >
              <option value="all">All Files</option>
              <option value="image">Images</option>
              <option value="pdf">PDFs</option>
              <option value="document">Documents</option>
              <option value="spreadsheet">Spreadsheets</option>
              <option value="presentation">Presentations</option>
              <option value="text">Text Files</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map(file => (
            <div key={file._id} className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 dark:border-gray-700/30 hover:bg-white/30 transition-all duration-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{getFileIcon(file.type)}</div>
                <h3 className="font-medium text-gray-900 dark:text-white truncate">{file.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formatFileSize(file.size)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Uploaded by {file.uploadedBy?.name || 'Unknown'}
                </p>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => handlePreview(file)}
                  className="w-full px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Preview
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(file._id, file.title)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Download
                  </button>
                  {file.uploadedBy?._id === user._id && (
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No files found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filter !== 'all' ? 'Try adjusting your search or filter' : 'Upload your first file to get started'}
            </p>
          </div>
        )}

        {/* Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl max-h-[80vh] w-full overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{previewFile.title}</h3>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 overflow-auto max-h-[60vh]">
                {previewFile.type === 'image' ? (
                  <div className="text-center">
                    <img
                      src={previewFile.url}
                      alt={previewFile.title}
                      className="max-w-full max-h-full mx-auto rounded-lg"
                      onLoad={() => console.log('Image loaded successfully')}
                      onError={(e) => {
                        console.error('Image failed to load:', previewFile.url);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none' }} className="text-center py-8">
                      <div className="text-4xl mb-4">🖼️</div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Image preview failed to load</p>
                      <a
                        href={previewFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Open Image in New Tab
                      </a>
                    </div>
                  </div>
                ) : previewFile.type === 'pdf' ? (
                  <div className="w-full">
                    <div className="mb-4 text-center space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        PDF Preview Options
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <a 
                          href={previewFile.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          📖 Open in New Tab
                        </a>
                        <button
                          onClick={() => handleDownload(previewFile._id, previewFile.originalName || previewFile.title)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                        >
                          💾 Download
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = `https://docs.google.com/viewer?url=${encodeURIComponent(previewFile.url)}`;
                            link.target = '_blank';
                            link.click();
                          }}
                          className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                        >
                          📱 Google Viewer
                        </button>
                      </div>
                    </div>
                    
                    {/* PDF.js viewer - works better with cross-origin files */}
                    <div className="relative mb-4">
                      <iframe
                        src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(previewFile.url)}`}
                        className="w-full h-96 rounded-lg border border-gray-300"
                        title={`${previewFile.title} - PDF.js Viewer`}
                        onLoad={() => console.log('PDF.js viewer loaded')}
                        onError={(e) => {
                          console.error('PDF.js viewer failed');
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div style={{ display: 'none' }} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                        {/* Fallback: Try Google Docs Viewer */}
                        <iframe
                          src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewFile.url)}&embedded=true`}
                          className="w-full h-80 rounded border border-gray-300 mb-4"
                          title={`${previewFile.title} - Google Docs Viewer`}
                          onLoad={() => console.log('Google Docs viewer loaded as fallback')}
                          onError={(e) => {
                            console.error('Google Docs viewer also failed');
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div style={{ display: 'none' }} className="text-center py-8">
                          <div className="text-4xl mb-4">📄</div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">PDF preview is not available</p>
                          <p className="text-sm text-gray-500 mb-4">
                            This may be due to browser security restrictions, CORS policies, or file hosting settings.
                          </p>
                          <div className="space-x-2">
                            <a
                              href={previewFile.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Open PDF in New Tab
                            </a>
                            <button
                              onClick={() => handleDownload(previewFile._id, previewFile.originalName || previewFile.title)}
                              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Download PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Debug info */}
                    <details className="mt-4">
                      <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                        🔧 Debug Info
                      </summary>
                      <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                        <p><strong>URL:</strong> {previewFile.url}</p>
                        <p><strong>Type:</strong> {previewFile.type}</p>
                        <p><strong>MIME:</strong> {previewFile.mimetype}</p>
                        <p><strong>Size:</strong> {formatFileSize(previewFile.size)}</p>
                      </div>
                    </details>
                  </div>
                ) : previewFile.mimetype && previewFile.mimetype.startsWith('text/') ? (
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="mb-2 text-center">
                      <a
                        href={previewFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        Open Text File in New Tab
                      </a>
                    </div>
                    <iframe
                      src={previewFile.url}
                      className="w-full h-96 rounded border"
                      title={previewFile.title}
                      onLoad={() => console.log('Text file loaded successfully')}
                      onError={() => console.error('Text file failed to load')}
                    />
                  </div>
                ) : previewFile.type === 'video' || (previewFile.mimetype && previewFile.mimetype.startsWith('video/')) ? (
                  <div className="w-full text-center">
                    <video 
                      controls 
                      className="w-full max-h-96 rounded-lg mx-auto"
                      preload="metadata"
                      onLoadedMetadata={() => console.log('Video metadata loaded')}
                      onError={() => console.error('Video failed to load')}
                    >
                      <source src={previewFile.url} type={previewFile.mimetype} />
                      Your browser does not support the video tag.
                    </video>
                    <div className="mt-2">
                      <a
                        href={previewFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        Open Video in New Tab
                      </a>
                    </div>
                  </div>
                ) : previewFile.type === 'audio' || (previewFile.mimetype && previewFile.mimetype.startsWith('audio/')) ? (
                  <div className="w-full text-center py-8">
                    <div className="text-6xl mb-4">🎵</div>
                    <audio 
                      controls 
                      className="w-full max-w-md mx-auto mb-4"
                      preload="metadata"
                      onLoadedMetadata={() => console.log('Audio metadata loaded')}
                      onError={() => console.error('Audio failed to load')}
                    >
                      <source src={previewFile.url} type={previewFile.mimetype} />
                      Your browser does not support the audio tag.
                    </audio>
                    <div>
                      <a
                        href={previewFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        Open Audio in New Tab
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">{getFileIcon(previewFile.type)}</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{previewFile.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Preview not available for this file type</p>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">File type: {previewFile.mimetype}</p>
                      <p className="text-sm text-gray-500">Size: {formatFileSize(previewFile.size)}</p>
                      <p className="text-sm text-gray-500">URL: {previewFile.url ? 'Available' : 'Not Available'}</p>
                    </div>
                    <div className="mt-4 space-x-2">
                      <button
                        onClick={() => handleDownload(previewFile._id, previewFile.originalName || previewFile.title)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Download to View
                      </button>
                      {previewFile.url && (
                        <a
                          href={previewFile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Open in New Tab
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileLearningPage;
