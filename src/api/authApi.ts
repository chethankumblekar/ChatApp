import { apiClient } from './apiClient';

interface AuthResponse { token: string; }

/** POST /api/auth/google — exchange Google ID token for app JWT */
export const googleAuth = (googleIdToken: string): Promise<AuthResponse> =>
  apiClient.post<AuthResponse>('/api/auth/google', { token: googleIdToken });
