import { useState, useEffect } from 'react'
import { adminApi } from '../services/adminService'
import { LoadingTable, LoadingSpinner } from '../components/Loading'
import { 
  ArrowRightLeft, 
  Search, 
  Filter, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  User,
  TrendingUp,
  Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SwapMonitor() {
  const [swaps, setSwaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTimeframe, setFilterTimeframe] = useState('all')
  const [selectedSwap, setSelectedSwap] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    fetchSwaps()
  }, [])

  const fetchSwaps = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getAllSwaps()
      setSwaps(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch swaps')
      console.error('Error fetching swaps:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInterruptSwap = async (swapId) => {
    if (!window.confirm('Are you sure you want to interrupt this swap? This action cannot be undone.')) return

    try {
      setActionLoading(prev => ({ ...prev, [`interrupt_${swapId}`]: true }))
      await adminApi.updateSwap(swapId, { status: 'interrupted', admin_action: true })
      setSwaps(swaps.map(swap => 
        swap.id === swapId ? { ...swap, status: 'interrupted', admin_action: true } : swap
      ))
      toast.success('Swap interrupted successfully')
    } catch (error) {
      toast.error('Failed to interrupt swap')
      console.error('Error interrupting swap:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`interrupt_${swapId}`]: false }))
    }
  }

  const handleViewDetails = (swap) => {
    setSelectedSwap(swap)
    setShowDetailModal(true)
  }

  const filteredSwaps = swaps.filter(swap => {
    const matchesSearch = swap.requester_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         swap.provider_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         swap.requested_skill?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         swap.offered_skill?.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesStatus = true
    if (filterStatus !== 'all') {
      matchesStatus = swap.status === filterStatus
    }

    let matchesTimeframe = true
    if (filterTimeframe !== 'all') {
      const swapDate = new Date(swap.created_at)
      const now = new Date()
      
      if (filterTimeframe === 'today') {
        matchesTimeframe = swapDate.toDateString() === now.toDateString()
      } else if (filterTimeframe === 'week') {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        matchesTimeframe = swapDate > weekAgo
      } else if (filterTimeframe === 'month') {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        matchesTimeframe = swapDate > monthAgo
      }
    }
    
    return matchesSearch && matchesStatus && matchesTimeframe
  }) || []

  const stats = {
    total: swaps.length || 0,
    active: swaps.filter(swap => swap.status === 'active').length || 0,
    completed: swaps.filter(swap => swap.status === 'completed').length || 0,
    pending: swaps.filter(swap => swap.status === 'pending').length || 0,
    cancelled: swaps.filter(swap => swap.status === 'cancelled' || swap.status === 'interrupted').length || 0
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'active':
        return <ArrowRightLeft className="w-4 h-4 text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancelled':
      case 'interrupted':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
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
      case 'interrupted':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Monitor</h1>
          <p className="text-gray-600">Monitor and manage skill swap activities</p>
        </div>
        <button
          onClick={fetchSwaps}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Swaps</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ArrowRightLeft className="w-8 h-8 text-blue-500" />
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
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
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
                placeholder="Search by user names or skills..."
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="interrupted">Interrupted</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={filterTimeframe}
                onChange={(e) => setFilterTimeframe(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Swaps Table */}
      {loading ? (
        <LoadingTable rows={6} cols={6} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Swaps ({filteredSwaps.length})
            </h2>
          </div>
          
          {filteredSwaps.length === 0 ? (
            <div className="p-12 text-center">
              <ArrowRightLeft className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No swaps found</h3>
              <p className="text-gray-500">No swaps match your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills Exchange
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSwaps.map((swap) => (
                    <tr key={swap.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex flex-col">
                            <div className="flex items-center text-sm font-medium text-gray-900">
                              <User className="w-4 h-4 mr-1 text-blue-500" />
                              {swap.requester_name || 'Unknown'}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <User className="w-4 h-4 mr-1 text-green-500" />
                              {swap.provider_name || 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">Wants:</span> {swap.requested_skill || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Offers:</span> {swap.offered_skill || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${getStatusColor(swap.status)}`}>
                          {getStatusIcon(swap.status)}
                          <span className="ml-1 capitalize">{swap.status || 'unknown'}</span>
                        </span>
                        {swap.admin_action && (
                          <div className="text-xs text-red-600 mt-1">Admin action</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(swap.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {swap.duration_hours ? `${swap.duration_hours}h` : 'Not set'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewDetails(swap)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        {(swap.status === 'active' || swap.status === 'pending') && (
                          <button
                            onClick={() => handleInterruptSwap(swap.id)}
                            disabled={actionLoading[`interrupt_${swap.id}`]}
                            className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                          >
                            {actionLoading[`interrupt_${swap.id}`] ? (
                              <LoadingSpinner size="sm" className="mr-1" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-1" />
                            )}
                            Interrupt
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

      {/* Swap Detail Modal */}
      {showDetailModal && selectedSwap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Swap Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requester</label>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-gray-900">{selectedSwap.requester_name || 'Unknown'}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-gray-900">{selectedSwap.provider_name || 'Unknown'}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requested Skill</label>
                  <p className="text-gray-900 bg-blue-50 rounded-lg p-3">
                    {selectedSwap.requested_skill || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offered Skill</label>
                  <p className="text-gray-900 bg-green-50 rounded-lg p-3">
                    {selectedSwap.offered_skill || 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <span className={`px-3 py-2 text-sm font-medium rounded-lg inline-flex items-center ${getStatusColor(selectedSwap.status)}`}>
                    {getStatusIcon(selectedSwap.status)}
                    <span className="ml-2 capitalize">{selectedSwap.status || 'unknown'}</span>
                  </span>
                  {selectedSwap.admin_action && (
                    <div className="text-sm text-red-600 mt-2">Admin action taken</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <p className="text-gray-900">{selectedSwap.duration_hours ? `${selectedSwap.duration_hours} hours` : 'Not specified'}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedSwap.description || 'No description provided'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                  <p className="text-gray-900">{new Date(selectedSwap.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                  <p className="text-gray-900">{new Date(selectedSwap.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              {(selectedSwap.status === 'active' || selectedSwap.status === 'pending') && (
                <button
                  onClick={() => {
                    handleInterruptSwap(selectedSwap.id)
                    setShowDetailModal(false)
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Interrupt Swap
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
