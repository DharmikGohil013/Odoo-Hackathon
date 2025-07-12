import { useState, useEffect } from 'react'
import { adminApi } from '../services/adminService'
import { LoadingTable, LoadingSpinner } from '../components/Loading'
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  Archive
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getAllFeedback()
      setFeedback(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch feedback')
      console.error('Error fetching feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsResolved = async (feedbackId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`resolve_${feedbackId}`]: true }))
      await adminApi.updateFeedback(feedbackId, { status: 'resolved' })
      setFeedback(feedback.map(item => 
        item.id === feedbackId ? { ...item, status: 'resolved' } : item
      ))
      toast.success('Feedback marked as resolved')
    } catch (error) {
      toast.error('Failed to update feedback')
      console.error('Error updating feedback:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`resolve_${feedbackId}`]: false }))
    }
  }

  const handleArchiveFeedback = async (feedbackId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`archive_${feedbackId}`]: true }))
      await adminApi.updateFeedback(feedbackId, { status: 'archived' })
      setFeedback(feedback.map(item => 
        item.id === feedbackId ? { ...item, status: 'archived' } : item
      ))
      toast.success('Feedback archived')
    } catch (error) {
      toast.error('Failed to archive feedback')
      console.error('Error archiving feedback:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`archive_${feedbackId}`]: false }))
    }
  }

  const handleViewDetails = (feedbackItem) => {
    setSelectedFeedback(feedbackItem)
    setShowDetailModal(true)
  }

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesRating = true
    if (filterRating !== 'all') {
      const rating = parseInt(filterRating)
      matchesRating = item.rating === rating
    }

    let matchesStatus = true
    if (filterStatus !== 'all') {
      matchesStatus = item.status === filterStatus
    }
    
    return matchesSearch && matchesRating && matchesStatus
  }) || []

  const stats = {
    total: feedback.length || 0,
    pending: feedback.filter(item => item.status === 'pending').length || 0,
    resolved: feedback.filter(item => item.status === 'resolved').length || 0,
    averageRating: feedback.length > 0 
      ? (feedback.reduce((sum, item) => sum + (item.rating || 0), 0) / feedback.length).toFixed(1)
      : '0.0'
  }

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'archived':
        return <Archive className="w-4 h-4 text-gray-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Feedback</h1>
          <p className="text-gray-600">Monitor and respond to user feedback and suggestions</p>
        </div>
        <button
          onClick={fetchFeedback}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-purple-600">{stats.averageRating}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search feedback by message, user, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback Table */}
      {loading ? (
        <LoadingTable rows={6} cols={6} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Feedback ({filteredFeedback.length})
            </h2>
          </div>
          
          {filteredFeedback.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
              <p className="text-gray-500">No feedback matches your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User & Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFeedback.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.user_name || 'Anonymous User'}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 truncate max-w-md">
                            {item.message}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRatingStars(item.rating || 0)}
                          <span className="ml-2 text-sm text-gray-600">
                            ({item.rating || 0})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {item.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1 capitalize">{item.status || 'pending'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        {item.status !== 'resolved' && (
                          <button
                            onClick={() => handleMarkAsResolved(item.id)}
                            disabled={actionLoading[`resolve_${item.id}`]}
                            className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50"
                          >
                            {actionLoading[`resolve_${item.id}`] ? (
                              <LoadingSpinner size="sm" className="mr-1" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            )}
                            Resolve
                          </button>
                        )}
                        {item.status !== 'archived' && (
                          <button
                            onClick={() => handleArchiveFeedback(item.id)}
                            disabled={actionLoading[`archive_${item.id}`]}
                            className="text-gray-600 hover:text-gray-900 inline-flex items-center disabled:opacity-50"
                          >
                            {actionLoading[`archive_${item.id}`] ? (
                              <LoadingSpinner size="sm" className="mr-1" />
                            ) : (
                              <Archive className="w-4 h-4 mr-1" />
                            )}
                            Archive
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Feedback Detail Modal */}
      {showDetailModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Feedback Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <p className="text-gray-900">{selectedFeedback.user_name || 'Anonymous User'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center">
                  {getRatingStars(selectedFeedback.rating || 0)}
                  <span className="ml-2 text-sm text-gray-600">
                    ({selectedFeedback.rating || 0}/5)
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {selectedFeedback.category || 'General'}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${getStatusColor(selectedFeedback.status)}`}>
                  {getStatusIcon(selectedFeedback.status)}
                  <span className="ml-1 capitalize">{selectedFeedback.status || 'pending'}</span>
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedFeedback.message}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Submitted</label>
                <p className="text-gray-900">
                  {new Date(selectedFeedback.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              {selectedFeedback.status !== 'resolved' && (
                <button
                  onClick={() => {
                    handleMarkAsResolved(selectedFeedback.id)
                    setShowDetailModal(false)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
