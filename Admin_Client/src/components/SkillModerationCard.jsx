import { useState } from 'react'
import { 
  Award, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Tag
} from 'lucide-react'

export default function SkillModerationCard({ skill, onApprove, onReject }) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      await onApprove()
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    setIsRejecting(true)
    try {
      await onReject()
    } finally {
      setIsRejecting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />
      case 'approved':
        return <CheckCircle className="w-3 h-3" />
      case 'rejected':
        return <XCircle className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {skill.name}
            </h3>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(skill.status)}`}>
            {getStatusIcon(skill.status)}
            <span className="ml-1 capitalize">{skill.status}</span>
          </span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-3">
          {skill.description || 'No description provided'}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <div className="flex items-center text-sm text-gray-600">
          <Tag className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">Category:</span>
          <span className="ml-1">{skill.category || 'Uncategorized'}</span>
        </div>

        {/* User Info */}
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">Submitted by:</span>
          <span className="ml-1">{skill.user?.name || 'Unknown User'}</span>
        </div>

        {/* Date */}
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">Submitted:</span>
          <span className="ml-1">{formatDate(skill.createdAt)}</span>
        </div>

        {/* Level */}
        {skill.level && (
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-600 mr-2">Level:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              skill.level === 'beginner' ? 'bg-green-100 text-green-800' :
              skill.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
            </span>
          </div>
        )}

        {/* Media Preview */}
        {skill.media && skill.media.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-600">Attachments:</span>
            <div className="grid grid-cols-2 gap-2">
              {skill.media.slice(0, 4).map((mediaItem, index) => (
                <div key={index} className="relative">
                  {mediaItem.type === 'image' ? (
                    <img
                      src={mediaItem.url}
                      alt="Skill media"
                      className="w-full h-20 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Media</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {skill.media.length > 4 && (
              <p className="text-xs text-gray-500">+{skill.media.length - 4} more files</p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {skill.status === 'pending' && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={handleReject}
              disabled={isRejecting || isApproving}
              className="flex items-center px-4 py-2 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRejecting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Reject
            </button>
            
            <button
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
              className="flex items-center px-4 py-2 text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 mr-2"></div>
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Approve
            </button>
          </div>
        </div>
      )}
    </div>
  )
}