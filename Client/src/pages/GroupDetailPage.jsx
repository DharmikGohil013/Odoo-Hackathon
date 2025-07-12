// GroupDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast';
import groupService from '../services/groupService';
import messageService from '../services/messageService';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [joiningGroup, setJoiningGroup] = useState(false);
  const [leavingGroup, setLeavingGroup] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }

    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Fetch group details and messages
  useEffect(() => {
    console.log('GroupDetailPage mounted with groupId:', groupId);
    if (groupId && user) {
      console.log('User authenticated:', user);
      fetchGroupDetails();
      fetchMessages();
    } else {
      console.log('Missing groupId or user:', { groupId, user: !!user });
    }
  }, [groupId, user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-reload messages every 3 seconds when user is in the chat
  useEffect(() => {
    let pollInterval;
    
    if (groupId && user && group && isGroupMember()) {
      console.log('Starting message polling for group:', groupId);
      
      // Poll for new messages every 3 seconds
      pollInterval = setInterval(async () => {
        try {
          console.log('Polling for new messages...');
          const data = await messageService.getGroupMessages(groupId);
          const newMessages = data.messages || [];
          
          // Only update if we have new messages (avoid unnecessary re-renders)
          if (newMessages.length !== messages.length) {
            console.log('New messages detected, updating chat');
            setMessages(newMessages);
          }
        } catch (error) {
          console.error('Error polling messages:', error);
          // Don't show error for polling failures to avoid spam
        }
      }, 3000); // Poll every 3 seconds
    }

    // Cleanup interval on component unmount or when conditions change
    return () => {
      if (pollInterval) {
        console.log('Stopping message polling');
        clearInterval(pollInterval);
      }
    };
  }, [groupId, user, group, messages.length]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const groupData = await groupService.getGroup(groupId);
      setGroup(groupData);
    } catch (error) {
      showError('Failed to load group details');
      navigate('/groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setMessageLoading(true);
      console.log('Fetching messages for group:', groupId);
      const data = await messageService.getGroupMessages(groupId);
      console.log('Received message data:', data);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      showError('Failed to load messages: ' + error.message);
    } finally {
      setMessageLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSendingMessage(true);
      const messageData = {
        content: newMessage.trim(),
        messageType: 'text',
        ...(replyTo && { replyTo: replyTo._id })
      };

      console.log('Sending message:', messageData);
      const sentMessage = await messageService.sendMessage(groupId, messageData);
      console.log('Message sent:', sentMessage);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      setReplyTo(null);
      showSuccess('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Failed to send message: ' + error.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleEditMessage = async (messageId) => {
    if (!editContent.trim()) return;

    try {
      const updatedMessage = await messageService.editMessage(messageId, editContent.trim());
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, ...updatedMessage } : msg
      ));
      setEditingMessage(null);
      setEditContent('');
      showSuccess('Message updated!');
    } catch (error) {
      showError('Failed to edit message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await messageService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
      showSuccess('Message deleted!');
    } catch (error) {
      showError('Failed to delete message');
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      const message = messages.find(msg => msg._id === messageId);
      const hasReacted = message.reactions?.some(r => 
        r.user._id === user._id && r.emoji === emoji
      );

      if (hasReacted) {
        await messageService.removeReaction(messageId, emoji);
      } else {
        await messageService.addReaction(messageId, emoji);
      }
      
      // Refresh messages to get updated reactions
      fetchMessages();
    } catch (error) {
      showError('Failed to update reaction');
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const isGroupMember = () => {
    if (!group || !user) {
      console.log('Missing group or user for membership check:', { group: !!group, user: !!user });
      return false;
    }
    
    const isMember = group.members?.some(member => 
      (typeof member === 'string' ? member : member._id) === user._id
    ) || 
    group.admins?.some(admin => 
      (typeof admin === 'string' ? admin : admin._id) === user._id
    ) || 
    group.created_by === user._id;
    
    console.log('Group membership check:', { 
      userId: user._id, 
      groupId: group._id, 
      isMember,
      members: group.members?.length,
      admins: group.admins?.length,
      creator: group.created_by
    });
    
    return isMember;
  };

  const handleJoinGroup = async () => {
    try {
      setJoiningGroup(true);
      await groupService.joinGroup(groupId);
      await fetchGroupDetails(); // Refresh group data to update membership
      showSuccess('Successfully joined the group!');
    } catch (error) {
      console.error('Error joining group:', error);
      showError('Failed to join group: ' + error.message);
    } finally {
      setJoiningGroup(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group? You will lose access to all group messages.')) {
      return;
    }

    try {
      setLeavingGroup(true);
      await groupService.leaveGroup(groupId);
      showSuccess('Successfully left the group');
      navigate('/groups'); // Redirect to groups page after leaving
    } catch (error) {
      console.error('Error leaving group:', error);
      showError('Failed to leave group: ' + error.message);
    } finally {
      setLeavingGroup(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 transition-colors duration-500">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent mx-auto mb-4"></div>
              <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-purple-600 dark:border-purple-400 border-t-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">Loading group...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`max-w-7xl mx-auto p-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 dark:border-gray-700/30 group"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <svg className="w-6 h-6 text-yellow-400 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-indigo-600 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Group Header */}
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 p-8 mb-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {group?.icon ? (
                  <img 
                    src={group.icon} 
                    alt={group.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white/50 dark:border-gray-600/50 shadow-xl"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{group?.name}</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-3">{group?.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center text-indigo-600 dark:text-indigo-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {group?.members?.length || 0} members
                  </span>
                  <span className="flex items-center text-purple-600 dark:text-purple-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Chat Active
                  </span>
                </div>
              </div>
            </div>
            
            {/* Join/Leave Group Button */}
            <div className="flex flex-col items-end space-y-2">
              {isGroupMember() ? (
                <button
                  onClick={handleLeaveGroup}
                  disabled={leavingGroup}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
                >
                  {leavingGroup ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Leaving...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Exit Group</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleJoinGroup}
                  disabled={joiningGroup}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
                >
                  {joiningGroup ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span>Join Group</span>
                    </>
                  )}
                </button>
              )}
              
              {/* Membership Status Indicator */}
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isGroupMember() ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-gray-600 dark:text-gray-400">
                  {isGroupMember() ? 'Member' : 'Not a member'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        {isGroupMember() ? (
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
            <div 
              ref={chatContainerRef}
              className="h-96 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-600 scrollbar-track-transparent"
            >
              {messageLoading ? (
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
                                onClick={() => {
                                  setEditingMessage(null);
                                  setEditContent('');
                                }}
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
                                onClick={() => handleReaction(message._id, reaction.emoji)}
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
                            onClick={() => handleReaction(message._id, emoji)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors text-sm"
                            title={`React with ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                        
                        {message.sender._id === user._id && (
                          <>
                            <button
                              onClick={() => {
                                setEditingMessage(message._id);
                                setEditContent(message.content);
                              }}
                              className="p-1 hover:bg-white/20 rounded-full transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(message._id)}
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
                  disabled={!newMessage.trim() || sendingMessage}
                  className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                >
                  {sendingMessage ? (
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
        ) : (
          <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Restricted</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">You need to be a member of this group to access the chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetailPage;
