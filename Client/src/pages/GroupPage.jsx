// GroupPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import groupService from '../services/groupService';
import SearchBar from '../components/SearchBar';
import { useToast } from '../components/Toast';

const GroupPage = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    filterGroups();
  }, [groups, searchTerm]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const groupsData = await groupService.getAllPublicGroups();
      setGroups(groupsData);
    } catch (error) {
      showError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const filterGroups = () => {
    if (!searchTerm) {
      setFilteredGroups(groups);
      return;
    }

    const filtered = groups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await groupService.joinGroup(groupId);
      showSuccess('Successfully joined the group!');
      fetchGroups();
    } catch (error) {
      showError('Failed to join group');
    }
  };

  const GroupCard = ({ group }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          {group.icon && (
            <img className="h-12 w-12 rounded-full" src={group.icon} alt={group.name} />
          )}
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
            <p className="text-sm text-gray-500">{group.members_count || 0} members</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            group.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {group.is_public ? 'Public' : 'Private'}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{group.description}</p>
        
        <div className="flex space-x-2">
          <Link
            to={`/groups/${group._id}`}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 text-center"
          >
            View Details
          </Link>
          <button
            onClick={() => handleJoinGroup(group._id)}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );

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
            <h1 className="text-2xl font-bold text-gray-900">Groups & Communities</h1>
            <div className="flex space-x-4">
              <SearchBar
                onSearch={setSearchTerm}
                placeholder="Search groups..."
                className="w-80"
              />
              <Link
                to="/groups/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Group
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                {searchTerm ? 'No groups found matching your search' : 'No groups available'}
              </div>
              <p className="text-gray-400 mb-6">
                {!searchTerm && 'Be the first to create a community!'}
              </p>
              {!searchTerm && (
                <Link
                  to="/groups/create"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                >
                  Create First Group
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map(group => (
                <GroupCard key={group._id} group={group} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
