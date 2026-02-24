import React, { useState, useEffect, useRef } from 'react';
import type { ConversationDto, UserDto } from '../../types';
import { formatRelativeTime } from '../../utils/format';
import { getUsers } from '../../api/userApi';
import Avatar from '../ui/Avatar';

interface Props {
  conversations: ConversationDto[];
  activeId: string | null;
  onlineUsers: string[];
  onSelect: (id: string) => void;
  onStartNew: (user: UserDto) => void;
}

const ConversationList: React.FC<Props> = ({
  conversations, activeId, onlineUsers, onSelect, onStartNew,
}) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<UserDto[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const users = await getUsers(search.trim());
        setResults(users);
        setShowResults(true);
      } catch (e) {
        console.error(e);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const handleSelect = (conv: ConversationDto) => {
    setSearch('');
    setShowResults(false);
    onSelect(conv.otherUserId);
  };

  const handleStartNew = (user: UserDto) => {
    setSearch('');
    setShowResults(false);
    onStartNew(user);
  };

  return (
    <div className="cl-panel">
      <div className="cl-header">
        <h2 className="cl-title">Messages</h2>
      </div>

      <div className="cl-search">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search people…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
            onFocus={() => { if (results.length) setShowResults(true); }}
          />
          {search && (
            <button className="search-clear" onClick={() => { setSearch(''); setShowResults(false); }}>✕</button>
          )}
        </div>
      </div>

      {showResults ? (
        <div className="search-results">
          <div className="section-label">People</div>
          {searching && <div className="search-hint">Searching…</div>}
          {!searching && results.length === 0 && <div className="search-hint">No users found</div>}
          {results.map(u => (
            <div key={u.id} className="cl-item" onMouseDown={() => handleStartNew(u)}>
              <Avatar
                firstName={u.firstName} lastName={u.lastName}
                picture={u.avatarUrl} userId={u.id}
                size={38} showOnline online={onlineUsers.includes(u.id)}
              />
              <div className="cl-info">
                <div className="cl-row">
                  <span className="cl-name">{u.firstName} {u.lastName}</span>
                </div>
                <div className="cl-preview">{u.email}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="section-label">Recent</div>
          <div className="cl-list">
            {conversations.length === 0 && (
              <div className="search-hint">No conversations yet. Search for someone to start chatting.</div>
            )}
            {conversations.map(c => (
              <div
                key={c.otherUserId}
                className={`cl-item ${activeId === c.otherUserId ? 'active' : ''}`}
                onClick={() => handleSelect(c)}
              >
                <Avatar
                  firstName={c.otherUserFirstName} lastName={c.otherUserLastName}
                  picture={c.otherUserAvatarUrl} userId={c.otherUserId}
                  size={42} showOnline online={onlineUsers.includes(c.otherUserId)}
                />
                <div className="cl-info">
                  <div className="cl-row">
                    <span className="cl-name">{c.otherUserFirstName} {c.otherUserLastName}</span>
                    <span className="cl-time">{formatRelativeTime(c.lastMessageSentAt)}</span>
                  </div>
                  <div className="cl-preview">{c.lastMessageContent}</div>
                </div>
                {c.unreadCount > 0 && <span className="badge">{c.unreadCount}</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationList;