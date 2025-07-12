import { useState } from 'react'
import { useGetSwapsQuery } from '../store/api/adminApi'
import { 
  ArrowLeftRight, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Eye
} from 'lucide-react'

export default function SwapMonitor() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const { data: swaps, isLoading, error, refetch } = useGetSwapsQuery()

  const filteredSwaps = swaps?.filter(swap => {
    const matchesSearch = swap.requester?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         swap.receiver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         swap.requesterSkill?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         swap.receiverSkill?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterStatus === 'all') return matchesSearch
    return matchesSearch && swap.status === filterStatus
  }) || []

  const stats = {
    total: swaps?.length || 0,
    pending: swaps?.filter(swap => swap.status === 'pending').length || 0,
    active: swaps?.filter(swap => swap.status === 'active').length || 0,
    completed: swaps?.filter(swap => swap.status === 'completed').length || 0,
    cancelled: swaps?.filter(swap => swap.status === 'cancelled').length || 0
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />
      case 'active':
        return <ArrowLeftRight className="w-3 h-3" />
      case 'completed':
        return <CheckCircle className="w-3 h-3" />
      case 'cancelled':
        return <XCircle className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
    }
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
        <p className="text-red-600">Failed to load swaps. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Swap Monitor</h1>
          <p className="text-gray-600 mt-2">Monitor all skill swap activities and transactions</p>
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Swaps</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ArrowLeftRight className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <ArrowLeftRight className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
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
                placeholder="Search swaps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Swaps</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredSwaps.length} of {stats.total} swaps
          </div>
        </div>
      </div>

      {/* Swaps List */}
      {filteredSwaps.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 text-center py-12">
          <ArrowLeftRight className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No swaps found matching your criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSwaps.map((swap) => (
            <div key={swap._id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(swap.status)}`}>
                        {getStatusIcon(swap.status)}
                        <span className="ml-1 capitalize">{swap.status}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        #{swap._id?.slice(-8) || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(swap.createdAt)}
                    </div>
                  </div>

                  {/* Swap Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Requester */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-900">Requester</h4>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {swap.requester?.name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {swap.requester?.email}
                          </p>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-900">Offering</p>
                        <p className="text-sm text-blue-700">
                          {swap.requesterSkill?.name || 'Unknown Skill'}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center">
                      <ArrowLeftRight className="w-8 h-8 text-gray-400" />
                    </div>

                    {/* Receiver */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-900">Receiver</h4>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {swap.receiver?.name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {swap.receiver?.email}
                          </p>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-green-900">Offering</p>
                        <p className="text-sm text-green-700">
                          {swap.receiverSkill?.name || 'Unknown Skill'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        {swap.scheduledDate && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Scheduled: {formatDate(swap.scheduledDate)}</span>
                          </div>
                        )}
                        {swap.duration && (
                          <div>
                            <span className="font-medium">Duration:</span>
                            <span className="ml-1">{swap.duration} hours</span>
                          </div>
                        )}
                        {swap.location && (
                          <div>
                            <span className="font-medium">Location:</span>
                            <span className="ml-1">{swap.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <button className="flex items-center px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
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