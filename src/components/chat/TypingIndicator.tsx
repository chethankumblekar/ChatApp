import React from 'react';

const TypingIndicator: React.FC = () => (
  <div className="msg-row recv">
    <div className="typing-bubble">
      <div className="t-dot" /><div className="t-dot" /><div className="t-dot" />
    </div>
  </div>
);

export default TypingIndicator;
