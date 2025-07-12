import { useState, useEffect } from 'react'
import { adminApi } from '../services/adminService'
import { LoadingCard, LoadingSpinner } from '../components/Loading'
import { 
  Users, 
  Award, 
  MessageSquare, 
  ArrowLeftRight, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  UsersRound,
  BarChart3,
  Activity
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    skills: 0,
    feedback: 0,
    swaps: 0,
    groups: 0,
    pendingSkills: 0,
    activeSwaps: 0
  })
  const [loading, setLoading] = useState(true)
  const [trendingSkills, setTrendingSkills] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [
        usersResponse,
        groupsResponse,
        trendingResponse,
        reportsResponse
      ] = await Promise.all([
        adminApi.getAllUsers().catch(() => ({ data: [] })),
        adminApi.getAllGroups().catch(() => ({ data: [] })),
        adminApi.getTrendingSkills().catch(() => ({ data: [] })),
        adminApi.getReports().catch(() => ({ data: {} }))
      ])

      // Mock some stats for demo - replace with actual API data
      setStats({
        users: usersResponse.data?.length || 156,
        skills: 89,
        feedback: 234,
        swaps: 45,
        groups: groupsResponse.data?.length || 23,
        pendingSkills: 12,
        activeSwaps: 18
      })

      setTrendingSkills(trendingResponse.data?.slice(0, 5) || [
        { name: 'JavaScript', count: 45 },
        { name: 'Python', count: 38 },
        { name: 'React', count: 32 },
        { name: 'Node.js', count: 28 },
        { name: 'TypeScript', count: 25 }
      ])

      // Mock recent activity
      setRecentActivity([
        { type: 'user', message: 'New user registered: John Doe', time: '2 minutes ago' },
        { type: 'skill', message: 'Skill approved: Advanced Python', time: '5 minutes ago' },
        { type: 'swap', message: 'Swap request: React ↔ Vue.js', time: '8 minutes ago' },
        { type: 'feedback', message: 'New feedback received (5⭐)', time: '12 minutes ago' },
        { type: 'group', message: 'New group created: AI Enthusiasts', time: '15 minutes ago' }
      ])

    } catch (error) {
      toast.error('Failed to fetch dashboard data')
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Pending Skills',
      value: stats.pendingSkills,
      icon: Award,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      change: '-5%',
      changeType: 'negative'
    },
    {
      name: 'Total Feedback',
      value: stats.feedback,
      icon: MessageSquare,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Active Swaps',
      value: stats.activeSwaps,
      icon: ArrowLeftRight,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      change: '+15%',
      changeType: 'positive'
    },
    {
      name: 'Total Groups',
      value: stats.groups,
      icon: UsersRound,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      change: '+3%',
      changeType: 'positive'
    },
    {
      name: 'Total Skills',
      value: stats.skills,
      icon: Award,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      change: '+7%',
      changeType: 'positive'
    }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return Users
      case 'skill': return Award
      case 'swap': return ArrowLeftRight
      case 'feedback': return MessageSquare
      case 'group': return UsersRound
      default: return Activity
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'user': return 'text-blue-600'
      case 'skill': return 'text-yellow-600'
      case 'swap': return 'text-purple-600'
      case 'feedback': return 'text-green-600'
      case 'group': return 'text-indigo-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor platform activity and manage key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <LoadingCard key={i} />)
        ) : (
          statCards.map((stat) => {
            const IconComponent = stat.icon
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{stat.name}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-xs sm:text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-2 sm:p-3 rounded-lg ml-2 sm:ml-4 flex-shrink-0`}>
                    <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Trending Skills */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Trending Skills</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {trendingSkills.map((skill, index) => (
                <div key={skill.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-500 w-8 flex-shrink-0">#{index + 1}</span>
                    <span className="text-sm font-medium text-gray-900 ml-3 truncate">{skill.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2 flex-shrink-0">{skill.count} requests</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-100 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivity.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type)
                return (
                  <div key={index} className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'user' ? 'bg-blue-100' :
                      activity.type === 'skill' ? 'bg-yellow-100' :
                      activity.type === 'swap' ? 'bg-purple-100' :
                      activity.type === 'feedback' ? 'bg-green-100' :
                      activity.type === 'group' ? 'bg-indigo-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-4 h-4 ${getActivityColor(activity.type)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 break-words">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button className="flex flex-col sm:flex-row items-center justify-center p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-105">
            <Users className="w-5 h-5 text-blue-600 mb-1 sm:mb-0 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-blue-700 text-center">Manage Users</span>
          </button>
          <button className="flex flex-col sm:flex-row items-center justify-center p-3 sm:p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-all duration-200 hover:scale-105">
            <Award className="w-5 h-5 text-yellow-600 mb-1 sm:mb-0 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-yellow-700 text-center">Review Skills</span>
          </button>
          <button className="flex flex-col sm:flex-row items-center justify-center p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 hover:scale-105">
            <MessageSquare className="w-5 h-5 text-green-600 mb-1 sm:mb-0 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-green-700 text-center">Check Feedback</span>
          </button>
          <button className="flex flex-col sm:flex-row items-center justify-center p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-200 hover:scale-105">
            <BarChart3 className="w-5 h-5 text-purple-600 mb-1 sm:mb-0 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-purple-700 text-center">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  )
}
