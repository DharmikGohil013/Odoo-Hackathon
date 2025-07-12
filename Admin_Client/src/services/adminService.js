import api from './api'

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    status: 'active',
    createdAt: '2024-01-15',
    skillsCount: 5,
    swapsCount: 12,
    rating: 4.8,
    isOnline: true,
    isBanned: false
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    status: 'active',
    createdAt: '2024-01-20',
    skillsCount: 8,
    swapsCount: 15,
    rating: 4.9,
    isOnline: false,
    isBanned: false
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike@example.com',
    status: 'active',
    createdAt: '2024-02-01',
    skillsCount: 3,
    swapsCount: 8,
    rating: 4.6,
    isOnline: true,
    isBanned: false
  },
  {
    id: 4,
    name: 'Emma Davis',
    email: 'emma@example.com',
    status: 'banned',
    createdAt: '2024-01-10',
    skillsCount: 2,
    swapsCount: 3,
    rating: 3.2,
    isOnline: false,
    isBanned: true
  }
]

const mockSkills = [
  {
    id: 1,
    name: 'Advanced JavaScript',
    category: 'Programming',
    description: 'Expert level JavaScript including ES6+, async/await, and modern frameworks',
    status: 'pending',
    userName: 'John Smith',
    userId: 1,
    createdAt: '2024-03-01',
    level: 'expert'
  },
  {
    id: 2,
    name: 'Python Data Science',
    category: 'Data Science',
    description: 'Machine learning with Python, pandas, numpy, and scikit-learn',
    status: 'approved',
    userName: 'Sarah Johnson',
    userId: 2,
    createdAt: '2024-02-28',
    level: 'intermediate'
  },
  {
    id: 3,
    name: 'React Development',
    category: 'Frontend',
    description: 'Building modern web apps with React, hooks, and state management',
    status: 'pending',
    userName: 'Mike Chen',
    userId: 3,
    createdAt: '2024-03-02',
    level: 'intermediate'
  },
  {
    id: 4,
    name: 'Digital Marketing',
    category: 'Marketing',
    description: 'SEO, social media marketing, and content strategy',
    status: 'rejected',
    userName: 'Emma Davis',
    userId: 4,
    createdAt: '2024-02-25',
    level: 'beginner'
  }
]

const mockGroups = [
  {
    id: 1,
    name: 'JavaScript Developers',
    description: 'A community for JavaScript enthusiasts and professionals',
    memberCount: 45,
    skills: ['JavaScript', 'React', 'Node.js'],
    createdAt: '2024-01-15',
    lastActivity: '2024-03-01',
    isPrivate: false,
    isMember: false
  },
  {
    id: 2,
    name: 'Data Science Hub',
    description: 'Learn and share data science techniques and tools',
    memberCount: 32,
    skills: ['Python', 'Machine Learning', 'Statistics'],
    createdAt: '2024-01-20',
    lastActivity: '2024-02-28',
    isPrivate: false,
    isMember: true
  },
  {
    id: 3,
    name: 'Design Collective',
    description: 'UI/UX designers sharing tips and collaborating',
    memberCount: 28,
    skills: ['UI Design', 'Figma', 'User Research'],
    createdAt: '2024-02-01',
    lastActivity: '2024-03-02',
    isPrivate: true,
    isMember: false
  }
]

