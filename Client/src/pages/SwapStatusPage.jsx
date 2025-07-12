import React, { useState, useEffect } from 'react';
import swapService from '../services/swapService';
import { useToast } from '../components/Toast';
import { formatDateTime } from '../utils/formatDate';
import Avatar from '../components/Avatar';

const SwapStatusPage = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming');
  
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  const fetchSwapRequests = async () => {
    try {
      setLoading(true);
      const [incoming, outgoing] = await Promise.all([
        swapService.getIncomingRequests(),
        swapService.getOutgoingRequests()
      ]);
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (error) {
      showError('Failed to fetch swap requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await swapService.acceptSwapRequest(requestId);
      showSuccess('Swap request accepted');
      fetchSwapRequests();
    } catch (error) {
      showError('Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await swapService.rejectSwapRequest(requestId);
      showSuccess('Swap request rejected');
      fetchSwapRequests();
    } catch (error) {
      showError('Failed to reject request');
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await swapService.cancelSwapRequest(requestId);
      showSuccess('Swap request cancelled');
      fetchSwapRequests();
    } catch (error) {
      showError('Failed to cancel request');
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const RequestCard = ({ request, type }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <Avatar 
            user={type === 'incoming' ? request.from_user : request.to_user} 
            size="md" 
          />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {type === 'incoming' ? request.from_user?.name : request.to_user?.name}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDateTime(request.created_at)}
            </p>
          </div>
        </div>
        {getStatusBadge(request.status)}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Offered Skill:</p>
            <p className="text-green-600 font-medium">{request.offered_skill}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Requested Skill:</p>
            <p className="text-blue-600 font-medium">{request.requested_skill}</p>
          </div>
        </div>

        {request.message && (
          <div>
            <p className="text-sm font-medium text-gray-700">Message:</p>
            <p className="text-gray-600 text-sm mt-1">{request.message}</p>
          </div>
        )}

        {/* Action buttons */}
        {request.status === 'pending' && (
          <div className="flex space-x-2 pt-4">
            {type === 'incoming' ? (
              <>
                <button
                  onClick={() => handleAcceptRequest(request._id)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectRequest(request._id)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Reject
                </button>
              </>
            ) : (
              <button
                onClick={() => handleCancelRequest(request._id)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Cancel Request
              </button>
            )}
          </div>
        )}

        {request.status === 'accepted' && (
          <div className="pt-4">
            <p className="text-sm text-green-600 font-medium">
              ✅ Request accepted! You can now coordinate with the other user.
            </p>
          </div>
        )}
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
          <h1 className="text-2xl font-bold text-gray-900">Swap Requests</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex px-6">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 ${
                activeTab === 'incoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Incoming Requests ({incomingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'outgoing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Outgoing Requests ({outgoingRequests.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'incoming' ? (
            <div className="space-y-4">
              {incomingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">No incoming requests</div>
                  <p className="text-gray-400">
                    When others send you swap requests, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {incomingRequests.map(request => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      type="incoming"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {outgoingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">No outgoing requests</div>
                  <p className="text-gray-400">
                    Requests you send to others will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {outgoingRequests.map(request => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      type="outgoing"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapStatusPage;
