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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filterGroups();
    // eslint-disable-next-line
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
      group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await groupService.joinGroup(groupId);
      showSuccess('Successfully joined the group!');
      fetchGroups();
    } catch (error) {
      showError(error?.response?.data?.message || 'Failed to join group');
    }
  };

  const GroupCard = ({ group }) => (
    <div
      className="
        bg-white/80 backdrop-blur-md shadow-lg
        rounded-2xl
        transition-all
        border border-blue-100
        hover:-translate-y-1 hover:shadow-2xl
        flex flex-col
        group-card
      "
      tabIndex={0}
      aria-label={`Group: ${group.name}`}
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-3">
          {group.icon ? (
            <img
              className="h-12 w-12 rounded-full object-cover border border-blue-200"
              src={group.icon}
              alt={group.name}
              loading="lazy"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xl">
              {group.name?.slice(0, 2).toUpperCase() || "GR"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{group.name}</h3>
            <p className="text-xs text-gray-500">{group.members_count || 0} members</p>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
            ${group.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
          `}>
            {group.is_public ? 'Public' : 'Private'}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-5 line-clamp-3">{group.description}</p>
        <div className="mt-auto flex gap-2">
          <Link
            to={`/groups/${group._id}`}
            className="
              flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium
              hover:bg-blue-700 focus:outline focus:ring-2 focus:ring-blue-300 transition
              text-center
            "
          >
            View Details
          </Link>
          <button
            onClick={() => handleJoinGroup(group._id)}
            className="
              px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium
              hover:bg-blue-50 focus:outline focus:ring-2 focus:ring-blue-200 transition
            "
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );

  // Loading State (with improved loader)
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="relative flex h-16 w-16">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-16 w-16 bg-blue-600 items-center justify-center text-white text-lg font-bold">
            <svg className="h-8 w-8 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-2 sm:px-4">
      <div className="bg-white/95 shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col gap-3 md:flex-row md:gap-0 md:justify-between md:items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Groups & Communities</h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 md:mt-0 w-full md:w-auto">
              <SearchBar
                onSearch={setSearchTerm}
                placeholder="Search groups..."
                className="w-full sm:w-72 md:w-80"
              />
              <Link
                to="/groups/create"
                className="
                  bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium
                  hover:bg-blue-700 transition
                  shadow-md text-center
                "
              >
                Create Group
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <svg className="w-14 h-14 text-blue-200" fill="none" stroke="currentColor" strokeWidth={1.5}
                  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M17.5 17.5L19 19M10.5 6.5A5 5 0 0115.5 11.5M19 11.5A8.5 8.5 0 114.5 11.5 8.5 8.5 0 0119 11.5Z"/>
                </svg>
              </div>
              <div className="text-gray-500 text-lg font-medium mb-3">
                {searchTerm ? 'No groups found matching your search' : 'No groups available'}
              </div>
              <p className="text-gray-400 mb-6">
                {!searchTerm && 'Be the first to create a community!'}
              </p>
              {!searchTerm && (
                <Link
                  to="/groups/create"
                  className="
                    bg-blue-600 text-white px-6 py-3 rounded-lg
                    font-medium hover:bg-blue-700 transition
                    shadow
                  "
                >
                  Create First Group
                </Link>
              )}
            </div>
          ) : (
            <div
              className="
                grid gap-6
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                2xl:grid-cols-5
                mt-4
                group-cards-responsive
              "
            >
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
