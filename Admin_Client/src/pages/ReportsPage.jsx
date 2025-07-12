import { useState, useEffect } from 'react'
import { adminApi } from '../services/adminService'
import { LoadingTable, LoadingSpinner, LoadingCard } from '../components/Loading'
import ReportDownloadButton from '../components/ReportDownloadButton'
import { 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp, 
  Users,
  ArrowRightLeft,
  Calendar,
  Filter,
  RefreshCw,
  PieChart,
  Activity
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [filterPeriod, setFilterPeriod] = useState('month')
  const [downloadingReport, setDownloadingReport] = useState(null)

  useEffect(() => {
    fetchReports()
    fetchAnalytics()
  }, [filterPeriod])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getReports({ period: filterPeriod })
      setReports(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch reports')
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      const response = await adminApi.getAnalytics({ period: filterPeriod })
      setAnalytics(response.data || {})
    } catch (error) {
      toast.error('Failed to fetch analytics')
      console.error('Error fetching analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleDownloadReport = async (reportType) => {
    try {
      setDownloadingReport(reportType)
      const response = await adminApi.downloadReport(reportType, { period: filterPeriod })
      
      // Create blob and download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${reportType}_report_${filterPeriod}.xlsx`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success('Report downloaded successfully')
    } catch (error) {
      toast.error('Failed to download report')
      console.error('Error downloading report:', error)
    } finally {
      setDownloadingReport(null)
    }
  }

  const refreshData = () => {
    fetchReports()
    fetchAnalytics()
    toast.success('Data refreshed')
  }

  const reportTypes = [
    {
      id: 'users',
      title: 'User Activity Report',
      description: 'Comprehensive user registration, activity, and engagement metrics',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'swaps',
      title: 'Skill Swap Report',
      description: 'Detailed analysis of skill exchanges, success rates, and popular skills',
      icon: ArrowRightLeft,
      color: 'green'
    },
    {
      id: 'skills',
      title: 'Skills Analytics Report',
      description: 'Trending skills, demand analysis, and skill category breakdowns',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      id: 'feedback',
      title: 'Feedback & Ratings Report',
      description: 'User satisfaction scores, feedback analysis, and improvement insights',
      icon: BarChart3,
      color: 'orange'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Generate comprehensive reports and view platform analytics</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      {analyticsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      ) : analytics ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.total_users || 0}</p>
                <p className="text-sm text-green-600 mt-1">
                  +{analytics.new_users || 0} new this {filterPeriod}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Swaps</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.active_swaps || 0}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {analytics.completed_swaps || 0} completed
                </p>
              </div>
              <ArrowRightLeft className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Skills</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.total_skills || 0}</p>
                <p className="text-sm text-purple-600 mt-1">
                  {analytics.trending_skills || 0} trending
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.average_rating ? `${analytics.average_rating}/5` : 'N/A'}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  {analytics.total_feedback || 0} feedback received
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      ) : null}

      {/* Quick Stats */}
      {analytics && !analyticsLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">User Engagement</h3>
              <p className="text-gray-600 mt-1">
                {analytics.engagement_rate || 0}% active users this {filterPeriod}
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
                <PieChart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Success Rate</h3>
              <p className="text-gray-600 mt-1">
                {analytics.swap_success_rate || 0}% of swaps completed successfully
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Growth Rate</h3>
              <p className="text-gray-600 mt-1">
                {analytics.growth_rate || 0}% increase in platform activity
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Report Generation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Generate Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((report) => {
            const Icon = report.icon
            const isDownloading = downloadingReport === report.id
            
            return (
              <div
                key={report.id}
                className={`border-2 rounded-lg p-6 ${getColorClasses(report.color)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                      <p className="text-sm opacity-90 mb-4">{report.description}</p>
                      <button
                        onClick={() => handleDownloadReport(report.id)}
                        disabled={isDownloading}
                        className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 disabled:opacity-50"
                      >
                        {isDownloading ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download Report
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Reports */}
      {loading ? (
        <LoadingTable rows={5} cols={4} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          </div>
          
          {reports.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports generated yet</h3>
              <p className="text-gray-500">Generate your first report using the options above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {report.name || `${report.type} Report`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {report.description || 'Generated report'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <ReportDownloadButton
                          reportId={report.id}
                          reportName={report.name || `${report.type}_report`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
