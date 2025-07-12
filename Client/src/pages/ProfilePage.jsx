import React from 'react';
import { User, Settings, Camera, Star } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Page</h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <Settings className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Account Settings</h3>
              <p className="text-gray-600 text-sm">Update your personal information</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <Camera className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Profile Photo</h3>
              <p className="text-gray-600 text-sm">Upload your profile picture</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <Star className="h-8 w-8 text-yellow-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Ratings & Reviews</h3>
              <p className="text-gray-600 text-sm">View your swap history</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500">This page is under development. More features coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;