import { 
  useGetUsersQuery, 
  useGetSkillsQuery, 
  useGetFeedbackQuery, 
  useGetSwapsQuery 
} from '../store/api/adminApi'
import { 
  Users, 
  Award, 
  MessageSquare, 
  ArrowLeftRight, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function Dashboard() {
  const { data: users, isLoading: usersLoading } = useGetUsersQuery()
  const { data: skills, isLoading: skillsLoading } = useGetSkillsQuery()
  const { data: feedback, isLoading: feedbackLoading } = useGetFeedbackQuery()
  const { data: swaps, isLoading: swapsLoading } = useGetSwapsQuery()

  const stats = [
    {
      name: 'Total Users',
      value: users?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      loading: usersLoading
    },
    {
      name: 'Pending Skills',
      value: skills?.filter(skill => skill.status === 'pending')?.length || 0,
      icon: Award,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      loading: skillsLoading
    },
    {
      name: 'Total Feedback',
      value: feedback?.length || 0,
      icon: MessageSquare,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      loading: feedbackLoading
    },
    {
      name: 'Active Swaps',
      value: swaps?.filter(swap => swap.status === 'active')?.length || 0,
      icon: ArrowLeftRight,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      loading: swapsLoading
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'user_registered',
      message: 'New user John Doe registered',
      time: '2 minutes ago',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'skill_submitted',
      message: 'New skill "React Development" submitted for approval',
      time: '15 minutes ago',
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      id: 3,
      type: 'feedback_received',
      message: 'Feedback received for swap #123',
      time: '1 hour ago',
      icon: MessageSquare,
      color: 'text-green-600'
    },
    {
      id: 4,
      type: 'swap_completed',
      message: 'Skill swap between Alice and Bob completed',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor platform activity and manage key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <div key={stat.name} className="card card-hover p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stat.loading ? (
                      <div className="loading-pulse h-8 w-16 rounded"></div>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`${stat.bgColor} dark:bg-opacity-20 p-3 rounded-lg`}>
                  <IconComponent className={`w-6 h-6 ${stat.textColor} dark:text-opacity-80`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <IconComponent className={`w-5 h-5 ${activity.color} dark:text-opacity-80`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">{activity.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover-lift">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Review Reported Users</span>
                </div>
                <span className="badge-danger">3</span>
              </button>
              
              <button className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover-lift">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Pending Skill Approvals</span>
                </div>
                <span className="badge-warning">
                  {skills?.filter(skill => skill.status === 'pending')?.length || 0}
                </span>
              </button>
              
              <button className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover-lift">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">View Analytics</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}