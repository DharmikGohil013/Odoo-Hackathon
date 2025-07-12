import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Plus, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Bell,
  Gift,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Filter,
  Search
} from 'lucide-react';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeSwaps, setActiveSwaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalSwaps: 0,
    activeSwaps: 0,
    savedItems: 0,
    rating: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock active swaps
    setActiveSwaps([
      {
        id: 1,
        title: "iPhone 12 Pro",
        category: "Electronics",
        location: "New York, NY",
        timeLeft: "2 days",
        image: "/api/placeholder/400/300",
        status: "pending",
        offers: 3
      },
      {
        id: 2,
        title: "Designer Handbag",
        category: "Fashion",
        location: "Los Angeles, CA",
        timeLeft: "5 days",
        image: "/api/placeholder/400/300",
        status: "active",
        offers: 7
      }
    ]);

    // Mock recommendations
    setRecommendations([
      {
        id: 1,
        title: "MacBook Pro 2021",
        category: "Electronics",
        distance: "2.5 miles",
        rating: 4.8,
        image: "/api/placeholder/400/300",
        swapValue: "$1,200"
      },
      {
        id: 2,
        title: "Vintage Camera",
        category: "Photography",
        distance: "1.2 miles",
        rating: 4.9,
        image: "/api/placeholder/400/300",
        swapValue: "$800"
      },
      {
        id: 3,
        title: "Gaming Console",
        category: "Gaming",
        distance: "3.1 miles",
        rating: 4.7,
        image: "/api/placeholder/400/300",
        swapValue: "$500"
      }
    ]);

    // Mock recent activity
    setRecentActivity([
      {
        id: 1,
        type: "swap_completed",
        message: "Successfully swapped iPhone 11 with John Doe",
        time: "2 hours ago",
        icon: "✅"
      },
      {
        id: 2,
        type: "new_offer",
        message: "New offer received for Designer Watch",
        time: "5 hours ago",
        icon: "💰"
      },
      {
        id: 3,
        type: "rating",
        message: "Received 5-star rating from Sarah Wilson",
        time: "1 day ago",
        icon: "⭐"
      }
    ]);

    // Mock stats
    setStats({
      totalSwaps: 24,
      activeSwaps: 3,
      savedItems: 12,
      rating: 4.8
    });
  };

  if (!isAuthenticated) {
    return <WelcomePage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Ready to make some amazing swaps today?
              </p>
            </div>
            <Link
              to="/swap/create"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Swap</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Swaps</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSwaps}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Swaps</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeSwaps}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Saved Items</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.savedItems}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Gift className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Swaps Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Active Swaps</h2>
                  <Link 
                    to="/swaps"
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                  >
                    <span>View all</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {activeSwaps.length > 0 ? (
                  <div className="grid gap-4">
                    {activeSwaps.map((swap) => (
                      <div key={swap.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Gift className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{swap.title}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{swap.location}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{swap.timeLeft} left</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            swap.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {swap.status}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{swap.offers} offers</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No active swaps</h3>
                    <p className="text-gray-500 mb-4">Start your first swap to connect with others!</p>
                    <Link
                      to="/swap/create"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Create Your First Swap
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Filter className="h-5 w-5" />
                    </button>
                    <Link 
                      to="/recommendations"
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                    >
                      <span>View all</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                      <div className="aspect-w-16 aspect-h-10 bg-gray-200">
                        <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <Gift className="h-12 w-12 text-gray-400" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>{item.distance}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-600">{item.rating}</span>
                          </div>
                        </div>
                        <div className="mt-3 text-lg font-semibold text-gray-900">
                          {item.swapValue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/swap/create"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Create New Swap</span>
                </Link>
                
                <Link
                  to="/browse"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Search className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900">Browse Items</span>
                </Link>
                
                <Link
                  to="/groups"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-900">Join Groups</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Bell className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="text-lg">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Upcoming Events</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Community Swap Meet</h4>
                  <p className="text-blue-100 text-sm">Tomorrow, 2:00 PM</p>
                </div>
                <div>
                  <h4 className="font-medium">Tech Gadgets Fair</h4>
                  <p className="text-blue-100 text-sm">Friday, 10:00 AM</p>
                </div>
              </div>
              <button className="mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                View All Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Welcome page for non-authenticated users
const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SwapConnect
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The smartest way to swap, trade, and connect with your community. 
              Transform your unused items into treasures you actually want.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Matching</h3>
              <p className="text-gray-600">
                Our AI-powered system finds the perfect swap matches based on your preferences and location.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Groups</h3>
              <p className="text-gray-600">
                Join local communities and special interest groups to swap with like-minded people.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Safe & Secure</h3>
              <p className="text-gray-600">
                Built-in verification, ratings, and secure messaging keep your swaps safe and trustworthy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;