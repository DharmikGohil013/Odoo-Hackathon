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
        // Remove user from current view logic can go here
      } catch (error) {
        console.error('Failed to block user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isCurrentUser = currentUser?._id === user._id;

  return (
    <div className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden">
      {/* Header with Avatar and Rating */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar user={user} size="lg" className="ring-2 ring-white/50 dark:ring-gray-700/50" />
              {user.rating > 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                  <span>⭐</span>
                  <span>{user.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {user.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
              {user.location && (
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{user.location}</span>
                </div>
              )}
              {user.college_or_company && (
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="truncate">{user.college_or_company}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="px-6 pb-4 space-y-4">
        {user.skills_offered && user.skills_offered.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                OFFERS
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.skills_offered.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-sm">
                  {skill.name}
                </span>
              ))}
              {user.skills_offered.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                  +{user.skills_offered.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {user.skills_wanted && user.skills_wanted.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                WANTS
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.skills_wanted.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-sm">
                  {skill.name}
                </span>
              ))}
              {user.skills_wanted.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                  +{user.skills_wanted.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Availability Badge */}
        {user.availability && (
          <div className="flex items-center justify-center">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow-sm">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Available: {user.availability}
            </span>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      {showActions && (
        <div className="px-6 pb-6">
          {!isCurrentUser ? (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to={`/profile/${user._id}`}
                className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Profile
              </Link>
              <div className="flex space-x-1">
                {isFriend ? (
                  <button
                    onClick={handleRemoveFriend}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center px-3 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleAddFriend}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center px-3 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Friend
                      </>
                    )}
                  </button>
                )}
                
              </div>
            </div>
          ) : (
            <Link
              to="/profile"
              className="flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;
