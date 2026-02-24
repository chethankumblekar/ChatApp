import React from 'react';
import type { ConnectionStatus } from '../../types';

const colors: Record<ConnectionStatus, string> = {
  Connected:    '#22c55e',
  Reconnecting: '#f59e0b',
  Connecting:   '#f59e0b',
  Disconnected: '#ef4444',
};

const ConnectionBadge: React.FC<{ status: ConnectionStatus }> = ({ status }) => (
  <div title={`SignalR: ${status}`} style={{
    width: 8, height: 8, borderRadius: '50%',
    background: colors[status],
  }} />
);

export default ConnectionBadge;
