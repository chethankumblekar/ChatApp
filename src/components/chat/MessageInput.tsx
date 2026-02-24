import React, { useState, useRef } from 'react';

interface Props {
  onSend:   (text: string) => void;
  onTyping: () => void;
  disabled?: boolean;
}

const MessageInput: React.FC<Props> = ({ onSend, onTyping, disabled }) => {
  const [text, setText] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText('');
    if (ref.current) ref.current.style.height = 'auto';
  };

  return (
    <div className="input-bar">
      <div className="input-wrap">
        <textarea
          ref={ref}
          rows={1}
          value={text}
          placeholder="Type a message… (Enter to send)"
          onChange={e => {
            setText(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            onTyping();
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
          }}
        />
      </div>
      <button className="send-btn" onClick={send} disabled={!text.trim() || disabled}>
        ➤
      </button>
    </div>
  );
};

export default MessageInput;
