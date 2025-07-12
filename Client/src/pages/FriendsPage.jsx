// FriendsPage.jsx
import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast';

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user } = useAuth();
  const { showError } = useToast();

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    filterFriends();
  }, [friends, searchTerm]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      // This would need to be implemented in the backend to get friend details
      const allUsers = await userService.getAllPublicUsers();
      const userFriends = allUsers.filter(u => user?.friends?.includes(u._id));
      setFriends(userFriends);
    } catch (error) {
      showError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const filterFriends = () => {
    if (!searchTerm) {
      setFilteredFriends(friends);
      return;
    }

    const filtered = friends.filter(friend =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Friends</h1>
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search friends..."
              className="w-80"
            />
          </div>
        </div>

        <div className="p-6">
          {filteredFriends.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                {searchTerm ? 'No friends found matching your search' : 'No friends yet'}
              </div>
              <p className="text-gray-400">
                {!searchTerm && 'Start connecting with other users to build your network!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFriends.map(friend => (
                <UserCard key={friend._id} user={friend} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
