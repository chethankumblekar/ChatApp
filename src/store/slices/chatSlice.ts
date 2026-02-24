import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ConversationDto, MessageDto, SignalRMessage } from '../../types';
import type { ConnectionStatus } from '../../types';

interface ChatState {
  conversations:    ConversationDto[];
  activeRecipientId: string | null;
  messages:         Record<string, MessageDto[]>; // recipientId → messages
  onlineUsers:      string[];
  connectionStatus: ConnectionStatus;
  readMessageIds:   string[];
}

const initialState: ChatState = {
  conversations:     [],
  activeRecipientId: null,
  messages:          {},
  onlineUsers:       [],
  connectionStatus:  'Connecting',
  readMessageIds:    [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations(state, a: PayloadAction<ConversationDto[]>) {
      state.conversations = a.payload;
    },
    setActiveRecipient(state, a: PayloadAction<string | null>) {
      state.activeRecipientId = a.payload;
      if (a.payload) {
        const conv = state.conversations.find(c => c.otherUserId === a.payload);
        if (conv) conv.unreadCount = 0;
      }
    },
    setMessages(state, a: PayloadAction<{ recipientId: string; messages: MessageDto[] }>) {
      state.messages[a.payload.recipientId] = a.payload.messages;
    },
    appendMessage(state, a: PayloadAction<SignalRMessage>) {
      const m = a.payload;
      const key = m.senderId === state.activeRecipientId ? m.senderId
                : m.recipientId ?? '';
      if (!state.messages[key]) state.messages[key] = [];
      // deduplicate by id
      if (!state.messages[key].find(x => x.id === m.id)) {
        state.messages[key].push({ ...m, groupId: null, readAt: null });
      }
      // bump conversation
      const conv = state.conversations.find(c => c.otherUserId === key);
      if (conv) {
        conv.lastMessageContent  = m.content;
        conv.lastMessageSentAt   = m.sentAt;
        conv.lastMessageSenderId = m.senderId;
        if (m.senderId !== state.activeRecipientId) conv.unreadCount++;
      }
    },
    markRead(state, a: PayloadAction<string>) {
      if (!state.readMessageIds.includes(a.payload))
        state.readMessageIds.push(a.payload);
    },
    setOnlineUsers(state, a: PayloadAction<string[]>) {
      state.onlineUsers = a.payload;
    },
    setUserOnline(state, a: PayloadAction<string>) {
      if (!state.onlineUsers.includes(a.payload)) state.onlineUsers.push(a.payload);
    },
    setUserOffline(state, a: PayloadAction<string>) {
      state.onlineUsers = state.onlineUsers.filter(u => u !== a.payload);
    },
    setConnectionStatus(state, a: PayloadAction<ConnectionStatus>) {
      state.connectionStatus = a.payload;
    },
  },
});

export const {
  setConversations, setActiveRecipient, setMessages, appendMessage,
  markRead, setOnlineUsers, setUserOnline, setUserOffline, setConnectionStatus,
} = chatSlice.actions;
export default chatSlice.reducer;