export const adminApi = {
  // Users Management - with mock data
  getAllUsers: () => Promise.resolve({ data: mockUsers }),
  getUserById: (id) => Promise.resolve({ data: mockUsers.find(u => u.id == id) }),
  banUser: (id) => Promise.resolve({ data: { success: true } }),
  unbanUser: (id) => Promise.resolve({ data: { success: true } }),
  deleteUser: (id) => Promise.resolve({ data: { success: true } }),
  updateUser: (id, data) => Promise.resolve({ data: { success: true } }),

  // Skills Management - with mock data
  getAllSkills: () => Promise.resolve({ data: mockSkills }),
  approveSkill: (id) => Promise.resolve({ data: { success: true } }),
  rejectSkill: (id) => Promise.resolve({ data: { success: true } }),
  deleteSkill: (id) => Promise.resolve({ data: { success: true } }),
  updateSkill: (id, data) => Promise.resolve({ data: { success: true } }),

  // Feedback Management
  getAllFeedback: () => Promise.resolve({ data: [
    {
      id: 1,
      message: 'Great platform! Really helped me learn new skills.',
      rating: 5,
      userName: 'John Smith',
      category: 'General',
      status: 'pending',
      createdAt: '2024-03-01'
    },
    {
      id: 2,
      message: 'Could use more advanced courses in data science.',
      rating: 4,
      userName: 'Sarah Johnson', 
      category: 'Content',
      status: 'resolved',
      createdAt: '2024-02-28'
    }
  ] }),
  deleteFeedback: (id) => Promise.resolve({ data: { success: true } }),
  updateFeedback: (id, data) => Promise.resolve({ data: { success: true } }),
  getFeedback: () => Promise.resolve({ data: [] }),
  getUserFeedback: (userId) => Promise.resolve({ data: [] }),

  // Announcements
  getAnnouncements: () => Promise.resolve({ data: [
    {
      id: 1,
      title: 'New Features Released!',
      content: 'We have added new skill categories and improved matching algorithm.',
      isImportant: true,
      author: 'Admin',
      createdAt: '2024-03-01'
    },
    {
      id: 2,
      title: 'Maintenance Window',
      content: 'Scheduled maintenance on Sunday 3-5 AM EST.',
      isImportant: false,
      author: 'Admin',
      createdAt: '2024-02-28'
    }
  ] }),
  createAnnouncement: (data) => Promise.resolve({ data: { id: Date.now(), ...data } }),
  updateAnnouncement: (id, data) => Promise.resolve({ data: { success: true } }),
  deleteAnnouncement: (id) => Promise.resolve({ data: { success: true } }),

  // Groups Management - with mock data
  getAllGroups: () => Promise.resolve({ data: mockGroups }),
  getGroups: () => Promise.resolve({ data: mockGroups }),
  getGroupById: (id) => Promise.resolve({ data: mockGroups.find(g => g.id == id) }),
  getGroupDetails: (id) => Promise.resolve({ data: { 
    ...mockGroups.find(g => g.id == id),
    members: [
      { id: 1, name: 'John Smith', joinedAt: '2024-02-01', isAdmin: true },
      { id: 2, name: 'Sarah Johnson', joinedAt: '2024-02-15', isAdmin: false }
    ]
  }}),
  deleteGroup: (id) => Promise.resolve({ data: { success: true } }),
  getGroupMembers: (id) => Promise.resolve({ data: [] }),
  joinGroup: (id) => Promise.resolve({ data: { success: true } }),
  leaveGroup: (id) => Promise.resolve({ data: { success: true } }),

  // Swaps Management
  getAllSwaps: () => Promise.resolve({ data: [
    {
      id: 1,
      requesterName: 'John Smith',
      providerName: 'Sarah Johnson',
      requestedSkill: 'Python Data Science',
      offeredSkill: 'JavaScript Advanced',
      status: 'active',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-01',
      durationHours: 2,
      description: 'Looking to exchange JavaScript knowledge for Python data science skills'
    },
    {
      id: 2,
      requesterName: 'Mike Chen',
      providerName: 'Emma Davis',
      requestedSkill: 'Digital Marketing',
      offeredSkill: 'React Development',
      status: 'pending',
      createdAt: '2024-02-28',
      updatedAt: '2024-02-28',
      durationHours: 3,
      description: 'Want to learn marketing in exchange for React training'
    }
  ] }),
  getSwaps: () => Promise.resolve({ data: [] }),
  getIncomingSwaps: () => Promise.resolve({ data: [] }),
  getOutgoingSwaps: () => Promise.resolve({ data: [] }),
  acceptSwap: (id) => Promise.resolve({ data: { success: true } }),
  rejectSwap: (id) => Promise.resolve({ data: { success: true } }),
  updateSwap: (id, data) => Promise.resolve({ data: { success: true } }),
  deleteSwap: (id) => Promise.resolve({ data: { success: true } }),

  // Reports and Analytics
  getReports: (params) => Promise.resolve({ data: [
    {
      id: 1,
      name: 'User Activity Report',
      type: 'users',
      period: 'month',
      createdAt: '2024-03-01'
    }
  ] }),
  getAnalytics: (params) => Promise.resolve({ data: {
    totalUsers: 156,
    newUsers: 23,
    activeSwaps: 18,
    completedSwaps: 45,
    totalSkills: 89,
    trendingSkills: 12,
    averageRating: 4.6,
    totalFeedback: 234,
    engagementRate: 78,
    swapSuccessRate: 85,
    growthRate: 12
  } }),
  downloadReport: (type, params) => Promise.resolve({ data: 'mock-report-data' }),
  getTrendingSkills: () => Promise.resolve({ data: [
    { name: 'JavaScript', count: 45 },
    { name: 'Python', count: 38 },
    { name: 'React', count: 32 },
    { name: 'Node.js', count: 28 },
    { name: 'TypeScript', count: 25 }
  ] }),

  // Recommendations - with mock data
  getNearbyUsers: () => Promise.resolve({ data: mockUsers.slice(0, 3) }),
  getSkillRecommendations: () => Promise.resolve({ data: mockSkills.slice(0, 3) }),
  getCollegeRecommendations: () => Promise.resolve({ data: [
    { name: 'MIT', skillMatch: 95 },
    { name: 'Stanford', skillMatch: 92 },
    { name: 'Harvard', skillMatch: 88 }
  ] }),

  // Upload - mock response
  uploadFile: (file) => Promise.resolve({ data: { 
    url: 'https://mock-storage.com/file.jpg',
    name: file.name,
    size: file.size 
  } })
}
