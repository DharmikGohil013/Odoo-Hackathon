import api from './authService';

export const swapService = {
  // Create a new swap request
  createSwapRequest: async (swapData) => {
    const response = await api.post('/swaps', swapData);
    return response.data;
  },

  // Get user's swap requests (incoming and outgoing)
  getSwapRequests: async (status = 'all') => {
    const response = await api.get(`/swaps?status=${status}`);
    return response.data;
  },

  // Update swap request status
  updateSwapStatus: async (swapId, status, message = '') => {
    const response = await api.put(`/swaps/${swapId}/status`, { status, message });
    return response.data;
  },

  // Get swap details
  getSwapDetails: async (swapId) => {
    const response = await api.get(`/swaps/${swapId}`);
    return response.data;
  },

  // Rate and review after swap completion
  rateSwap: async (swapId, rating, review) => {
    const response = await api.post(`/swaps/${swapId}/rate`, { rating, review });
    return response.data;
  },

  // Cancel swap request
  cancelSwapRequest: async (swapId, reason = '') => {
    const response = await api.delete(`/swaps/${swapId}`, { data: { reason } });
    return response.data;
  },

  // Mock data for development
  mockSwapRequests: [
    {
      id: 1,
      requester: {
        id: 2,
        name: 'Sarah Chen',
        avatar: null,
        rating: 4.9
      },
      recipient: {
        id: 1,
        name: 'Alex Johnson',
        avatar: null,
        rating: 4.8
      },
      skillOffered: 'UI/UX Design',
      skillWanted: 'React Development',
      message: 'Hi! I\'d love to learn React from you. I can teach you advanced UI/UX design principles in return.',
      status: 'pending',
      type: 'incoming',
      createdAt: '2024-03-10T10:00:00Z',
      duration: '2 weeks',
      sessionType: 'online',
      urgency: 'medium'
    },
    {
      id: 2,
      requester: {
        id: 1,
        name: 'Alex Johnson',
        avatar: null,
        rating: 4.8
      },
      recipient: {
        id: 3,
        name: 'Mike Rodriguez',
        avatar: null,
        rating: 4.7
      },
      skillOffered: 'React Development',
      skillWanted: 'Machine Learning',
      message: 'Would love to learn ML from you! I can help you with frontend development.',
      status: 'accepted',
      type: 'outgoing',
      createdAt: '2024-03-08T14:30:00Z',
      acceptedAt: '2024-03-09T09:15:00Z',
      duration: '3 weeks',
      sessionType: 'hybrid',
      urgency: 'high'
    },
    {
      id: 3,
      requester: {
        id: 4,
        name: 'Emma Wilson',
        avatar: null,
        rating: 4.6
      },
      recipient: {
        id: 1,
        name: 'Alex Johnson',
        avatar: null,
        rating: 4.8
      },
      skillOffered: 'Digital Marketing',
      skillWanted: 'Python Programming',
      message: 'I can teach you digital marketing strategies if you can help me with Python basics.',
      status: 'completed',
      type: 'incoming',
      createdAt: '2024-02-15T11:20:00Z',
      acceptedAt: '2024-02-16T08:45:00Z',
      completedAt: '2024-03-01T16:30:00Z',
      duration: '2 weeks',
      sessionType: 'online',
      urgency: 'low',
      rating: 5,
      review: 'Excellent experience! Alex is a great teacher and very patient.'
    }
  ],

  // Mock functions
  mockCreateSwapRequest: async (swapData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSwap = {
          id: Date.now(),
          ...swapData,
          status: 'pending',
          type: 'outgoing',
          createdAt: new Date().toISOString()
        };
        resolve(newSwap);
      }, 500);
    });
  },

  mockGetSwapRequests: async (status = 'all') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let swaps = [...swapService.mockSwapRequests];
        
        if (status !== 'all') {
          swaps = swaps.filter(swap => swap.status === status);
        }
        
        resolve({
          swaps,
          incoming: swaps.filter(swap => swap.type === 'incoming'),
          outgoing: swaps.filter(swap => swap.type === 'outgoing'),
          total: swaps.length
        });
      }, 500);
    });
  },

  mockUpdateSwapStatus: async (swapId, status, message = '') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const swap = swapService.mockSwapRequests.find(s => s.id === swapId);
        if (swap) {
          swap.status = status;
          if (status === 'accepted') {
            swap.acceptedAt = new Date().toISOString();
          } else if (status === 'completed') {
            swap.completedAt = new Date().toISOString();
          }
          if (message) {
            swap.responseMessage = message;
          }
        }
        resolve(swap);
      }, 300);
    });
  },

  mockRateSwap: async (swapId, rating, review) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const swap = swapService.mockSwapRequests.find(s => s.id === swapId);
        if (swap) {
          swap.rating = rating;
          swap.review = review;
          swap.status = 'completed';
        }
        resolve(swap);
      }, 300);
    });
  }
};