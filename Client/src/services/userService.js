import api from './authService';

export const userService = {
  // Get all users with filtering
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/users?${params}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Search users by skills, location, etc.
  searchUsers: async (query, filters = {}) => {
    const params = new URLSearchParams({ q: query, ...filters });
    const response = await api.get(`/users/search?${params}`);
    return response.data;
  },

  // Get user recommendations
  getRecommendations: async () => {
    const response = await api.get('/users/recommendations');
    return response.data;
  },

  // Upload profile picture
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Mock data for development
  mockUsers: [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex@skillswap.com',
      avatar: null,
      college: 'MIT',
      company: 'Google',
      location: 'San Francisco, CA',
      bio: 'Full-stack developer passionate about teaching and learning new technologies.',
      skillsOffered: ['React', 'Node.js', 'Python', 'Machine Learning'],
      skillsWanted: ['Go', 'Kubernetes', 'DevOps', 'System Design'],
      rating: 4.8,
      totalSwaps: 24,
      isPublic: true,
      isOnline: true,
      lastSeen: new Date(),
      joinedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      email: 'sarah@skillswap.com',
      avatar: null,
      college: 'Stanford',
      company: 'Meta',
      location: 'Palo Alto, CA',
      bio: 'UI/UX designer with a passion for creating beautiful and functional interfaces.',
      skillsOffered: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
      skillsWanted: ['Frontend Development', 'React', 'TypeScript', 'Animation'],
      rating: 4.9,
      totalSwaps: 18,
      isPublic: true,
      isOnline: false,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinedAt: '2024-02-20'
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      email: 'mike@skillswap.com',
      avatar: null,
      college: 'UC Berkeley',
      company: 'Tesla',
      location: 'Austin, TX',
      bio: 'Data scientist and ML engineer interested in AI applications.',
      skillsOffered: ['Python', 'TensorFlow', 'Data Analysis', 'Statistics'],
      skillsWanted: ['Cloud Architecture', 'Docker', 'Microservices', 'Scala'],
      rating: 4.7,
      totalSwaps: 31,
      isPublic: true,
      isOnline: true,
      lastSeen: new Date(),
      joinedAt: '2024-01-08'
    }
  ],

  // Mock functions
  mockGetUsers: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let users = [...userService.mockUsers];
        
        if (filters.skill) {
          users = users.filter(user => 
            user.skillsOffered.some(skill => 
              skill.toLowerCase().includes(filters.skill.toLowerCase())
            )
          );
        }
        
        if (filters.location) {
          users = users.filter(user => 
            user.location.toLowerCase().includes(filters.location.toLowerCase())
          );
        }
        
        resolve({
          users,
          total: users.length,
          page: 1,
          limit: 10
        });
      }, 500);
    });
  },

  mockSearchUsers: async (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = userService.mockUsers.filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.skillsOffered.some(skill => 
            skill.toLowerCase().includes(query.toLowerCase())
          ) ||
          user.location.toLowerCase().includes(query.toLowerCase())
        );
        
        resolve({ users, total: users.length });
      }, 300);
    });
  },

  mockGetRecommendations: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          recommendations: userService.mockUsers.slice(0, 2),
          reason: 'Based on your skills and location'
        });
      }, 500);
    });
  }
};