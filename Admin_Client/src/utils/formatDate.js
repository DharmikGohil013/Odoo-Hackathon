export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) return 'Invalid Date'
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  return date.toLocaleDateString('en-US', defaultOptions)
}

export const formatDateTime = (dateString) => {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Unknown'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return formatDate(dateString)
}

export const isToday = (dateString) => {
  if (!dateString) return false
  
  const date = new Date(dateString)
  const today = new Date()
  
  return date.toDateString() === today.toDateString()
}

export const isThisWeek = (dateString) => {
  if (!dateString) return false
  
  const date = new Date(dateString)
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  return date >= weekAgo && date <= today
}