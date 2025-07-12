import { useState, useEffect } from 'react'
import { adminApi } from '../services/adminService'
import {
  Award, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  Star,
  User,
  AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SkillsModeration() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [showSkillModal, setShowSkillModal] = useState(false)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getAllSkills()
      setSkills(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch skills')
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveSkill = async (skillId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`approve_${skillId}`]: true }))
      await adminApi.approveSkill(skillId)
      setSkills(skills.map(skill => 
        skill.id === skillId ? { ...skill, status: 'approved' } : skill
      ))
      toast.success('Skill approved successfully')
    } catch (error) {
      toast.error('Failed to approve skill')
      console.error('Error approving skill:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`approve_${skillId}`]: false }))
    }
  }

  const handleRejectSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to reject this skill?')) return

    try {
      setActionLoading(prev => ({ ...prev, [`reject_${skillId}`]: true }))
      await adminApi.rejectSkill(skillId)
      setSkills(skills.map(skill => 
        skill.id === skillId ? { ...skill, status: 'rejected' } : skill
      ))
      toast.success('Skill rejected successfully')
    } catch (error) {
      toast.error('Failed to reject skill')
      console.error('Error rejecting skill:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`reject_${skillId}`]: false }))
    }
  }

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill? This action cannot be undone.')) return

    try {
      setActionLoading(prev => ({ ...prev, [`delete_${skillId}`]: true }))
      await adminApi.deleteSkill(skillId)
      setSkills(skills.filter(skill => skill.id !== skillId))
      toast.success('Skill deleted successfully')
    } catch (error) {
      toast.error('Failed to delete skill')
      console.error('Error deleting skill:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${skillId}`]: false }))
    }
  }

  const handleViewSkill = (skill) => {
    setSelectedSkill(skill)
    setShowSkillModal(true)
  }

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterStatus === 'all') return matchesSearch
    if (filterStatus === 'pending') return matchesSearch && skill.status === 'pending'
    if (filterStatus === 'approved') return matchesSearch && skill.status === 'approved'
    if (filterStatus === 'rejected') return matchesSearch && skill.status === 'rejected'
    
    return matchesSearch
  }) || []

  const stats = {
    total: skills.length || 0,
    pending: skills.filter(skill => skill.status === 'pending').length || 0,
    approved: skills.filter(skill => skill.status === 'approved').length || 0,
    rejected: skills.filter(skill => skill.status === 'rejected').length || 0
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock
      case 'approved': return CheckCircle
      case 'rejected': return XCircle
      default: return AlertTriangle
    }
  }

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-blue-100 text-blue-800'
      case 'intermediate': return 'bg-orange-100 text-orange-800'
      case 'advanced': return 'bg-purple-100 text-purple-800'
      case 'expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Skills Moderation</h1>
        <p className="text-gray-600">Review and manage skill submissions from users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Skills</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
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
                placeholder="Search skills by name, description, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Skills</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button
            onClick={fetchSkills}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Skills Table */}
      {loading ? (
        <LoadingTable rows={8} cols={6} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Skills ({filteredSkills.length})
            </h2>
          </div>
          
          {filteredSkills.length === 0 ? (
            <div className="p-12 text-center">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No skills found</h3>
              <p className="text-gray-500">No skills match your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skill
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSkills.map((skill) => {
                    const StatusIcon = getStatusIcon(skill.status)
                    return (
                      <tr key={skill.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{skill.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{skill.user_name || 'Unknown User'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(skill.level)}`}>
                            {skill.level || 'Not specified'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <StatusIcon className="w-4 h-4 mr-2" />
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(skill.status)}`}>
                              {skill.status?.charAt(0).toUpperCase() + skill.status?.slice(1) || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(skill.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleViewSkill(skill)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          {skill.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveSkill(skill.id)}
                                disabled={actionLoading[`approve_${skill.id}`]}
                                className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50"
                              >
                                {actionLoading[`approve_${skill.id}`] ? (
                                  <LoadingSpinner size="sm" className="mr-1" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                )}
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectSkill(skill.id)}
                                disabled={actionLoading[`reject_${skill.id}`]}
                                className="text-orange-600 hover:text-orange-900 inline-flex items-center disabled:opacity-50"
                              >
                                {actionLoading[`reject_${skill.id}`] ? (
                                  <LoadingSpinner size="sm" className="mr-1" />
                                ) : (
                                  <XCircle className="w-4 h-4 mr-1" />
                                )}
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            disabled={actionLoading[`delete_${skill.id}`]}
                            className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                          >
                            {actionLoading[`delete_${skill.id}`] ? (
                              <LoadingSpinner size="sm" className="mr-1" />
                            ) : (
                              <Trash2 className="w-4 h-4 mr-1" />
                            )}
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Skill Details Modal */}
      {showSkillModal && selectedSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Skill Details</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedSkill.name}</h4>
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedSkill.status)}`}>
                    {selectedSkill.status?.charAt(0).toUpperCase() + selectedSkill.status?.slice(1)}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getLevelColor(selectedSkill.level)}`}>
                    {selectedSkill.level}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">{selectedSkill.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Submitted by:</span>
                    <p className="text-sm text-gray-900">{selectedSkill.user_name || 'Unknown User'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category:</span>
                    <p className="text-sm text-gray-900">{selectedSkill.category || 'General'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Experience:</span>
                    <p className="text-sm text-gray-900">{selectedSkill.experience || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Submitted:</span>
                    <p className="text-sm text-gray-900">{new Date(selectedSkill.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {selectedSkill.tags && selectedSkill.tags.length > 0 && (
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSkill.portfolio_links && selectedSkill.portfolio_links.length > 0 && (
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">Portfolio Links</h5>
                  <div className="space-y-2">
                    {selectedSkill.portfolio_links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm block truncate"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              <div className="flex space-x-3">
                {selectedSkill.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApproveSkill(selectedSkill.id)
                        setShowSkillModal(false)
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleRejectSkill(selectedSkill.id)
                        setShowSkillModal(false)
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => setShowSkillModal(false)}
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
