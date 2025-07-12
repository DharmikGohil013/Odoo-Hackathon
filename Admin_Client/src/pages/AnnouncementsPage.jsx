import { useState } from 'react'
import { 
  useGetAnnouncementsQuery, 
  usePostAnnouncementMutation 
} from '../store/api/adminApi'
import AnnouncementForm from '../components/AnnouncementForm'
import { 
  Megaphone, 
  Calendar, 
  Eye, 
  Plus, 
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export default function AnnouncementsPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: announcements, isLoading, error, refetch } = useGetAnnouncementsQuery()
  const [postAnnouncement, { isLoading: isPosting }] = usePostAnnouncementMutation()

  const handlePostAnnouncement = async (announcementData) => {
    try {
      await postAnnouncement(announcementData).unwrap()
      setShowForm(false)
      refetch()
    } catch (error) {
      console.error('Failed to post announcement:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAnnouncementTypeColor = (type) => {
    switch (type) {
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'update':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'warning':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'info':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAnnouncementIcon = (type) => {
    switch (type) {
      case 'maintenance':
        return <AlertCircle className="w-5 h-5" />
      case 'update':
        return <CheckCircle className="w-5 h-5" />
      case 'warning':
        return <AlertCircle className="w-5 h-5" />
      case 'info':
      default:
        return <Megaphone className="w-5 h-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Failed to load announcements. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-2">Create and manage platform-wide announcements</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button 
            onClick={refetch}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Announcements</p>
              <p className="text-3xl font-bold text-gray-900">{announcements?.length || 0}</p>
            </div>
            <Megaphone className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900">
                {announcements?.filter(announcement => {
                  const announcementDate = new Date(announcement.createdAt)
                  const currentMonth = new Date().getMonth()
                  return announcementDate.getMonth() === currentMonth
                }).length || 0}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-gray-900">
                {announcements?.filter(announcement => announcement.isActive).length || 0}
              </p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Announcement Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AnnouncementForm
              onSubmit={handlePostAnnouncement}
              onCancel={() => setShowForm(false)}
              isLoading={isPosting}
            />
          </div>
        </div>
      )}

      {/* Announcements List */}
      {!announcements || announcements.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 text-center py-12">
          <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
          <p className="text-gray-500 mb-4">Create your first announcement to communicate with users</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Announcement
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div key={announcement._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getAnnouncementTypeColor(announcement.type)}`}>
                        {getAnnouncementIcon(announcement.type)}
                        <span className="ml-1 capitalize">{announcement.type || 'info'}</span>
                      </span>
                      {announcement.isActive && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {announcement.title || 'Untitled Announcement'}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(announcement.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {announcement.message}
                  </p>
                </div>

                {/* Metadata */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-6">
                      {announcement.priority && (
                        <div className="flex items-center">
                          <span className="font-medium">Priority:</span>
                          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                            announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                            announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                          </span>
                        </div>
                      )}
                      {announcement.expiresAt && (
                        <div className="flex items-center">
                          <span className="font-medium">Expires:</span>
                          <span className="ml-2">{formatDate(announcement.expiresAt)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}