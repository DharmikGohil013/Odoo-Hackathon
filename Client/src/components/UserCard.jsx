import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar';

const UserCard = ({ user, showActions = true }) => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(
    currentUser?.friends?.includes(user._id) || false
  );

  const handleAddFriend = async () => {
    try {
      setLoading(true);
      await userService.addFriend(user._id);
      setIsFriend(true);
    } catch (error) {
      console.error('Failed to add friend:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      setLoading(true);
      await userService.removeFriend(user._id);
      setIsFriend(false);
    } catch (error) {
      console.error('Failed to remove friend:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async () => {
    if (window.confirm('Are you sure you want to block this user?')) {
      try {
        setLoading(true);
        await userService.blockUser(user._id);
        // You might want to remove this user from the current view
      } catch (error) {
        console.error('Failed to block user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isCurrentUser = currentUser?._id === user._id;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar user={user} size="md" />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {user.name}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.location && (
              <p className="text-sm text-gray-500">📍 {user.location}</p>
            )}
            {user.college_or_company && (
              <p className="text-sm text-gray-500">🏢 {user.college_or_company}</p>
            )}
          </div>
          
          {user.rating > 0 && (
            <div className="flex items-center">
              <span className="text-yellow-400">⭐</span>
              <span className="ml-1 text-sm text-gray-600">
                {user.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Skills Preview */}
        <div className="mt-4">
          {user.skills_offered && user.skills_offered.length > 0 && (
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-700 mb-1">Skills Offered:</p>
              <div className="flex flex-wrap gap-1">
                {user.skills_offered.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {skill.name}
                  </span>
                ))}
                {user.skills_offered.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{user.skills_offered.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {user.skills_wanted && user.skills_wanted.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Skills Wanted:</p>
              <div className="flex flex-wrap gap-1">
                {user.skills_wanted.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill.name}
                  </span>
                ))}
                {user.skills_wanted.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{user.skills_wanted.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Availability */}
        {user.availability && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Available: {user.availability}
            </span>
          </div>
        )}

        {/* Actions */}
        {showActions && !isCurrentUser && (
          <div className="mt-4 flex space-x-2">
            <Link
              to={`/profile/${user._id}`}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 text-center"
            >
              View Profile
            </Link>
            
            {isFriend ? (
              <button
                onClick={handleRemoveFriend}
                disabled={loading}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Remove Friend'}
              </button>
            ) : (
              <button
                onClick={handleAddFriend}
                disabled={loading}
                className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Add Friend'}
              </button>
            )}
            
            <button
              onClick={handleBlockUser}
              disabled={loading}
              className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              title="Block User"
            >
              🚫
            </button>
          </div>
        )}

        {isCurrentUser && (
          <div className="mt-4">
            <Link
              to="/profile"
              className="w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 text-center block"
            >
              Edit Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
