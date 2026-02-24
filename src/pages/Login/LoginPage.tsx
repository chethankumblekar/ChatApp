import React, { useState } from 'react';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';

const LoginPage: React.FC = () => {
  const [error, setError] = useState('');

  return (
    <div className="login-page">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">💬</div>
          <div>
            <div className="login-app-name">Chatchatni</div>
            <div className="login-app-sub">Real-time messaging</div>
          </div>
        </div>
        <h1 className="login-heading">Welcome back</h1>
        <p className="login-desc">Sign in with your Google account to access your conversations.</p>
        <GoogleLoginButton onError={setError} />
        {error && <div className="error-banner">{error}</div>}
      </div>
    </div>
  );
};

export default LoginPage;
