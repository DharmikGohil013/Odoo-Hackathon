import React from 'react';
import { Users, UserPlus, MessageCircle } from 'lucide-react';

const FriendsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <Users className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Friends & Connections</h1>
              <p className="text-gray-600">Connect with other SwapConnect users</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <UserPlus className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Find Friends</h3>
              <p className="text-gray-600 text-sm">Discover and connect with new people</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <MessageCircle className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Messages</h3>
              <p className="text-gray-600 text-sm">Chat with your connections</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Friend List</h3>
              <p className="text-gray-600 text-sm">Manage your connections</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500">Friends feature coming soon! Stay tuned.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;