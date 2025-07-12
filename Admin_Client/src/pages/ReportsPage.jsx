import { useState } from 'react'
import { useGetReportsQuery } from '../store/api/adminApi'
import ReportDownloadButton from '../components/ReportDownloadButton'
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  ArrowLeftRight, 
  Award, 
  RefreshCw,
  FileSpreadsheet,
  Filter
} from 'lucide-react'

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('30')
  const [reportType, setReportType] = useState('all')
  const { data: reports, isLoading, error, refetch } = useGetReportsQuery()

  const reportTypes = [
    { value: 'all', label: 'All Reports', icon: BarChart3 },
    { value: 'users', label: 'User Analytics', icon: Users },
    { value: 'swaps', label: 'Swap Analytics', icon: ArrowLeftRight },
    { value: 'skills', label: 'Skills Analytics', icon: Award },
    { value: 'engagement', label: 'Platform Engagement', icon: TrendingUp },
  ]

  const dateRanges = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: '365', label: 'Last year' },
    { value: 'custom', label: 'Custom range' },
  ]

  // Mock analytics data (in real app, this would come from API)
  const analyticsData = {
    totalUsers: 1250,
    activeUsers: 890,
    totalSwaps: 445,
    completedSwaps: 312,
    totalSkills: 789,
    pendingSkills: 23,
    averageRating: 4.6,
    userGrowth: 12.5,
    swapGrowth: 8.3,
    skillGrowth: 15.2
  }

  const exportData = {
    users: [
      { name: 'Users Report', description: 'Complete user data with registration dates, activity metrics, and profile information' },
      { name: 'User Activity', description: 'User engagement metrics, login frequency, and platform usage statistics' },
    ],
    swaps: [
      { name: 'Swap Transactions', description: 'All swap records with participants, skills exchanged, and completion status' },
      { name: 'Swap Analytics', description: 'Swap success rates, popular skills, and transaction trends' },
    ],
    skills: [
      { name: 'Skills Database', description: 'Complete skills catalog with categories, approval status, and user associations' },
      { name: 'Skills Moderation', description: 'Pending skills, approval history, and moderation statistics' },
    ],
    feedback: [
      { name: 'User Feedback', description: 'All feedback and ratings with detailed comments and timestamps' },
      { name: 'Feedback Analytics', description: 'Rating trends, sentiment analysis, and user satisfaction metrics' },
    ]
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
        <p className="text-red-600">Failed to load reports. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Export platform data and view comprehensive analytics</p>
        </div>
        <button 
          onClick={refetch}
          className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mt-4 sm:mt-0"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.totalUsers}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{analyticsData.userGrowth}%</span>
              </div>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Swaps</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.totalSwaps}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{analyticsData.swapGrowth}%</span>
              </div>
            </div>
            <ArrowLeftRight className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Skills</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.totalSkills}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{analyticsData.skillGrowth}%</span>
              </div>
            </div>
            <Award className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.averageRating}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600">out of 5.0</span>
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Export Reports</h2>
        
        {/* Users Reports */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">User Reports</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportData.users.map((report, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <ReportDownloadButton 
                      reportType="users" 
                      format="csv"
                      label="CSV"
                    />
                  </div>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Swaps Reports */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <ArrowLeftRight className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">Swap Reports</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportData.swaps.map((report, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <div className="flex items-center space-x-2">
                      <ReportDownloadButton 
                        reportType="swaps" 
                        format="csv"
                        label="CSV"
                      />
                      <ReportDownloadButton 
                        reportType="swaps" 
                        format="excel"
                        label="Excel"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Reports */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">Skills Reports</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportData.skills.map((report, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <ReportDownloadButton 
                      reportType="skills" 
                      format="csv"
                      label="CSV"
                    />
                  </div>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Reports */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Feedback Reports</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportData.feedback.map((report, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <div className="flex items-center space-x-2">
                      <ReportDownloadButton 
                        reportType="feedback" 
                        format="csv"
                        label="CSV"
                      />
                      <ReportDownloadButton 
                        reportType="feedback" 
                        format="excel"
                        label="Excel"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk Export */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Complete Platform Export</h3>
              <p className="text-blue-700">Download all platform data in a comprehensive report package</p>
            </div>
            <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              <FileSpreadsheet className="w-5 h-5 mr-2" />
              Export All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}