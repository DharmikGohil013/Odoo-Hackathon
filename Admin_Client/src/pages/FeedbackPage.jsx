import { useState } from 'react'
import { 
  useGetFeedbackQuery, 
  useDeleteFeedbackMutation 
} from '../store/api/adminApi'
import { 
  MessageSquare, 
  Star, 
  User, 
  Calendar, 
  Trash2, 
  Search,
  Filter,
  RefreshCw
} from 'lucide-react'

export default function FeedbackPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState('all')
  const { data: feedback, isLoading, error, refetch } = useGetFeedbackQuery()
  const [deleteFeedback] = useDeleteFeedbackMutation()

  const handleDeleteFeedback = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      try {
        await deleteFeedback(feedbackId).unwrap()
        refetch()
      } catch (error) {
        console.error('Failed to delete feedback:', error)
      }
    }
  }

  const filteredFeedback = feedback?.filter(item => {
    const matchesSearch = item.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.reviewer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.reviewee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterRating === 'all') return matchesSearch
    return matchesSearch && item.rating === parseInt(filterRating)
  }) || []

  const averageRating = feedback?.length > 0 
    ? (feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1)
    : 0

  const ratingDistribution = {
    1: feedback?.filter(item => item.rating === 1).length || 0,
    2: feedback?.filter(item => item.rating === 2).length || 0,
    3: feedback?.filter(item => item.rating === 3).length || 0,
    4: feedback?.filter(item => item.rating === 4).length || 0,
    5: feedback?.filter(item => item.rating === 5).length || 0,
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
        <p className="text-red-600">Failed to load feedback. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage user feedback and reviews</p>
        </div>
        <button 
          onClick={refetch}
          className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mt-4 sm:mt-0"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-3xl font-bold text-gray-900">{feedback?.length || 0}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-center mt-2">
                <p className="text-3xl font-bold text-gray-900 mr-2">{averageRating}</p>
                <div className="flex">
                  {renderStars(Math.round(averageRating))}
                </div>
              </div>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900">
                {feedback?.filter(item => {
                  const feedbackDate = new Date(item.createdAt)
                  const currentMonth = new Date().getMonth()
                  return feedbackDate.getMonth() === currentMonth
                }).length || 0}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <div className="flex items-center w-16">
                <span className="text-sm text-gray-600 mr-2">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${feedback?.length > 0 ? (ratingDistribution[rating] / feedback.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
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
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredFeedback.length} of {feedback?.length || 0} feedback
          </div>
        </div>
      </div>

      {/* Feedback List */}
      {filteredFeedback.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No feedback found matching your criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedback.map((item) => (
            <div key={item._id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {item.reviewer?.name || 'Anonymous'}
                        </span>
                        <span className="text-gray-500">→</span>
                        <span className="text-gray-700">
                          {item.reviewee?.name || 'Unknown User'}
                        </span>
                      </div>
                      <div className="flex">
                        {renderStars(item.rating)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </span>
                      <button
                        onClick={() => handleDeleteFeedback(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete feedback"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      {item.comment || 'No comment provided'}
                    </p>
                  </div>

                  {/* Swap Info */}
                  {item.swap && (
                    <div className="mt-4 text-sm text-gray-600">
                      <span className="font-medium">Related to swap:</span>
                      <span className="ml-1">#{item.swap._id?.slice(-8) || 'Unknown'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}