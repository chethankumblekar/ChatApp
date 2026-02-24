import React from 'react';
import { formatMessageTime } from '../../utils/format';
import type { MessageDto } from '../../types';

interface Props {
  message: MessageDto;
  isSent:  boolean;
  isRead:  boolean;
  showAvatar?: boolean;
}

const MessageBubble: React.FC<Props> = ({ message, isSent, isRead, showAvatar }) => (
  <div className={`msg-row ${isSent ? 'sent' : 'recv'}`}>
    {!isSent && (
      <div style={{ width: 26, flexShrink: 0 }}>
        {showAvatar && (
          <div className="msg-avatar">
            {message.senderId[0]?.toUpperCase()}
          </div>
        )}
      </div>
    )}
    <div className={`msg-group ${isSent ? 'sent' : 'recv'}`}>
      <div className={`bubble ${isSent ? 'sent' : 'recv'}`}>
        {message.content}
      </div>
      <div className={`msg-meta ${isSent ? 'sent' : ''}`}>
        <span>{formatMessageTime(message.sentAt)}</span>
        {isSent && <span className={isRead ? 'tick-read' : 'tick-unread'}>{isRead ? '✓✓' : '✓'}</span>}
      </div>
    </div>
  </div>
);

export default MessageBubble;
