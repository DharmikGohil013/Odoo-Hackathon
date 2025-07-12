import { useState, useEffect } from 'react'
import { adminApi } from '../services/adminService'
import { LoadingTable, LoadingSpinner } from '../components/Loading'
import { 
  Users, 
  Search, 
  Filter, 
  Eye,
  UserPlus,
  UserMinus,
  Settings,
  Crown,
  Calendar,
  MessageCircle,
  TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function GroupsManagement() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getAllGroups()
      setGroups(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch groups')
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGroup = async (groupId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`join_${groupId}`]: true }))
      await adminApi.joinGroup(groupId)
      toast.success('Successfully joined group')
      fetchGroups() // Refresh to show updated member count
    } catch (error) {
      toast.error('Failed to join group')
      console.error('Error joining group:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`join_${groupId}`]: false }))
    }
  }

  const handleLeaveGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to leave this group?')) return

    try {
      setActionLoading(prev => ({ ...prev, [`leave_${groupId}`]: true }))
      await adminApi.leaveGroup(groupId)
      toast.success('Successfully left group')
      fetchGroups() // Refresh to show updated member count
    } catch (error) {
      toast.error('Failed to leave group')
      console.error('Error leaving group:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`leave_${groupId}`]: false }))
    }
  }

  const handleViewDetails = async (group) => {
    try {
      const response = await adminApi.getGroupDetails(group.id)
      setSelectedGroup({ ...group, details: response.data })
      setShowDetailModal(true)
    } catch (error) {
      toast.error('Failed to fetch group details')
      console.error('Error fetching group details:', error)
    }
  }

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    let matchesType = true
    if (filterType !== 'all') {
      if (filterType === 'large') {
        matchesType = (group.member_count || 0) >= 10
      } else if (filterType === 'medium') {
        matchesType = (group.member_count || 0) >= 5 && (group.member_count || 0) < 10
      } else if (filterType === 'small') {
        matchesType = (group.member_count || 0) < 5
      } else if (filterType === 'active') {
        const lastActivity = new Date(group.last_activity)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        matchesType = lastActivity > weekAgo
      }
    }
    
    return matchesSearch && matchesType
  }) || []

  const stats = {
    total: groups.length || 0,
    active: groups.filter(group => {
      const lastActivity = new Date(group.last_activity)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return lastActivity > weekAgo
    }).length || 0,
    totalMembers: groups.reduce((sum, group) => sum + (group.member_count || 0), 0),
    averageSize: groups.length > 0 
      ? Math.round(groups.reduce((sum, group) => sum + (group.member_count || 0), 0) / groups.length)
      : 0
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Groups Management</h1>
          <p className="text-gray-600">Monitor and manage skill learning groups</p>
        </div>
        <button
          onClick={fetchGroups}
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
              <p className="text-sm font-medium text-gray-600">Total Groups</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Groups</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalMembers}</p>
            </div>
            <UserPlus className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Group Size</p>
              <p className="text-2xl font-bold text-orange-600">{stats.averageSize}</p>
            </div>
            <Settings className="w-8 h-8 text-orange-500" />
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
                placeholder="Search groups by name, description, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Groups</option>
              <option value="active">Active (This Week)</option>
              <option value="large">Large (10+ members)</option>
              <option value="medium">Medium (5-9 members)</option>
              <option value="small">Small (&lt;5 members)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Groups Table */}
      {loading ? (
        <LoadingTable rows={6} cols={6} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Groups ({filteredGroups.length})
            </h2>
          </div>
          
          {filteredGroups.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
              <p className="text-gray-500">No groups match your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Members
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGroups.map((group) => (
                    <tr key={group.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {group.is_private && (
                                <Crown className="w-4 h-4 text-yellow-500 mr-2" />
                              )}
                              {group.name}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 mt-1 truncate max-w-md">
                            {group.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(group.skills || []).slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {(group.skills || []).length > 3 && (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                              +{(group.skills || []).length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">{group.member_count || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(group.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {group.last_activity ? new Date(group.last_activity).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewDetails(group)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        {!group.is_member ? (
                          <button
                            onClick={() => handleJoinGroup(group.id)}
                            disabled={actionLoading[`join_${group.id}`]}
                            className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50"
                          >
                            {actionLoading[`join_${group.id}`] ? (
                              <LoadingSpinner size="sm" className="mr-1" />
                            ) : (
                              <UserPlus className="w-4 h-4 mr-1" />
                            )}
                            Join
                          </button>
                        ) : (
                          <button
                            onClick={() => handleLeaveGroup(group.id)}
                            disabled={actionLoading[`leave_${group.id}`]}
                            className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                          >
                            {actionLoading[`leave_${group.id}`] ? (
                              <LoadingSpinner size="sm" className="mr-1" />
                            ) : (
                              <UserMinus className="w-4 h-4 mr-1" />
                            )}
                            Leave
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

      {/* Group Detail Modal */}
      {showDetailModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  {selectedGroup.is_private && (
                    <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                  )}
                  {selectedGroup.name}
                </h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedGroup.description || 'No description provided'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Members</label>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{selectedGroup.member_count || 0} members</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedGroup.is_private 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedGroup.is_private ? 'Private' : 'Public'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {(selectedGroup.skills || []).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {(!selectedGroup.skills || selectedGroup.skills.length === 0) && (
                    <span className="text-gray-500">No skills specified</span>
                  )}
                </div>
              </div>
              
              {selectedGroup.details && selectedGroup.details.members && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recent Members</label>
                  <div className="space-y-2">
                    {selectedGroup.details.members.slice(0, 5).map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600">
                              {member.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{member.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">
                              Joined {new Date(member.joined_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {member.is_admin && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    ))}
                    {selectedGroup.details.members.length > 5 && (
                      <div className="text-sm text-gray-500 text-center">
                        +{selectedGroup.details.members.length - 5} more members
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {new Date(selectedGroup.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Activity</label>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {selectedGroup.last_activity 
                        ? new Date(selectedGroup.last_activity).toLocaleString()
                        : 'No recent activity'
                      }
                    </span>
                  </div>
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
              {!selectedGroup.is_member ? (
                <button
                  onClick={() => {
                    handleJoinGroup(selectedGroup.id)
                    setShowDetailModal(false)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Join Group
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleLeaveGroup(selectedGroup.id)
                    setShowDetailModal(false)
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Leave Group
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
