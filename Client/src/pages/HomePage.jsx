import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import feedbackService from '../services/feedbackService';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { useToast } from '../components/Toast';

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const usersPerPage = 12;
  
  const { showError } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, recommendationsData] = await Promise.all([
        userService.getAllPublicUsers(),
        feedbackService.getRecommendations().catch(() => ({ recommendations: [] }))
      ]);
      
      setUsers(usersData);
      setRecommendations(recommendationsData.recommendations || []);
    } catch (error) {
      showError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.college_or_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skills_offered?.some(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      user.skills_wanted?.some(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to SkillSwap</h1>
          <p className="text-xl mb-6">
            Connect with others to learn new skills and teach what you know best
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/swap-request"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Make a Swap Request
            </Link>
            <Link
              to="/groups"
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              Join Groups
            </Link>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
            <Link to="/recommendations" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 3).map(user => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}

      {/* All Users Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Discover Users</h2>
          <div className="flex space-x-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search users, skills, locations..."
              className="w-80"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchTerm ? 'No users found matching your search.' : 'No users available.'}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentUsers.map(user => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={usersPerPage}
                  totalItems={filteredUsers.length}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{users.length}</div>
          <div className="text-gray-600">Active Users</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {users.reduce((total, user) => total + (user.skills_offered?.length || 0), 0)}
          </div>
          <div className="text-gray-600">Skills Available</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {recommendations.length}
          </div>
          <div className="text-gray-600">Recommendations</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
