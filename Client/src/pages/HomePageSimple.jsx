import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, RefreshCw, Star } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
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
                to="/register"
                className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full hover:bg-white/30 transition-all duration-200"
              >
                <Users className="h-5 w-5 mr-2" />
                Share Your Skills
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">12,500</div>
              <div className="text-gray-600">Active Members</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">8,750</div>
              <div className="text-gray-600">Successful Swaps</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">456</div>
              <div className="text-gray-600">Active Swaps</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">24</div>
              <div className="text-gray-600">Skill Categories</div>
            </div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Skill Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of learners and experts who are already growing their skills through meaningful exchanges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
