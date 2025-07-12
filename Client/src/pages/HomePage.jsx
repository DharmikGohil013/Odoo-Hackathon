import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import feedbackService from '../services/feedbackService';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { useToast } from '../components/Toast';
import './HomePage.css';

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
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.college_or_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skills_offered?.some(skill =>
        skill.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      user.skills_wanted?.some(skill =>
        skill.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="home-loader-container">
        <div className="home-loader-center">
          <div className="home-loader-spin">
            <div className="home-loader-ring" />
            <div className="home-loader-ring2" />
          </div>
          <div className="home-loader-text">Loading SkillSwap...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-root">
      <div className="home-maxwidth">
        {/* Hero Section */}
        <section className="home-hero">
          <div className="home-hero-inner">
            <h1 className="home-hero-title">Welcome to SkillSwap</h1>
            <p className="home-hero-desc">
              Connect with others to learn new skills and teach what you know best
            </p>
            <div className="home-hero-actions">
              <Link
                to="/swap-request"
                className="home-hero-btn home-hero-btn-primary"
              >
                Make a Swap Request
              </Link>
              <Link
                to="/groups"
                className="home-hero-btn home-hero-btn-secondary"
              >
                Join Groups
              </Link>
            </div>
          </div>
        </section>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <section className="home-panel">
            <div className="home-panel-header">
              <div className="home-panel-title">Recommended for You</div>
              <Link to="/recommendations" className="home-panel-link">
                View All
              </Link>
            </div>
            <div className="home-usergrid">
              {recommendations.slice(0, 3).map(user => (
                <div className="home-usercard-wrap" key={user._id}>
                  <UserCard user={user} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Users Section */}
        <section className="home-panel">
          <div className="home-panel-header">
            <div className="home-panel-title">Discover Users</div>
            <div>
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search users, skills, locations..."
                className="home-searchbar"
              />
            </div>
          </div>
          {filteredUsers.length === 0 ? (
            <div className="home-empty">
              <div className="home-empty-icon">
                <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="home-empty-title">
                {searchTerm ? 'No users found' : 'No users available'}
              </div>
              <div className="home-empty-desc">
                {searchTerm ? 'No users match your search. Try something else!' : 'No public users yet. Check back soon!'}
              </div>
            </div>
          ) : (
            <>
              <div className="home-usergrid">
                {currentUsers.map(user => (
                  <div className="home-usercard-wrap" key={user._id}>
                    <UserCard user={user} />
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="home-pagination-wrap">
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
        </section>

        {/* Quick Stats */}
        <section className="home-stats-grid">
          <div className="home-stats-card">
            <div className="home-stats-value">{users.length}</div>
            <div className="home-stats-label">Active Users</div>
          </div>
          <div className="home-stats-card">
            <div className="home-stats-value">
              {users.reduce((total, user) => total + (user.skills_offered?.length || 0), 0)}
            </div>
            <div className="home-stats-label">Skills Available</div>
          </div>
          <div className="home-stats-card">
            <div className="home-stats-value">{recommendations.length}</div>
            <div className="home-stats-label">Recommendations</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
