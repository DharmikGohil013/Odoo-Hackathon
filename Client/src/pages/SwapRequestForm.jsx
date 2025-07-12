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
    // eslint-disable-next-line
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

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Inline CSS for the component */}
      <style>{`
      :root {
        --primary: #5c6fff;
        --primary-dark: #4455e8;
        --accent: #facc15;
        --background: linear-gradient(135deg, #e6eafe 0%, #f8f7fc 50%, #fff8f8 100%);
        --glass-bg: rgba(255,255,255,0.82);
        --glass-blur: blur(15px);
        --border: rgba(130,140,255,0.12);
        --shadow: 0 8px 32px 0 rgba(60,60,110,0.14);
        --shadow-strong: 0 12px 64px 0 rgba(91,89,181,0.18);
      }
      .swap-form-root {
        min-height: 100vh;
        background: var(--background);
        padding: 40px 0;
        display: flex;
        align-items: flex-start;
        justify-content: center;
      }
      .swap-form-glass {
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        box-shadow: var(--shadow-strong);
        border-radius: 2rem;
        overflow: hidden;
        border: 1.5px solid var(--border);
        transition: box-shadow .2s;
        margin-top: 32px;
        width: 100%;
        max-width: 540px;
      }
      .swap-form-glass:hover {
        box-shadow: 0 12px 64px 0 rgba(91,89,181,0.27);
      }
      .swap-form-header {
        padding: 2rem 2.5rem 1rem 2.5rem;
        border-bottom: 1.5px solid var(--border);
        background: linear-gradient(90deg, #f5f8ff 50%, #fff7fd 100%);
      }
      .swap-form-header h1 {
        font-size: 2.2rem;
        font-weight: 700;
        letter-spacing: -0.5px;
        color: #343a5c;
        margin: 0;
      }
      .swap-form-body {
        padding: 2rem 2.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .swap-form-field label {
        font-size: 1rem;
        font-weight: 600;
        color: #47509a;
        margin-bottom: .45rem;
        display: block;
      }
      .swap-form-field input,
      .swap-form-field textarea,
      .swap-form-field select {
        width: 100%;
        padding: .9rem 1.1rem;
        border-radius: 1rem;
        border: 1.3px solid var(--border);
        background: rgba(246,248,255,0.88);
        box-shadow: 0 2px 16px 0 rgba(130,140,255,0.07);
        font-size: 1.05rem;
        color: #344056;
        transition: border .18s, box-shadow .18s;
        outline: none;
        margin-top: .05rem;
      }
      .swap-form-field input:focus,
      .swap-form-field textarea:focus,
      .swap-form-field select:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 2.5px #5c6fff33;
        background: #fff;
      }
      .swap-form-field input[disabled],
      .swap-form-field select[disabled] {
        opacity: 0.7;
        background: #f4f4fa;
      }
      .swap-form-search {
        margin-bottom: 0.8rem;
        border-radius: 1rem;
        border: 1.3px solid #e3e7fa;
        padding: .75rem 1.1rem;
        font-size: 1.04rem;
        outline: none;
        background: #f7faff;
        transition: border .18s;
      }
      .swap-form-search:focus {
        border-color: var(--primary);
        background: #fff;
      }
      .swap-form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1.1rem;
        margin-top: .5rem;
      }
      .swap-form-btn {
        border: none;
        padding: .95rem 2.2rem;
        font-size: 1.07rem;
        border-radius: 1.1rem;
        font-weight: 600;
        transition: background .16s, box-shadow .18s, color .12s;
        cursor: pointer;
        outline: none;
      }
      .swap-form-btn.cancel {
        background: transparent;
        color: #727b98;
        border: 1.5px solid #e5e7fa;
      }
      .swap-form-btn.cancel:hover {
        background: #f6f7fb;
        color: #3b4861;
      }
      .swap-form-btn.primary {
        background: var(--primary);
        color: #fff;
        box-shadow: 0 2px 16px 0 #5c6fff22;
      }
      .swap-form-btn.primary:disabled {
        opacity: 0.68;
        cursor: not-allowed;
      }
      .swap-form-btn.primary:hover:not(:disabled) {
        background: var(--primary-dark);
        box-shadow: 0 4px 24px 0 #5c6fff2e;
      }
      @media (max-width: 700px) {
        .swap-form-glass {
          border-radius: 1rem;
          margin-top: 12px;
          width: 98vw;
        }
        .swap-form-header,
        .swap-form-body {
          padding: 1.25rem 1rem;
        }
      }
      `}</style>

      <div className="swap-form-root">
        <div className="swap-form-glass">
          <div className="swap-form-header">
            <h1>Send Swap Request</h1>
          </div>
          <form onSubmit={handleSubmit} className="swap-form-body">
            <div className="swap-form-field">
              <label htmlFor="to_user_id">
                Select User
              </label>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="swap-form-search"
              />
              <select
                id="to_user_id"
                value={formData.to_user_id}
                onChange={(e) => setFormData(prev => ({ ...prev, to_user_id: e.target.value }))}
                required
              >
                <option value="">Choose a user</option>
                {filteredUsers.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="swap-form-field">
              <label htmlFor="offered_skill">
                Skill I Offer
              </label>
              <input
                type="text"
                id="offered_skill"
                value={formData.offered_skill}
                onChange={(e) => setFormData(prev => ({ ...prev, offered_skill: e.target.value }))}
                required
                placeholder="e.g., Photoshop, JavaScript, Guitar"
              />
            </div>

            <div className="swap-form-field">
              <label htmlFor="requested_skill">
                Skill I Want to Learn
              </label>
              <input
                type="text"
                id="requested_skill"
                value={formData.requested_skill}
                onChange={(e) => setFormData(prev => ({ ...prev, requested_skill: e.target.value }))}
                required
                placeholder="e.g., Excel, Python, Piano"
              />
            </div>

            <div className="swap-form-field">
              <label htmlFor="message">
                Message (Optional)
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                placeholder="Tell them why you want to swap skills and how you can help each other..."
              />
            </div>

            <div className="swap-form-actions">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="swap-form-btn cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="swap-form-btn primary"
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SwapRequestForm;
