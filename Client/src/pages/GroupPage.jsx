import React from 'react';
import { Users, Plus, MessageSquare } from 'lucide-react';

const GroupPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Groups & Communities</h1>
                <p className="text-gray-600">Join groups and swap with like-minded people</p>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create Group</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Tech Enthusiasts</h3>
                  <p className="text-gray-500 text-sm">1,234 members</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Trade gadgets, electronics, and tech accessories with fellow tech lovers.
              </p>
              <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg font-medium transition-colors">
                Join Group
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fashion Forward</h3>
                  <p className="text-gray-500 text-sm">856 members</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Swap clothes, accessories, and fashion items with style-conscious community.
              </p>
              <button className="w-full bg-green-50 hover:bg-green-100 text-green-600 py-2 rounded-lg font-medium transition-colors">
                Join Group
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Book Lovers</h3>
                  <p className="text-gray-500 text-sm">642 members</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Exchange books, magazines, and reading materials with fellow bookworms.
              </p>
              <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-600 py-2 rounded-lg font-medium transition-colors">
                Join Group
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500">More groups and community features coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;