export const generateCSV = (data, headers) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return ''
  }
  
  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0])
  
  // Create header row
  const headerRow = csvHeaders.map(header => `"${header}"`).join(',')
  
  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header]
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '""'
      }
      
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`
      }
      
      // Escape quotes and wrap in quotes
      const stringValue = String(value).replace(/"/g, '""')
      return `"${stringValue}"`
    }).join(',')
  })
  
  return [headerRow, ...dataRows].join('\n')
}

export const downloadCSV = (data, filename, headers) => {
  const csv = generateCSV(data, headers)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export const transformUsersForCSV = (users) => {
  return users.map(user => ({
    'User ID': user._id,
    'Name': user.name || 'N/A',
    'Email': user.email,
    'Status': user.isBanned ? 'Banned' : 'Active',
    'Skills Count': user.skills?.length || 0,
    'Join Date': new Date(user.createdAt).toLocaleDateString(),
    'Last Login': user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
    'Profile Complete': user.profileComplete ? 'Yes' : 'No'
  }))
}

export const transformSwapsForCSV = (swaps) => {
  return swaps.map(swap => ({
    'Swap ID': swap._id,
    'Requester': swap.requester?.name || 'Unknown',
    'Requester Email': swap.requester?.email || 'N/A',
    'Receiver': swap.receiver?.name || 'Unknown',
    'Receiver Email': swap.receiver?.email || 'N/A',
    'Requester Skill': swap.requesterSkill?.name || 'Unknown',
    'Receiver Skill': swap.receiverSkill?.name || 'Unknown',
    'Status': swap.status,
    'Created Date': new Date(swap.createdAt).toLocaleDateString(),
    'Scheduled Date': swap.scheduledDate ? new Date(swap.scheduledDate).toLocaleDateString() : 'Not scheduled',
    'Duration': swap.duration ? `${swap.duration} hours` : 'Not specified',
    'Location': swap.location || 'Not specified'
  }))
}

export const transformSkillsForCSV = (skills) => {
  return skills.map(skill => ({
    'Skill ID': skill._id,
    'Name': skill.name,
    'Category': skill.category || 'Uncategorized',
    'Description': skill.description || 'No description',
    'User': skill.user?.name || 'Unknown',
    'User Email': skill.user?.email || 'N/A',
    'Status': skill.status,
    'Level': skill.level || 'Not specified',
    'Submitted Date': new Date(skill.createdAt).toLocaleDateString(),
    'Approved Date': skill.approvedAt ? new Date(skill.approvedAt).toLocaleDateString() : 'Not approved'
  }))
}

export const transformFeedbackForCSV = (feedback) => {
  return feedback.map(item => ({
    'Feedback ID': item._id,
    'Reviewer': item.reviewer?.name || 'Anonymous',
    'Reviewer Email': item.reviewer?.email || 'N/A',
    'Reviewee': item.reviewee?.name || 'Unknown',
    'Reviewee Email': item.reviewee?.email || 'N/A',
    'Rating': item.rating,
    'Comment': item.comment || 'No comment',
    'Date': new Date(item.createdAt).toLocaleDateString(),
    'Swap ID': item.swap?._id || 'N/A'
  }))
}