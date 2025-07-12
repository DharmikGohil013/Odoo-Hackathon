import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const GroupChatComponent = ({ 
  messages, 
  loading, 
  sending, 
  messagesEndRef,
  onSendMessage, 
  onEditMessage, 
  onDeleteMessage, 
  onAddReaction, 
  formatMessageTime 
}) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const success = await onSendMessage(newMessage, 'text', replyTo);
    if (success) {
      setNewMessage('');
      setReplyTo(null);
    }
  };

  const handleEditMessage = async (messageId) => {
    if (!editContent.trim()) return;

    const success = await onEditMessage(messageId, editContent.trim());
    if (success) {
      setEditingMessage(null);
      setEditContent('');
    }
  };

  const startEdit = (message) => {
    setEditingMessage(message._id);
    setEditContent(message.content);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditContent('');
  };

  return (
    <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 border-b border-white/10 dark:border-gray-700/10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <svg className="w-7 h-7 mr-3 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Group Chat
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Live</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-600 scrollbar-track-transparent">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Start the conversation!</h3>
            <p className="text-gray-600 dark:text-gray-400">Be the first to send a message in this group.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message._id} className={`flex ${message.sender._id === user._id ? 'justify-end' : 'justify-start'} group`}>
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.sender._id === user._id ? 'order-2' : 'order-1'}`}>
                {/* Message Bubble */}
                <div className={`
                  relative p-4 rounded-2xl backdrop-blur-md border
                  ${message.sender._id === user._id 
                    ? 'bg-gradient-to-r from-indigo-500/80 to-purple-600/80 text-white border-indigo-400/30 ml-12' 
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border-white/30 dark:border-gray-700/30 mr-12'
                  }
                  shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:scale-[1.02]
                `}>
                  {/* Reply indicator */}
                  {message.replyTo && (
                    <div className="mb-2 p-2 bg-black/10 rounded-lg text-xs opacity-70">
                      <div className="font-medium">Replying to {message.replyTo.sender?.name}</div>
                      <div className="truncate">{message.replyTo.content}</div>
                    </div>
                  )}
                  
                  {/* Message content */}
                  {editingMessage === message._id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 resize-none"
                        rows="2"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditMessage(message._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  )}
                  
                  {/* Message reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.reactions.reduce((acc, reaction) => {
                        const existing = acc.find(r => r.emoji === reaction.emoji);
                        if (existing) {
                          existing.count++;
                          existing.users.push(reaction.user);
                        } else {
                          acc.push({ emoji: reaction.emoji, count: 1, users: [reaction.user] });
                        }
                        return acc;
                      }, []).map((reaction, idx) => (
                        <button
                          key={idx}
                          onClick={() => onAddReaction(message._id, reaction.emoji)}
                          className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 rounded-full px-2 py-1 text-xs transition-colors"
                        >
                          <span>{reaction.emoji}</span>
                          <span>{reaction.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Message info */}
                  <div className={`mt-2 text-xs flex items-center justify-between ${message.sender._id === user._id ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                    <span>{message.sender._id !== user._id && message.sender.name}</span>
                    <div className="flex items-center space-x-2">
                      <span>{formatMessageTime(message.createdAt)}</span>
                      {message.isEdited && <span className="italic">(edited)</span>}
                    </div>
                  </div>
                </div>
                
                {/* Message actions */}
                <div className={`flex items-center space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                  <button
                    onClick={() => setReplyTo(message)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    title="Reply"
                  >
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  
                  {/* Emoji reactions */}
                  {['👍', '❤️', '😄', '😮', '😢', '😡'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => onAddReaction(message._id, emoji)}
                      className="p-1 hover:bg-white/20 rounded-full transition-colors text-sm"
                      title={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                  
                  {message.sender._id === user._id && (
                    <>
                      <button
                        onClick={() => startEdit(message)}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteMessage(message._id)}
                        className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyTo && (
        <div className="px-6 py-3 bg-indigo-500/10 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Replying to <strong>{replyTo.sender.name}</strong>: {replyTo.content.substring(0, 50)}...
              </span>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-6 bg-gradient-to-r from-white/5 to-indigo-500/5 border-t border-white/10 dark:border-gray-700/10">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          >
            {sending ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupChatComponent;
