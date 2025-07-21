import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HeroPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const features = [
    {
      title: "Skill Swapping",
      description: "Exchange your skills with others and learn new ones",
      gradient: "from-blue-500 to-purple-600",
      action: () => navigate('/swap-request')
    },
    {
      title: "Learning Platform",
      description: "Access comprehensive learning resources and tools",
      gradient: "from-purple-500 to-pink-600",
      action: () => navigate('/skill-learning')
    },
    {
      title: "Community Groups",
      description: "Join groups and connect with like-minded learners",
      gradient: "from-pink-500 to-red-600",
      action: () => navigate('/groups')
    },
    {
      title: "Friend Network",
      description: "Build your network and learn together",
      gradient: "from-green-500 to-blue-600",
      action: () => navigate('/friends')
    }
  ];

  const stats = [
    { label: "Active Users", value: "10,000+", gradient: "from-blue-400 to-blue-600" },
    { label: "Skills Exchanged", value: "25,000+", gradient: "from-purple-400 to-purple-600" },
    { label: "Learning Hours", value: "50,000+", gradient: "from-pink-400 to-pink-600" },
    { label: "Success Stories", value: "1,500+", gradient: "from-green-400 to-green-600" }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to LearnLink
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Hello, {user?.name}! Ready to exchange knowledge?
            </p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl border border-white/30 dark:border-gray-700/30 hover:bg-white/30 transition-all duration-200"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/30 dark:border-gray-700/30">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Exchange Skills, 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Learn Together</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Connect with passionate learners, share your expertise, and discover new skills in our vibrant community. 
              From coding to cooking, art to analytics - there's something for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/swap-request')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg"
              >
                Start Learning
              </button>
              <button
                onClick={() => navigate('/skill-learning')}
                className="px-8 py-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-700/30 text-gray-900 dark:text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold text-lg"
              >
                Explore Learning
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 text-center">
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group cursor-pointer"
              onClick={feature.action}
            >
              <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 hover:bg-white/30 transition-all duration-300 group-hover:scale-105">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 flex items-center justify-center`}>
                  <div className="text-white text-2xl font-bold">
                    {feature.title.charAt(0)}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {feature.description}
                </p>
                <div className="mt-6">
                  <span className={`inline-flex items-center text-transparent bg-gradient-to-r ${feature.gradient} bg-clip-text font-semibold group-hover:underline`}>
                    Learn More →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/30 dark:border-gray-700/30">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            How LearnLink Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Share Your Skills</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create your profile and list the skills you'd like to teach or share with others
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Find & Connect</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Discover people with skills you want to learn and send swap requests
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Learn Together</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Exchange knowledge through our learning platform with videos, files, and live collaboration
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 dark:border-gray-700/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-center"
            >
              <div className="font-semibold mb-1">My Profile</div>
              <div className="text-sm opacity-90">View & Edit</div>
            </button>
            <button
              onClick={() => navigate('/swap-requests')}
              className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-center"
            >
              <div className="font-semibold mb-1">My Swaps</div>
              <div className="text-sm opacity-90">Check Status</div>
            </button>
            <button
              onClick={() => navigate('/groups')}
              className="p-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 text-center"
            >
              <div className="font-semibold mb-1">Groups</div>
              <div className="text-sm opacity-90">Join & Create</div>
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 text-center"
            >
              <div className="font-semibold mb-1">Upload</div>
              <div className="text-sm opacity-90">Share Content</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;
