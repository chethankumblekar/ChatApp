import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { clearToken, getToken, setToken } from '../../utils/token';
import type { AuthUser } from '../../types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const tryHydrate = (): AuthState => {
  const token = getToken();
  if (!token) return { user: null, isAuthenticated: false };
  try {
    return { user: jwtDecode<AuthUser>(token), isAuthenticated: true };
  } catch {
    clearToken();
    return { user: null, isAuthenticated: false };
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: tryHydrate(),
  reducers: {
    loginSuccess(state, action: PayloadAction<string>) {
      setToken(action.payload);
      state.user = jwtDecode<AuthUser>(action.payload);
      state.isAuthenticated = true;
    },
    logout(state) {
      clearToken();
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
