import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useSignalRListeners, getHubConnection, stopHub } from '../../hooks/useSignalR';
import {
  setConversations, setActiveRecipient, setMessages,
} from '../../store/slices/chatSlice';
import { logout } from '../../store/slices/authSlice';
import { getConversations, getMessages, markMessagesRead } from '../../api/userApi';
import { HubEvents } from '../../config';
import Sidebar from '../../components/layout/Sidebar';
import ConversationList from '../../components/chat/ConversationList';
import MessageBubble from '../../components/chat/MessageBubble';
import TypingIndicator from '../../components/chat/TypingIndicator';
import MessageInput from '../../components/chat/MessageInput';
import Avatar from '../../components/ui/Avatar';
import type { ConversationDto, UserDto } from '../../types';

const HomePage: React.FC = () => {
  const dispatch   = useAppDispatch();
  const { user }   = useAppSelector(s => s.auth);
  const { conversations, activeRecipientId, messages, onlineUsers, connectionStatus, readMessageIds } =
    useAppSelector(s => s.chat);

  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimer = useRef<Record<string, NodeJS.Timeout>>({});
  const throttle    = useRef(0);

  useSignalRListeners();

  useEffect(() => {
    const h = getHubConnection();
    if (!h) return;
    const handler = (userId: string) => {
      setTypingUsers(p => [...new Set([...p, userId])]);
      clearTimeout(typingTimer.current[userId]);
      typingTimer.current[userId] = setTimeout(
        () => setTypingUsers(p => p.filter(u => u !== userId)), 3000
      );
    };
    h.on(HubEvents.USER_TYPING, handler);
    return () => { h.off(HubEvents.USER_TYPING, handler); };
  }, []);

  useEffect(() => {
    getConversations()
      .then(c => dispatch(setConversations(c)))
      .catch(console.error);
  }, [dispatch]);

  useEffect(() => {
    if (!activeRecipientId) return;
    getMessages(activeRecipientId)
      .then(msgs => dispatch(setMessages({ recipientId: activeRecipientId, messages: msgs })))
      .catch(console.error);
    markMessagesRead(activeRecipientId).catch(console.error);
  }, [activeRecipientId, dispatch]);

  const handleSelectConversation = useCallback((id: string) => {
    dispatch(setActiveRecipient(id));
  }, [dispatch]);

  const handleStartNew = useCallback((user: UserDto) => {
  const existing = conversations.find(c => c.otherUserId === user.id);
  if (existing) {
    dispatch(setActiveRecipient(user.id));
    return;
  }
  dispatch(setConversations([
    {
      otherUserId:         user.id,
      otherUserFirstName:  user.firstName,
      otherUserLastName:   user.lastName,
      otherUserAvatarUrl:  user.avatarUrl,
      lastMessageContent:  '',
      lastMessageSentAt:   new Date().toISOString(),
      lastMessageSenderId: '',
      unreadCount:         0,
    },
    ...conversations,
  ]));
  dispatch(setActiveRecipient(user.id));
}, [conversations, dispatch]);

  const handleSend = useCallback(async (content: string) => {
    const h = getHubConnection();
    if (!h || !activeRecipientId) return;
    if (h.state !== signalR.HubConnectionState.Connected) {
      alert('Not connected. Please wait…');
      return;
    }
    await h.invoke(HubEvents.SEND_MESSAGE, activeRecipientId, content);
  }, [activeRecipientId]);

  const handleTyping = useCallback(() => {
    const now = Date.now();
    if (now - throttle.current < 2000 || !activeRecipientId) return;
    throttle.current = now;
    getHubConnection()?.invoke(HubEvents.TYPING, activeRecipientId).catch(() => {});
  }, [activeRecipientId]);

  const handleLogout = useCallback(async () => {
    await stopHub();
    dispatch(logout());
  }, [dispatch]);

  const activeConv: ConversationDto | undefined = conversations.find(c => c.otherUserId === activeRecipientId);
  const activeMessages = activeRecipientId ? (messages[activeRecipientId] ?? []) : [];

  return (
    <div className="shell">
      {user && (
        <Sidebar user={user} connectionStatus={connectionStatus} onLogout={handleLogout} />
      )}

      <ConversationList
        conversations={conversations}
        activeId={activeRecipientId}
        onlineUsers={onlineUsers}
        onSelect={handleSelectConversation}
        onStartNew={handleStartNew}
      />

      <main className="main">
        {activeConv && user ? (
          <>
            <div className="topbar">
              <Avatar
                firstName={activeConv.otherUserFirstName}
                lastName={activeConv.otherUserLastName}
                picture={activeConv.otherUserAvatarUrl}
                userId={activeConv.otherUserId}
                size={38}
                showOnline
                online={onlineUsers.includes(activeConv.otherUserId)}
              />
              <div className="tb-info">
                <div className="tb-name">{activeConv.otherUserFirstName} {activeConv.otherUserLastName}</div>
                <div className="tb-status">
                  {onlineUsers.includes(activeConv.otherUserId) ? '🟢 Online' : activeConv.otherUserId}
                </div>
              </div>
            </div>

            <div className="msgs-area">
              {activeMessages.map((m, i) => {
                const isSent = m.senderId === user.sub;
                const showAv = !isSent && (i === activeMessages.length - 1 || activeMessages[i + 1]?.senderId !== m.senderId);
                return (
                  <MessageBubble
                    key={m.id}
                    message={m}
                    isSent={isSent}
                    isRead={readMessageIds.includes(m.id)}
                    showAvatar={showAv}
                  />
                );
              })}
              {typingUsers
                .filter(u => u === activeRecipientId)
                .map(u => <TypingIndicator key={u} />)}
            </div>

            <MessageInput onSend={handleSend} onTyping={handleTyping} />
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>Select a conversation</h3>
            <p>Messages are delivered in real-time via SignalR WebSockets.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
