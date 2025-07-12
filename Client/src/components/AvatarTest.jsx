// Test file to demonstrate Avatar component functionality
import React from 'react';
import Avatar from './Avatar';

const AvatarTest = () => {
  const testUsers = [
    { name: 'John Doe', profile_photo: null },
    { name: 'Jane Smith', profile_photo: null },
    { name: 'Alice Johnson', profile_photo: null },
    { name: 'Bob Wilson', profile_photo: null },
    { name: 'Charlie Brown', profile_photo: null },
    { name: 'Diana Prince', profile_photo: null },
    { name: 'Frank Miller', profile_photo: null },
    { name: 'Grace Lee', profile_photo: null },
    { name: 'Henry Clark', profile_photo: null },
    { name: 'Ivy Green', profile_photo: null },
    { name: 'Jack', profile_photo: null }, // Single name test
    { name: '', profile_photo: null }, // Empty name test
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Avatar Component Test</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Different Sizes</h3>
        <div className="flex items-end space-x-4">
          <div className="text-center">
            <Avatar user={{ name: 'John Doe' }} size="sm" />
            <p className="mt-2 text-sm">Small</p>
          </div>
          <div className="text-center">
            <Avatar user={{ name: 'Jane Smith' }} size="md" />
            <p className="mt-2 text-sm">Medium</p>
          </div>
          <div className="text-center">
            <Avatar user={{ name: 'Alice Johnson' }} size="lg" />
            <p className="mt-2 text-sm">Large</p>
          </div>
          <div className="text-center">
            <Avatar user={{ name: 'Bob Wilson' }} size="xl" />
            <p className="mt-2 text-sm">Extra Large</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Different Users (with generated colors)</h3>
        <div className="grid grid-cols-6 gap-4">
          {testUsers.map((user, index) => (
            <div key={index} className="text-center">
              <Avatar user={user} size="md" />
              <p className="mt-2 text-xs truncate">{user.name || 'No Name'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">With Profile Photo</h3>
        <div className="flex space-x-4">
          <div className="text-center">
            <Avatar 
              user={{ 
                name: 'User With Photo', 
                profile_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' 
              }} 
              size="lg" 
            />
            <p className="mt-2 text-sm">With Photo</p>
          </div>
          <div className="text-center">
            <Avatar user={{ name: 'Fallback User' }} size="lg" />
            <p className="mt-2 text-sm">Fallback Initials</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarTest;
