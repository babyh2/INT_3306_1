import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import ApiClient from '../services/api';
import './ChatWidget.css';

const ChatWidget = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [managers, setManagers] = useState([]);
  const [showManagerList, setShowManagerList] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    openChatWithManager: async (managerId) => {
      setIsOpen(true);
      await createChat(managerId);
    }
  }));

  useEffect(() => {
    if (isOpen) {
      loadChats();
      if (user.role === 'customer') {
        loadManagers();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.chat_id);
      const interval = setInterval(() => {
        loadMessages(selectedChat.chat_id);
      }, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChats = async () => {
    try {
      const response = await ApiClient.get('/chat/list');
      if (response.success) {
        setChats(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const loadManagers = async () => {
    try {
      const response = await ApiClient.get('/chat/managers');
      if (response.success) {
        setManagers(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load managers:', error);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const response = await ApiClient.get(`/chat/${chatId}/messages`);
      if (response.success) {
        setMessages(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const createChat = async (managerId) => {
    try {
      setLoading(true);
      const response = await ApiClient.post('/chat/create', { managerId });
      if (response.success) {
        setShowManagerList(false);
        await loadChats();
        setSelectedChat(response.data);
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Không thể tạo chat');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await ApiClient.post(`/chat/${selectedChat.chat_id}/send`, {
        message: newMessage
      });
      if (response.success) {
        setNewMessage('');
        await loadMessages(selectedChat.chat_id);
        await loadChats();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Không thể gửi tin nhắn');
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const getTotalUnread = () => {
    return chats.reduce((sum, chat) => sum + (chat.unread_count || 0), 0);
  };

  return (
    <div className="chat-widget">
      {/* Chat Button */}
      <button className="chat-button" onClick={() => setIsOpen(!isOpen)}>
        💬
        {getTotalUnread() > 0 && (
          <span className="chat-badge">{getTotalUnread()}</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>💬 Tin nhắn</h3>
            <button className="chat-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {!selectedChat ? (
            <div className="chat-list-container">
              {user.role === 'customer' && (
                <button 
                  className="btn-new-chat"
                  onClick={() => setShowManagerList(!showManagerList)}
                >
                  ➕ Chat mới
                </button>
              )}

              {showManagerList && (
                <div className="manager-list">
                  <h4>Chọn quản lý</h4>
                  {managers.map(manager => (
                    <div
                      key={manager.person_id}
                      className="manager-item"
                      onClick={() => createChat(manager.person_id)}
                    >
                      <div className="manager-avatar">👤</div>
                      <div className="manager-info">
                        <div className="manager-name">{manager.person_name}</div>
                        <div className="manager-email">{manager.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="chat-list">
                {chats.length === 0 ? (
                  <div className="no-chats">Chưa có tin nhắn nào</div>
                ) : (
                  chats.map(chat => (
                    <div
                      key={chat.chat_id}
                      className="chat-item"
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div className="chat-avatar">👤</div>
                      <div className="chat-info">
                        <div className="chat-name">
                          {user.role === 'manager' ? chat.user_name : chat.manager_name}
                        </div>
                        <div className="chat-last-message">
                          {chat.last_message || 'Bắt đầu chat'}
                        </div>
                      </div>
                      <div className="chat-meta">
                        <div className="chat-time">
                          {formatTime(chat.last_message_time || chat.updated_at)}
                        </div>
                        {chat.unread_count > 0 && (
                          <span className="chat-unread">{chat.unread_count}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="chat-conversation">
              <div className="conversation-header">
                <button className="btn-back" onClick={() => setSelectedChat(null)}>←</button>
                <div className="conversation-title">
                  {user.role === 'manager' ? selectedChat.user_name : selectedChat.manager_name}
                </div>
              </div>

              <div className="messages-container">
                {messages.map(msg => (
                  <div
                    key={msg.message_id}
                    className={`message ${msg.sender_id === user.id ? 'message-sent' : 'message-received'}`}
                  >
                    <div className="message-content">
                      {msg.message_text}
                    </div>
                    <div className="message-time">
                      {formatTime(msg.created_at)}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-form" onSubmit={sendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  disabled={loading}
                />
                <button type="submit" disabled={loading || !newMessage.trim()}>
                  ➤
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default ChatWidget;
