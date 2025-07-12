import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { videoService } from '../services/videoService';

const VideoLearningPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [stream, setStream] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }

    fetchVideos();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const fetchVideos = async () => {
    try {
      const response = await videoService.getVideos();
      setVideos(response.data || []);
    } catch (error) {
      showError('Failed to fetch videos');
    }
  };

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: true
      });

      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;

      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        
        // Stop all tracks
        mediaStream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setStream(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
      showSuccess('Recording started');
    } catch (error) {
      showError('Failed to start recording. Please check camera permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      showSuccess('Recording stopped');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      showError('Video file size must be less than 50MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      showError('Please select a video file');
      return;
    }

    setRecordedBlob(file);
  };

  const uploadVideo = async () => {
    if (!recordedBlob) return;

    const title = prompt('Enter video title:');
    if (!title) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('video', recordedBlob);
    formData.append('title', title);

    try {
      await videoService.uploadVideo(formData);
      showSuccess('Video uploaded successfully');
      setRecordedBlob(null);
      fetchVideos();
    } catch (error) {
      showError('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const playVideo = (video) => {
    setPlayingVideo(video);
  };

  const deleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      await videoService.deleteVideo(videoId);
      showSuccess('Video deleted successfully');
      fetchVideos();
    } catch (error) {
      showError('Failed to delete video');
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'mine' && video.uploadedBy?._id === user._id) ||
      (filter === 'others' && video.uploadedBy?._id !== user._id);
    return matchesSearch && matchesFilter;
  });

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Video Learning</h1>
              <p className="text-gray-600 dark:text-gray-400">Record and share video tutorials</p>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl border border-white/30 dark:border-gray-700/30 hover:bg-white/30 transition-all duration-200"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Recording Section */}
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30 dark:border-gray-700/30">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Record Video</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera Preview */}
            <div className="space-y-4">
              <div className="bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                  style={{ display: stream ? 'block' : 'none' }}
                />
                {!stream && !isRecording && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">📹</div>
                      <p>Click "Start Recording" to begin</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    🔴 Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    ⏹️ Stop Recording
                  </button>
                )}
              </div>
            </div>

            {/* Upload Options */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Or Upload Video File</h3>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-lg text-gray-900 dark:text-white"
                />
              </div>

              {recordedBlob && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-800 dark:text-green-200">
                      Video ready for upload ({formatFileSize(recordedBlob.size)})
                    </p>
                  </div>
                  <button
                    onClick={uploadVideo}
                    disabled={isUploading}
                    className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isUploading ? 'Uploading...' : 'Upload Video'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30 dark:border-gray-700/30">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search videos..."
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
              <option value="all">All Videos</option>
              <option value="mine">My Videos</option>
              <option value="others">Others' Videos</option>
            </select>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <div key={video._id} className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 dark:border-gray-700/30 hover:bg-white/30 transition-all duration-200">
              <div className="aspect-video bg-black relative cursor-pointer" onClick={() => playVideo(video)}>
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-white text-4xl">▶️</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  By {video.uploadedBy?.name || 'Unknown'}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => playVideo(video)}
                    className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    Play
                  </button>
                  {video.uploadedBy?._id === user._id && (
                    <button
                      onClick={() => deleteVideo(video._id)}
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

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No videos found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filter !== 'all' ? 'Try adjusting your search or filter' : 'Record your first video to get started'}
            </p>
          </div>
        )}

        {/* Video Player Modal */}
        {playingVideo && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{playingVideo.title}</h3>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="aspect-video bg-black">
                <video
                  src={playingVideo.url}
                  controls
                  className="w-full h-full"
                  autoPlay
                />
              </div>
              <div className="p-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Uploaded by {playingVideo.uploadedBy?.name || 'Unknown'} • 
                  {playingVideo.duration && ` ${formatDuration(playingVideo.duration)} • `}
                  {new Date(playingVideo.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLearningPage;
