import { useState, useEffect } from 'react'
import { adminApi } from '../services/adminService'
import { LoadingTable, LoadingSpinner } from '../components/Loading'
import { 
  Search, 
  Filter, 
  Download, 
  UserCheck, 
  UserX,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Users,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Star
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function UsersManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getAllUsers()
      setUsers(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch users')
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBanUser = async (userId) => {
    if (!window.confirm('Are you sure you want to ban this user?')) return

    try {
      setActionLoading(prev => ({ ...prev, [`ban_${userId}`]: true }))
      await adminApi.banUser(userId)
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_banned: true } : user
      ))
      toast.success('User banned successfully')
    } catch (error) {
      toast.error('Failed to ban user')
      console.error('Error banning user:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`ban_${userId}`]: false }))
    }
  }

  const handleUnbanUser = async (userId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`unban_${userId}`]: true }))
      await adminApi.unbanUser(userId)
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_banned: false } : user
      ))
      toast.success('User unbanned successfully')
    } catch (error) {
      toast.error('Failed to unban user')
      console.error('Error unbanning user:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`unban_${userId}`]: false }))
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      setActionLoading(prev => ({ ...prev, [`delete_${userId}`]: true }))
      await adminApi.deleteUser(userId)
      setUsers(users.filter(user => user.id !== userId))
      toast.success('User deleted successfully')
    } catch (error) {
      toast.error('Failed to delete user')
      console.error('Error deleting user:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${userId}`]: false }))
    }
  }

  const handleViewUser = async (userId) => {
    try {
      setLoading(true)
      const response = await adminApi.getUserById(userId)
      setSelectedUser(response.data)
      setShowUserModal(true)
    } catch (error) {
      toast.error('Failed to fetch user details')
      console.error('Error fetching user details:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.college_or_company?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterStatus === 'all') return matchesSearch
    if (filterStatus === 'active') return matchesSearch && !user.is_banned
    if (filterStatus === 'banned') return matchesSearch && user.is_banned
    
    return matchesSearch
  }) || []

  const stats = {
    total: users.length || 0,
    active: users.filter(user => !user.is_banned).length || 0,
    banned: users.filter(user => user.is_banned).length || 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage user accounts and monitor platform activity</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button 
              onClick={fetchUsers}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Banned Users</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.banned}</p>
            </div>
            <UserX className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
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
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="banned">Banned Users</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingTable rows={10} cols={6} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Users ({filteredUsers.length})
            </h2>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">No users match your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {user.profile_photo ? (
                              <img className="h-10 w-10 rounded-full" src={user.profile_photo} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.college_or_company || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.location || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.is_banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.is_banned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        {user.is_banned ? (
                          <button
                            onClick={() => handleUnbanUser(user.id)}
                            disabled={actionLoading[`unban_${user.id}`]}
                            className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50"
                          >
                            {actionLoading[`unban_${user.id}`] ? (
                              <LoadingSpinner size="sm" className="mr-1" />
                            ) : (
                              <UserCheck className="w-4 h-4 mr-1" />
                            )}
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBanUser(user.id)}
                            disabled={actionLoading[`ban_${user.id}`]}
                            className="text-orange-600 hover:text-orange-900 inline-flex items-center disabled:opacity-50"
                          >
                            {actionLoading[`ban_${user.id}`] ? (
                              <LoadingSpinner size="sm" className="mr-1" />
                            ) : (
                              <UserX className="w-4 h-4 mr-1" />
                            )}
                            Ban
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionLoading[`delete_${user.id}`]}
                          className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                        >
                          {actionLoading[`delete_${user.id}`] ? (
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

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                {selectedUser.profile_photo ? (
                  <img className="h-16 w-16 rounded-full" src={selectedUser.profile_photo} alt="" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                    selectedUser.is_banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedUser.is_banned ? 'Banned' : 'Active'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Organization:</span>
                  <p className="text-sm text-gray-900">{selectedUser.college_or_company || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Location:</span>
                  <p className="text-sm text-gray-900">{selectedUser.location || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Availability:</span>
                  <p className="text-sm text-gray-900">{selectedUser.availability || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Privacy:</span>
                  <p className="text-sm text-gray-900">{selectedUser.is_public ? 'Public' : 'Private'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Joined:</span>
                  <p className="text-sm text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                  <p className="text-sm text-gray-900">{new Date(selectedUser.updated_at).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedUser.skills_offered && selectedUser.skills_offered.length > 0 && (
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">Skills Offered</h5>
                  <div className="space-y-2">
                    {selectedUser.skills_offered.map((skill, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg">
                        <h6 className="font-medium text-blue-900">{skill.name}</h6>
                        <p className="text-sm text-blue-700">Level: {skill.level}</p>
                        {skill.description && <p className="text-sm text-blue-600 mt-1">{skill.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.skills_wanted && selectedUser.skills_wanted.length > 0 && (
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">Skills Wanted</h5>
                  <div className="space-y-2">
                    {selectedUser.skills_wanted.map((skill, index) => (
                      <div key={index} className="bg-green-50 p-3 rounded-lg">
                        <h6 className="font-medium text-green-900">{skill.name}</h6>
                        <p className="text-sm text-green-700">Level: {skill.level}</p>
                        {skill.description && <p className="text-sm text-green-600 mt-1">{skill.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
