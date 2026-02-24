export const API_BASE_URL   = process.env.REACT_APP_API_URL ?? 'https://localhost:7058';
export const HUB_URL        = `${API_BASE_URL}/hubs/chat`;
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID ?? '';

/** SignalR event names — must exactly match ChatHub.cs SendAsync strings */
export const HubEvents = {
  // Client → Server
  SEND_MESSAGE:       'SendMessageToUser',
  SEND_GROUP_MESSAGE: 'SendMessageToGroup',
  JOIN_GROUP:         'JoinGroup',
  LEAVE_GROUP:        'LeaveGroup',
  MARK_READ:          'MarkMessageRead',
  TYPING:             'Typing',
  IS_ONLINE:          'IsUserOnline',
  // Server → Client
  RECEIVE_MESSAGE:    'ReceiveMessage',
  MESSAGE_SENT:       'MessageSent',
  RECEIVE_GROUP_MSG:  'ReceiveGroupMessage',
  MESSAGE_READ:       'MessageRead',
  USER_ONLINE:        'UserOnline',
  USER_OFFLINE:       'UserOffline',
  ONLINE_USERS:       'OnlineUsers',
  USER_TYPING:        'UserTyping',
  USER_JOINED:        'UserJoinedGroup',
  USER_LEFT:          'UserLeftGroup',
  ERROR:              'Error',
} as const;
