import { useState, useEffect, useRef } from 'react';
import messageService from '../services/messageService';

export const useGroupChat = (groupId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Fetch initial messages
  useEffect(() => {
    if (groupId) {
      fetchMessages();
      startPolling();
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [groupId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getGroupMessages(groupId);
      setMessages(data.messages || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    // Poll for new messages every 3 seconds
    pollIntervalRef.current = setInterval(async () => {
      try {
        const data = await messageService.getGroupMessages(groupId);
        const newMessages = data.messages || [];
        
        // Only update if we have new messages
        if (newMessages.length > messages.length) {
          setMessages(newMessages);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);
  };

  const sendMessage = async (content, messageType = 'text', replyTo = null) => {
    if (!content.trim()) return false;

    try {
      setSending(true);
      const messageData = {
        content: content.trim(),
        messageType,
        ...(replyTo && { replyTo: replyTo._id })
      };

      const sentMessage = await messageService.sendMessage(groupId, messageData);
      setMessages(prev => [...prev, sentMessage]);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSending(false);
    }
  };

  const editMessage = async (messageId, content) => {
    try {
      const updatedMessage = await messageService.editMessage(messageId, content);
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, ...updatedMessage } : msg
      ));
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await messageService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const addReaction = async (messageId, emoji) => {
    try {
      await messageService.addReaction(messageId, emoji);
      // Refresh messages to get updated reactions
      fetchMessages();
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const removeReaction = async (messageId, emoji) => {
    try {
      await messageService.removeReaction(messageId, emoji);
      // Refresh messages to get updated reactions
      fetchMessages();
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return {
    messages,
    loading,
    error,
    sending,
    messagesEndRef,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    scrollToBottom,
    formatMessageTime,
    refreshMessages: fetchMessages
  };
};
