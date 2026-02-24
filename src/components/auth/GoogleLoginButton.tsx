import React, { useEffect, useRef } from 'react';
import { GOOGLE_CLIENT_ID } from '../../config';
import { googleAuth } from '../../api/authApi';
import { startHub } from '../../hooks/useSignalR';
import { loginSuccess } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';

interface Props { onError: (msg: string) => void; }

const GoogleLoginButton: React.FC<Props> = ({ onError }) => {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);``
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || initialized.current) return;
    initialized.current = true;

    const init = () => {
      (window as any).google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (resp: { credential: string }) => {
          try {
            const { token } = await googleAuth(resp.credential);
            dispatch(loginSuccess(token));
            await startHub();
          } catch (e: any) {
            onError(e.message ?? 'Authentication failed.');
          }
        },
      });

      // renderButton never calls navigator.credentials.get — no FedCM errors
      (window as any).google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'filled_black', size: 'large', width: 314 }
      );
    };

    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      init();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = init;
    document.head.appendChild(script);
  }, []);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <button className="btn-google" disabled>
        Google OAuth not configured
      </button>
    );
  }

  return <div id="google-signin-btn" />;
};

export default GoogleLoginButton;