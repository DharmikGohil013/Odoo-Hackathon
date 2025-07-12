import { useState, useEffect } from 'react'
import { adminApi } from '../services/adminService'
import { LoadingTable, LoadingSpinner } from '../components/Loading'
import AnnouncementForm from '../components/AnnouncementForm'
import { 
  Megaphone, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  AlertTriangle,
  Calendar,
  Users,
  Star
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterImportant, setFilterImportant] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getAnnouncements()
      setAnnouncements(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch announcements')
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAnnouncement = async (announcementData) => {
    try {
      const response = await adminApi.createAnnouncement(announcementData)
      setAnnouncements([response.data, ...announcements])
      setShowCreateModal(false)
      toast.success('Announcement created successfully')
    } catch (error) {
      toast.error('Failed to create announcement')
      console.error('Error creating announcement:', error)
    }
  }

  const handleUpdateAnnouncement = async (announcementData) => {
    try {
      const response = await adminApi.updateAnnouncement(selectedAnnouncement.id, announcementData)
      setAnnouncements(announcements.map(announcement => 
        announcement.id === selectedAnnouncement.id ? response.data : announcement
      ))
      setShowEditModal(false)
      setSelectedAnnouncement(null)
      toast.success('Announcement updated successfully')
    } catch (error) {
      toast.error('Failed to update announcement')
      console.error('Error updating announcement:', error)
    }
  }

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return

    try {
      setActionLoading(prev => ({ ...prev, [`delete_${announcementId}`]: true }))
      await adminApi.deleteAnnouncement(announcementId)
      setAnnouncements(announcements.filter(announcement => announcement.id !== announcementId))
      toast.success('Announcement deleted successfully')
    } catch (error) {
      toast.error('Failed to delete announcement')
      console.error('Error deleting announcement:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${announcementId}`]: false }))
    }
  }

  const handleEditAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement)
    setShowEditModal(true)
  }

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterImportant === 'all') return matchesSearch
    if (filterImportant === 'important') return matchesSearch && announcement.is_important
    if (filterImportant === 'normal') return matchesSearch && !announcement.is_important
    
    return matchesSearch
  }) || []

  const stats = {
    total: announcements.length || 0,
    important: announcements.filter(announcement => announcement.is_important).length || 0,
    recent: announcements.filter(announcement => {
      const createdDate = new Date(announcement.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return createdDate > weekAgo
    }).length || 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
            <p className="text-gray-600">Create and manage platform announcements</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Announcement
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Announcements</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Megaphone className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Important</p>
              <p className="text-2xl font-bold text-orange-600">{stats.important}</p>
            </div>
            <Star className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-green-600">{stats.recent}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search announcements by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterImportant}
              onChange={(e) => setFilterImportant(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Announcements</option>
              <option value="important">Important Only</option>
              <option value="normal">Normal Only</option>
            </select>
          </div>
          <button
            onClick={fetchAnnouncements}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Announcements Table */}
      {loading ? (
        <LoadingTable rows={6} cols={5} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Announcements ({filteredAnnouncements.length})
            </h2>
          </div>
          
          {filteredAnnouncements.length === 0 ? (
            <div className="p-12 text-center">
              <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
              <p className="text-gray-500">No announcements match your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Announcement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAnnouncements.map((announcement) => (
                    <tr key={announcement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {announcement.is_important && (
                                <Star className="w-4 h-4 text-orange-500 mr-2" />
                              )}
                              {announcement.title}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 mt-1 truncate max-w-md">
                            {announcement.content}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          announcement.is_important 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {announcement.is_important ? 'Important' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{announcement.author || 'Admin'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditAnnouncement(announcement)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          disabled={actionLoading[`delete_${announcement.id}`]}
                          className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                        >
                          {actionLoading[`delete_${announcement.id}`] ? (
                            <LoadingSpinner size="sm" className="mr-1" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-1" />
                          )}
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create New Announcement</h3>
            </div>
            
            <AnnouncementForm
              onSubmit={handleCreateAnnouncement}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Announcement Modal */}
      {showEditModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Announcement</h3>
            </div>
            
            <AnnouncementForm
              initialData={selectedAnnouncement}
              onSubmit={handleUpdateAnnouncement}
              onCancel={() => {
                setShowEditModal(false)
                setSelectedAnnouncement(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
