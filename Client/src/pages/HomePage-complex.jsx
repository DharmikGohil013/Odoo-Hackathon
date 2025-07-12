import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  TrendingUp, 
  Users, 
  RefreshCw, 
  Star, 
  ArrowRight,
  Code,
  Design,
  Camera,
  Music,
  Languages,
  BookOpen,
  Zap,
  Target,
  Award,
  Clock
} from 'lucide-react';
import { userService } from '../services/userService';
import { swapService } from '../services/swapService';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const HomePage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [popularSkills, setPopularSkills] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSwaps: 0,
    activeSwaps: 0,
    skillCategories: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load featured users
      const usersResponse = await userService.searchUsers({
        limit: 6,
        sortBy: 'rating'
      });
      setFeaturedUsers(usersResponse.users);

      // Load recent swaps for future use
      await swapService.getSwaps({
        status: 'completed',
        limit: 5
      });

      // Mock stats
      setStats({
        totalUsers: 12500,
        totalSwaps: 8750,
        activeSwaps: 456,
        skillCategories: 24
      });

      // Popular skills
      setPopularSkills([
        { name: 'React.js', category: 'Programming', count: 234, icon: Code },
        { name: 'UI/UX Design', category: 'Design', count: 189, icon: Design },
        { name: 'Photography', category: 'Creative', count: 156, icon: Camera },
        { name: 'Music Production', category: 'Audio', count: 98, icon: Music },
        { name: 'Spanish', category: 'Languages', count: 167, icon: Languages },
        { name: 'Content Writing', category: 'Writing', count: 145, icon: BookOpen }
      ]);

    } catch (error) {
      console.error('Error loading homepage data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSwapRequest = async (userId) => {
    try {
      await swapService.createSwapRequest({
        recipientId: userId,
        message: 'Hi! I\'d love to explore a skill swap with you.',
        skillsOffered: user?.skillsOffered || [],
        skillsWanted: user?.skillsWanted || []
      });
      showToast('Swap request sent successfully!', 'success');
    } catch (error) {
      console.error('Error sending swap request:', error);
      showToast('Failed to send swap request', 'error');
    }
  };

  const handleSearch = (searchData) => {
    // Navigate to search results page with filters
    const params = new URLSearchParams();
    if (searchData.query) params.append('q', searchData.query);
    if (searchData.location) params.append('location', searchData.location);
    if (searchData.skills?.length) params.append('skills', searchData.skills.join(','));
    if (searchData.availability) params.append('availability', searchData.availability);
    
    window.location.href = `/search?${params.toString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Exchange Skills,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Grow Together
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Connect with learners and experts worldwide. Trade your skills for new ones and build meaningful relationships.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <SearchBar onSearch={handleSearch} className="bg-white/95 backdrop-blur-sm" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="inline-flex items-center px-8 py-3 text-lg font-medium text-indigo-600 bg-white rounded-full hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Search className="h-5 w-5 mr-2" />
                Find Skills
              </Link>
              <Link
                to="/profile/edit"
                className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full hover:bg-white/30 transition-all duration-200"
              >
                <Users className="h-5 w-5 mr-2" />
                Share Your Skills
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-yellow-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-purple-400/20 rounded-full animate-ping"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.totalUsers.toLocaleString()}
              </div>
              <div className="text-gray-600">Active Members</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.totalSwaps.toLocaleString()}
              </div>
              <div className="text-gray-600">Successful Swaps</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.activeSwaps}
              </div>
              <div className="text-gray-600">Active Swaps</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.skillCategories}
              </div>
              <div className="text-gray-600">Skill Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Skills */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Skills</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the most popular skills being shared on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularSkills.map((skill, index) => {
              const IconComponent = skill.icon;
              return (
                <Link
                  key={index}
                  to={`/search?skills=${encodeURIComponent(skill.name)}`}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white group-hover:scale-110 transition-transform duration-200">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {skill.name}
                      </h3>
                      <p className="text-sm text-gray-500">{skill.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{skill.count}</div>
                      <div className="text-xs text-gray-500">members</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Members */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Members</h2>
              <p className="text-lg text-gray-600">
                Connect with our top-rated skill sharers
              </p>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredUsers.map((featuredUser) => (
              <UserCard
                key={featuredUser.id}
                user={featuredUser}
                onSwapRequest={handleSwapRequest}
                showActions={!!user}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How SkillSwap Works</h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Start sharing and learning in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
              <p className="text-indigo-100">
                Tell us about your skills and what you'd like to learn. Upload your portfolio and set your availability.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Find & Connect</h3>
              <p className="text-indigo-100">
                Search for people with complementary skills. Send swap requests and start conversations.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Learn & Teach</h3>
              <p className="text-indigo-100">
                Schedule sessions, share knowledge, and grow together. Build lasting professional relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Skill Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of learners and experts who are already growing their skills through meaningful exchanges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/search"
                  className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Start Exploring
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-3 text-lg font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;