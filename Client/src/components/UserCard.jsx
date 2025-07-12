import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar';
import './UserCard.css';

const UserCard = ({ user, showActions = true }) => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(
    currentUser?.friends?.includes(user._id) || false
  );

  const handleAddFriend = async () => {
    try {
      setLoading(true);
      await userService.addFriend(user._id);
      setIsFriend(true);
    } catch (error) {
      console.error('Failed to add friend:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      setLoading(true);
      await userService.removeFriend(user._id);
      setIsFriend(false);
    } catch (error) {
      console.error('Failed to remove friend:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async () => {
    if (window.confirm('Are you sure you want to block this user?')) {
      try {
        setLoading(true);
        await userService.blockUser(user._id);
        // Remove user from current view logic can go here
      } catch (error) {
        console.error('Failed to block user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isCurrentUser = currentUser?._id === user._id;

  return (
    <div className="ucard-root">
      <div className="ucard-inner">
        <div className="ucard-row">
          <Avatar user={user} size="md" className="ucard-avatar" />
          <div className="ucard-info">
            <h3 className="ucard-name">{user.name}</h3>
            <p className="ucard-email">{user.email}</p>
            {user.location && (
              <p className="ucard-location">
                <span role="img" aria-label="location">📍</span> {user.location}
              </p>
            )}
            {user.college_or_company && (
              <p className="ucard-company">
                <span role="img" aria-label="company">🏢</span> {user.college_or_company}
              </p>
            )}
          </div>
          {user.rating > 0 && (
            <div className="ucard-rating" title="User Rating">
              <span className="ucard-star">⭐</span>
              <span className="ucard-rating-value">{user.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="ucard-skills-wrap">
          {user.skills_offered && user.skills_offered.length > 0 && (
            <div className="ucard-skill-block">
              <div className="ucard-skill-title ucard-skill-title-offered">Skills Offered</div>
              <div className="ucard-skill-list">
                {user.skills_offered.slice(0, 3).map((skill, idx) => (
                  <span className="ucard-skill-badge ucard-skill-offered" key={idx}>
                    {skill.name}
                  </span>
                ))}
                {user.skills_offered.length > 3 && (
                  <span className="ucard-skill-more">+{user.skills_offered.length - 3} more</span>
                )}
              </div>
            </div>
          )}
          {user.skills_wanted && user.skills_wanted.length > 0 && (
            <div className="ucard-skill-block">
              <div className="ucard-skill-title ucard-skill-title-wanted">Skills Wanted</div>
              <div className="ucard-skill-list">
                {user.skills_wanted.slice(0, 3).map((skill, idx) => (
                  <span className="ucard-skill-badge ucard-skill-wanted" key={idx}>
                    {skill.name}
                  </span>
                ))}
                {user.skills_wanted.length > 3 && (
                  <span className="ucard-skill-more">+{user.skills_wanted.length - 3} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Availability */}
        {user.availability && (
          <div className="ucard-availability">
            <span className="ucard-availability-badge">
              Available: {user.availability}
            </span>
          </div>
        )}

        {/* Actions */}
        {showActions && !isCurrentUser && (
          <div className="ucard-actions">
            <Link
              to={`/profile/${user._id}`}
              className="ucard-btn ucard-btn-view"
            >
              View Profile
            </Link>
            {isFriend ? (
              <button
                onClick={handleRemoveFriend}
                disabled={loading}
                className="ucard-btn ucard-btn-remove"
              >
                {loading ? '...' : 'Remove Friend'}
              </button>
            ) : (
              <button
                onClick={handleAddFriend}
                disabled={loading}
                className="ucard-btn ucard-btn-add"
              >
                {loading ? '...' : 'Add Friend'}
              </button>
            )}
            <button
              onClick={handleBlockUser}
              disabled={loading}
              className="ucard-btn ucard-btn-block"
              title="Block User"
            >
              🚫
            </button>
          </div>
        )}
        {isCurrentUser && (
          <div className="ucard-actions ucard-actions-single">
            <Link
              to="/profile"
              className="ucard-btn ucard-btn-edit"
            >
              Edit Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
