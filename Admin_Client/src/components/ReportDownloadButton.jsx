import { useState } from 'react'
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react'

export default function ReportDownloadButton({ 
  reportType, 
  format = 'csv', 
  label,
  className = '',
  dateRange = '30',
  filters = {}
}) {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadReport = async () => {
    setIsDownloading(true)
    
    try {
      // In a real app, this would make an API call to generate and download the report
      const queryParams = new URLSearchParams({
        type: reportType,
        format,
        dateRange,
        ...filters
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a mock download
      const mockData = generateMockData(reportType, format)
      const blob = new Blob([mockData], { 
        type: format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv' 
      })
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Failed to download report:', error)
      alert('Failed to download report. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const generateMockData = (type, format) => {
    const timestamp = new Date().toISOString()
    
    if (format === 'csv') {
      switch (type) {
        case 'users':
          return `ID,Name,Email,Join Date,Status,Skills Count\n1,John Doe,john@example.com,2024-01-15,Active,5\n2,Jane Smith,jane@example.com,2024-02-20,Active,3\n3,Bob Johnson,bob@example.com,2024-03-10,Banned,2`
        
        case 'swaps':
          return `ID,Requester,Receiver,Requester Skill,Receiver Skill,Status,Date,Duration\n1,John Doe,Jane Smith,React Development,UI Design,Completed,2024-06-15,2 hours\n2,Bob Johnson,Alice Brown,Python Programming,Data Analysis,Active,2024-07-01,3 hours`
        
        case 'skills':
          return `ID,Name,Category,User,Status,Submitted Date,Approved Date\n1,React Development,Programming,John Doe,Approved,2024-01-20,2024-01-21\n2,UI Design,Design,Jane Smith,Approved,2024-02-15,2024-02-16\n3,Machine Learning,Data Science,Alice Brown,Pending,2024-07-10,`
        
        case 'feedback':
          return `ID,Reviewer,Reviewee,Rating,Comment,Date,Swap ID\n1,John Doe,Jane Smith,5,Great experience! Very knowledgeable,2024-06-20,1\n2,Jane Smith,John Doe,4,Good session but could improve timing,2024-06-20,1`
        
        default:
          return `Report Type,Generated Date\n${type},${timestamp}`
      }
    }
    
    // For Excel format, return a simple CSV that can be opened in Excel
    return generateMockData(type, 'csv')
  }

  const getIcon = () => {
    if (isDownloading) {
      return <Loader2 className="w-4 h-4 animate-spin" />
    }
    
    if (format === 'excel') {
      return <FileSpreadsheet className="w-4 h-4" />
    }
    
    return <Download className="w-4 h-4" />
  }

  const getButtonText = () => {
    if (isDownloading) {
      return 'Generating...'
    }
    
    if (label) {
      return label
    }
    
    return format === 'excel' ? 'Excel' : 'CSV'
  }

  return (
    <button
      onClick={downloadReport}
      disabled={isDownloading}
      className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        format === 'excel'
          ? 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
          : 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100'
      } ${className}`}
    >
      {getIcon()}
      <span className="ml-1.5">{getButtonText()}</span>
    </button>
  )
}