import { apiClient } from './apiClient';
import type { ConversationDto, MessageDto, UserDto } from '../types';

/** GET /api/user?search= */
export const getUsers = (search?: string): Promise<UserDto[]> =>
  apiClient.get<UserDto[]>(`/api/user${search ? `?search=${encodeURIComponent(search)}` : ''}`);

/** GET /api/user/conversations */
export const getConversations = (): Promise<ConversationDto[]> =>
  apiClient.get<ConversationDto[]>('/api/user/conversations');

/** GET /api/user/messages/{recipientId}?skip=&take= */
export const getMessages = (recipientId: string, skip = 0, take = 50): Promise<MessageDto[]> =>
  apiClient.get<MessageDto[]>(`/api/user/messages/${encodeURIComponent(recipientId)}?skip=${skip}&take=${take}`);

/** POST /api/user/messages/{senderId}/read */
export const markMessagesRead = (senderId: string): Promise<void> =>
  apiClient.post<void>(`/api/user/messages/${encodeURIComponent(senderId)}/read`);
