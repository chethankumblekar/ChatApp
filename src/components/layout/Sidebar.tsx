import React from 'react';
import Avatar from '../ui/Avatar';
import ConnectionBadge from '../ui/ConnectionBadge';
import type { AuthUser, ConnectionStatus } from '../../types';

interface Props {
  user:             AuthUser;
  connectionStatus: ConnectionStatus;
  onLogout:         () => void;
}

const Sidebar: React.FC<Props> = ({ user, connectionStatus, onLogout }) => (
  <nav className="sidebar">
    <div className="s-logo">💬</div>
    <div className="s-spacer" />
    <div className="s-bottom">
      <ConnectionBadge status={connectionStatus} />
      <button className="nav-btn" title="Logout" onClick={onLogout}>⬡</button>
      <Avatar firstName={user.given_name} lastName={user.family_name} picture={user.picture} userId={user.sub} size={36} />
    </div>
  </nav>
);

export default Sidebar;
