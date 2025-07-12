import api from './authService';

export const groupService = {
  // Get all groups
  getGroups: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/groups?${params}`);
    return response.data;
  },

  // Create a new group
  createGroup: async (groupData) => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  // Get group details
  getGroupDetails: async (groupId) => {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },

  // Join a group
  joinGroup: async (groupId) => {
    const response = await api.post(`/groups/${groupId}/join`);
    return response.data;
  },

  // Leave a group
  leaveGroup: async (groupId) => {
    const response = await api.delete(`/groups/${groupId}/leave`);
    return response.data;
  },

  // Get user's groups
  getUserGroups: async () => {
    const response = await api.get('/groups/my-groups');
    return response.data;
  },

  // Mock data
  mockGroups: [
    {
      id: 1,
      name: 'Frontend Developers',
      description: 'A community for frontend developers to share knowledge and collaborate on projects.',
      icon: '💻',
      category: 'Technology',
      isPublic: true,
      memberCount: 1245,
      createdBy: {
        id: 1,
        name: 'Alex Johnson',
        avatar: null
      },
      tags: ['React', 'Vue', 'Angular', 'JavaScript'],
      createdAt: '2024-01-15T10:00:00Z',
      isJoined: true
    },
    {
      id: 2,
      name: 'UI/UX Designers Hub',
      description: 'Connect with fellow designers, share your work, and get feedback.',
      icon: '🎨',
      category: 'Design',
      isPublic: true,
      memberCount: 892,
      createdBy: {
        id: 2,
        name: 'Sarah Chen',
        avatar: null
      },
      tags: ['UI Design', 'UX Research', 'Figma', 'Adobe'],
      createdAt: '2024-02-01T14:30:00Z',
      isJoined: false
    },
    {
      id: 3,
      name: 'Data Science Community',
      description: 'Explore data science concepts, share datasets, and collaborate on ML projects.',
      icon: '📊',
      category: 'Data Science',
      isPublic: true,
      memberCount: 756,
      createdBy: {
        id: 3,
        name: 'Mike Rodriguez',
        avatar: null
      },
      tags: ['Python', 'Machine Learning', 'Statistics', 'AI'],
      createdAt: '2024-01-20T09:15:00Z',
      isJoined: true
    }
  ],

  // Mock functions
  mockGetGroups: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let groups = [...groupService.mockGroups];
        
        if (filters.category) {
          groups = groups.filter(group => 
            group.category.toLowerCase() === filters.category.toLowerCase()
          );
        }
        
        if (filters.search) {
          groups = groups.filter(group => 
            group.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            group.description.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        resolve({ groups, total: groups.length });
      }, 300);
    });
  },

  mockCreateGroup: async (groupData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newGroup = {
          id: Date.now(),
          ...groupData,
          memberCount: 1,
          createdAt: new Date().toISOString(),
          isJoined: true
        };
        resolve(newGroup);
      }, 500);
    });
  },

  mockJoinGroup: async (groupId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const group = groupService.mockGroups.find(g => g.id === groupId);
        if (group) {
          group.isJoined = true;
          group.memberCount += 1;
        }
        resolve(group);
      }, 300);
    });
  }
};