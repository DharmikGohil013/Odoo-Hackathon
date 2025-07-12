// services/recommendationService.js
import axios from 'axios';

const API_BASE = '/api/recommendations';

const recommendationService = {
  // Fetch recommended users for discovery (by skill matches)
  getSkillRecommendations: () =>
    axios.get(`${API_BASE}/skills`).then(res => res.data)
};

export default recommendationService;
