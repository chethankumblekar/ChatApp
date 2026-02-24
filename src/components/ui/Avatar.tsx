import React from 'react';
import { avatarColor, initials } from '../../utils/format';

interface AvatarProps {
  firstName?: string;
  lastName?:  string;
  picture?:   string | null;
  userId?:    string;
  size?:      number;
  online?:    boolean;
  showOnline?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  firstName = '?', lastName = '', picture, userId, size = 38, online, showOnline,
}) => (
  <div style={{ position: 'relative', flexShrink: 0, width: size, height: size }}>
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: avatarColor(userId ?? firstName),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, fontWeight: 700, color: '#fff', overflow: 'hidden',
    }}>
      {picture
        ? <img src={picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : initials(firstName, lastName)}
    </div>
    {showOnline && (
      <div style={{
        position: 'absolute', bottom: 1, right: 1,
        width: size * 0.27, height: size * 0.27, borderRadius: '50%',
        background: online ? '#22c55e' : '#3f3f5a',
        border: '2px solid var(--bg1)',
      }} />
    )}
  </div>
);

export default Avatar;
