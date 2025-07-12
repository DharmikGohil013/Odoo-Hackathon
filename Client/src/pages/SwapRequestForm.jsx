import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swapService from '../services/swapService';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast';

const SwapRequestForm = () => {
  const [formData, setFormData] = useState({
    to_user_id: '',
    offered_skill: '',
    requested_skill: '',
    message: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const userData = await userService.getAllPublicUsers();
      setUsers(userData.filter(u => u._id !== user._id));
    } catch (error) {
      showError('Failed to load users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await swapService.sendSwapRequest(formData);
      showSuccess('Swap request sent successfully!');
      navigate('/swap-requests');
    } catch (error) {
      showError('Failed to send swap request');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Send Swap Request</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="to_user_id" className="block text-sm font-medium text-gray-700 mb-2">
              Select User
            </label>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
            />
            <select
              id="to_user_id"
              value={formData.to_user_id}
              onChange={(e) => setFormData(prev => ({ ...prev, to_user_id: e.target.value }))}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a user</option>
              {filteredUsers.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="offered_skill" className="block text-sm font-medium text-gray-700 mb-2">
              Skill I Offer
            </label>
            <input
              type="text"
              id="offered_skill"
              value={formData.offered_skill}
              onChange={(e) => setFormData(prev => ({ ...prev, offered_skill: e.target.value }))}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Photoshop, JavaScript, Guitar"
            />
          </div>

          <div>
            <label htmlFor="requested_skill" className="block text-sm font-medium text-gray-700 mb-2">
              Skill I Want to Learn
            </label>
            <input
              type="text"
              id="requested_skill"
              value={formData.requested_skill}
              onChange={(e) => setFormData(prev => ({ ...prev, requested_skill: e.target.value }))}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Excel, Python, Piano"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell them why you want to swap skills and how you can help each other..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapRequestForm;
