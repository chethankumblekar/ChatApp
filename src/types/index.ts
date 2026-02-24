export interface AuthUser {
  sub:         string;  // email, used as userId everywhere
  email:       string;
  given_name:  string;
  family_name: string;
  picture:     string;
}

/** GET /api/user response */
export interface UserDto {
  id:          string;
  firstName:   string;
  lastName:    string;
  email:       string;
  avatarUrl:   string | null;
  lastSeenAt:  string;
}

/** GET /api/user/conversations response */
export interface ConversationDto {
  otherUserId:         string;
  otherUserFirstName:  string;
  otherUserLastName:   string;
  otherUserAvatarUrl:  string | null;
  lastMessageContent:  string;
  lastMessageSentAt:   string;
  lastMessageSenderId: string;
  unreadCount:         number;
}

/** GET /api/user/messages/{recipientId} response */
export interface MessageDto {
  id:          string;
  senderId:    string;
  recipientId: string | null;
  groupId:     string | null;
  content:     string;
  sentAt:      string;
  readAt:      string | null;
}

/** SignalR ReceiveMessage / MessageSent payload */
export interface SignalRMessage {
  id:          string;
  senderId:    string;
  recipientId: string | null;
  content:     string;
  sentAt:      string;
}

export type ConnectionStatus = 'Connecting' | 'Connected' | 'Reconnecting' | 'Disconnected';
