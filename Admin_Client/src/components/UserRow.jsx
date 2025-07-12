import { useState } from 'react'
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  ShieldOff, 
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export default function UserRow({ user, onBan, onUnban }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleBanClick = async () => {
    setIsLoading(true)
    try {
      await onBan()
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnbanClick = async () => {
    setIsLoading(true)
    try {
      await onUnban()
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
      {/* User Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {user.profilePicture ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={user.profilePicture}
                alt={user.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user.name || 'Unknown User'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {user.email}
            </div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.isBanned
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        }`}>
          {user.isBanned ? (
            <>
              <AlertCircle className="w-3 h-3 mr-1" />
              Banned
            </>
          ) : (
            <>
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </>
          )}
        </span>
      </td>

      {/* Skills */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
          <Award className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
          <span>{user.skills?.length || 0} skills</span>
        </div>
      </td>

      {/* Joined Date */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2" />
          {formatDate(user.createdAt)}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          {user.isBanned ? (
            <button
              onClick={handleUnbanClick}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1.5 border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-700 mr-1"></div>
              ) : (
                <Shield className="h-3 w-3 mr-1" />
              )}
              Unban
            </button>
          ) : (
            <button
              onClick={handleBanClick}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-700 mr-1"></div>
              ) : (
                <ShieldOff className="h-3 w-3 mr-1" />
              )}
              Ban
            </button>
          )}
          
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md text-sm font-medium">
            View Details
          </button>
        </div>
      </td>
    </tr>
  )
}