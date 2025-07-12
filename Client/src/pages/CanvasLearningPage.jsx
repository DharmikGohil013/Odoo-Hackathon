import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import io from 'socket.io-client';

const CanvasLearningPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const socketRef = useRef(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }

    initializeCanvas();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
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

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = currentColor;
    context.lineWidth = lineWidth;
    contextRef.current = context;
  };

  const connectToRoom = () => {
    if (!roomId.trim()) {
      showError('Please enter a room ID');
      return;
    }

    try {
      socketRef.current = io('http://localhost:5000', {
        transports: ['websocket']
      });

      socketRef.current.emit('join-canvas-room', {
        roomId: roomId.trim(),
        user: {
          id: user._id,
          name: user.name
        }
      });

      socketRef.current.on('canvas-drawing', (data) => {
        drawFromSocket(data);
      });

      socketRef.current.on('canvas-clear', () => {
        clearCanvas();
      });

      socketRef.current.on('room-users', (users) => {
        setConnectedUsers(users);
      });

      socketRef.current.on('user-joined', (userData) => {
        setConnectedUsers(prev => [...prev, userData]);
        showSuccess(`${userData.name} joined the canvas`);
      });

      socketRef.current.on('user-left', (userData) => {
        setConnectedUsers(prev => prev.filter(u => u.id !== userData.id));
        showSuccess(`${userData.name} left the canvas`);
      });

      setIsConnected(true);
      showSuccess('Connected to canvas room');
    } catch (error) {
      showError('Failed to connect to canvas room');
    }
  };

  const disconnectFromRoom = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    setConnectedUsers([]);
    setRoomId('');
    showSuccess('Disconnected from canvas room');
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = nativeEvent;
    
    if (currentTool === 'eraser') {
      contextRef.current.globalCompositeOperation = 'destination-out';
    } else {
      contextRef.current.globalCompositeOperation = 'source-over';
      contextRef.current.strokeStyle = currentColor;
    }
    
    contextRef.current.lineWidth = lineWidth;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    // Emit drawing data to other users
    if (socketRef.current && isConnected) {
      socketRef.current.emit('canvas-drawing', {
        roomId,
        x: offsetX,
        y: offsetY,
        isDrawing: true,
        tool: currentTool,
        color: currentColor,
        lineWidth
      });
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    contextRef.current.closePath();
    setIsDrawing(false);

    if (socketRef.current && isConnected) {
      socketRef.current.emit('canvas-drawing', {
        roomId,
        isDrawing: false
      });
    }
  };

  const drawFromSocket = (data) => {
    if (!contextRef.current) return;

    if (data.isDrawing) {
      if (data.tool === 'eraser') {
        contextRef.current.globalCompositeOperation = 'destination-out';
      } else {
        contextRef.current.globalCompositeOperation = 'source-over';
        contextRef.current.strokeStyle = data.color;
      }
      
      contextRef.current.lineWidth = data.lineWidth;
      contextRef.current.lineTo(data.x, data.y);
      contextRef.current.stroke();
    } else {
      contextRef.current.closePath();
      contextRef.current.beginPath();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    
    if (socketRef.current && isConnected) {
      socketRef.current.emit('canvas-clear', { roomId });
    }
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `canvas-${new Date().toISOString()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    showSuccess('Canvas saved successfully');
  };

  const tools = [
    { id: 'pen', name: 'Pen', icon: '✏️' },
    { id: 'eraser', name: 'Eraser', icon: '🧽' }
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#FFC0CB', '#A52A2A', '#808080'
  ];

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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Canvas Learning</h1>
              <p className="text-gray-600 dark:text-gray-400">Real-time collaborative drawing</p>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl border border-white/30 dark:border-gray-700/30 hover:bg-white/30 transition-all duration-200"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Room Connection */}
        {!isConnected ? (
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30 dark:border-gray-700/30">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Join Canvas Room</h2>
            <div className="flex space-x-4">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID (e.g., room123)"
                className="flex-1 px-4 py-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                onClick={connectToRoom}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                Connect
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/30 dark:border-gray-700/30">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Room: {roomId}</h2>
                <p className="text-gray-600 dark:text-gray-400">Connected users: {connectedUsers.length}</p>
              </div>
              <button
                onClick={disconnectFromRoom}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 dark:border-gray-700/30">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tools</h3>
              
              {/* Drawing Tools */}
              <div className="space-y-3 mb-6">
                {tools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setCurrentTool(tool.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      currentTool === tool.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/20 text-gray-900 dark:text-white hover:bg-white/30'
                    }`}
                  >
                    <span className="mr-2">{tool.icon}</span>
                    {tool.name}
                  </button>
                ))}
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Colors</h4>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                        currentColor === color ? 'border-white shadow-lg scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Line Width */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Brush Size</h4>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{lineWidth}px</span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={clearCanvas}
                  className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear Canvas
                </button>
                <button
                  onClick={saveCanvas}
                  className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Canvas
                </button>
              </div>

              {/* Connected Users */}
              {isConnected && connectedUsers.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Online Users</h4>
                  <div className="space-y-2">
                    {connectedUsers.map(connectedUser => (
                      <div key={connectedUser.id} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{connectedUser.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 dark:border-gray-700/30">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-96 lg:h-[600px] bg-white rounded-lg cursor-crosshair border border-gray-200"
                style={{ touchAction: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasLearningPage;
