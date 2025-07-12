import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Star, 
  Calendar, 
  RefreshCw, 
  MessageSquare, 
  UserPlus,
  Heart,
  MoreVertical,
  Building,
  GraduationCap
} from 'lucide-react';
import { formatDate } from '../utils/formatDate';

const UserCard = ({ user, onSwapRequest, onAddFriend, showActions = true, size = 'default' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleSwapRequest = async () => {
    setIsLoading(true);
    try {
      await onSwapRequest?.(user.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async () => {
    try {
      await onAddFriend?.(user.id);
    } catch (error) {
      console.error('Failed to add friend:', error);
    }
  };

  const isCompact = size === 'compact';
  const isLarge = size === 'large';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${
      isCompact ? 'p-4' : 'p-6'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className={`relative ${isCompact ? 'w-12 h-12' : isLarge ? 'w-16 h-16' : 'w-14 h-14'}`}>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className={`text-white ${isCompact ? 'h-6 w-6' : 'h-8 w-8'}`} />
              </div>
            )}
            {/* Online Status */}
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className={`font-semibold text-gray-900 truncate ${
                isCompact ? 'text-sm' : 'text-base'
              }`}>
                <Link 
                  to={`/profile/${user.id}`}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {user.name}
                </Link>
              </h3>
              {user.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{user.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Location & Organization */}
            <div className={`space-y-1 ${isCompact ? 'text-xs' : 'text-sm'} text-gray-500`}>
              {user.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{user.location}</span>
                </div>
              )}
              {user.college && (
                <div className="flex items-center space-x-1">
                  <GraduationCap className="h-3 w-3" />
                  <span className="truncate">{user.college}</span>
                </div>
              )}
              {user.company && (
                <div className="flex items-center space-x-1">
                  <Building className="h-3 w-3" />
                  <span className="truncate">{user.company}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu */}
        {showActions && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <Link
                  to={`/profile/${user.id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowMenu(false)}
                >
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    handleAddFriend();
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Add Friend
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Save Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bio */}
      {user.bio && !isCompact && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {user.bio}
        </p>
      )}

      {/* Skills */}
      {user.skillsOffered && user.skillsOffered.length > 0 && (
        <div className="mb-4">
          <h4 className={`font-medium text-gray-900 mb-2 ${isCompact ? 'text-xs' : 'text-sm'}`}>
            Skills Offered
          </h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsOffered.slice(0, isCompact ? 2 : 3).map((skill, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium ${
                  isCompact ? 'text-xs' : 'text-xs'
                }`}
              >
                {skill}
              </span>
            ))}
            {user.skillsOffered.length > (isCompact ? 2 : 3) && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium ${
                isCompact ? 'text-xs' : 'text-xs'
              }`}>
                +{user.skillsOffered.length - (isCompact ? 2 : 3)}
              </span>
            )}
          </div>
        </div>
      )}

      {user.skillsWanted && user.skillsWanted.length > 0 && !isCompact && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Wanted</h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsWanted.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium"
              >
                {skill}
              </span>
            ))}
            {user.skillsWanted.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 font-medium">
                +{user.skillsWanted.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      {!isCompact && (
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            {user.totalSwaps && (
              <div className="flex items-center space-x-1">
                <RefreshCw className="h-4 w-4" />
                <span>{user.totalSwaps} swaps</span>
              </div>
            )}
            {user.joinedAt && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(user.joinedAt, 'MMM DD, YYYY')}</span>
              </div>
            )}
          </div>
          {user.lastSeen && !user.isOnline && (
            <span className="text-xs">
              Last seen {formatDate(user.lastSeen, 'relative')}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className={`flex items-center space-x-2 ${isCompact ? 'justify-center' : ''}`}>
          <button
            onClick={handleSwapRequest}
            disabled={isLoading}
            className={`flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-1 ${
              isCompact ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'
            }`}
          >
            <RefreshCw className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'} ${isLoading ? 'animate-spin' : ''}`} />
            <span>Request Swap</span>
          </button>
          
          {!isCompact && (
            <>
              <button
                onClick={handleAddFriend}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Add Friend"
              >
                <UserPlus className="h-4 w-4" />
              </button>
              
              <Link
                to={`/chat/${user.id}`}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Send Message"
              >
                <MessageSquare className="h-4 w-4" />
              </Link>
              
              <button
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Save Profile"
              >
                <Heart className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;