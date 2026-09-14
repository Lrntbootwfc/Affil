import React, { useState, useEffect } from 'react';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  shape?: 'circle' | 'squircle';
  onClick?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  size = 'md',
  className = '',
  shape = 'squircle',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  // Reset error state if new avatarUrl is passed
  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  // Extract first letter of the first word of the user's name
  const getInitial = (str: string): string => {
    if (!str || !str.trim()) return 'U';
    // Remove leading symbols like @ or quotes
    const cleaned = str.trim().replace(/^[@"'#\s]+/, '');
    if (!cleaned) return 'U';
    
    // Split by spaces to find the first word
    const firstWord = cleaned.split(/\s+/)[0];
    if (!firstWord) return 'U';
    
    return firstWord.charAt(0).toUpperCase();
  };

  const initial = getInitial(name);

  // Size mappings
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs font-bold',
    sm: 'w-8 h-8 text-sm font-bold',
    md: 'w-12 h-12 text-base font-extrabold',
    lg: 'w-16 h-16 text-2xl font-black',
    xl: 'w-20 h-20 text-3xl font-black',
    '2xl': 'w-24 h-24 text-4xl font-black',
  };

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  const hasValidImage = avatarUrl && avatarUrl.trim().length > 0 && !imageError;

  if (hasValidImage) {
    return (
      <div
        onClick={onClick}
        className={`${sizeClasses[size]} ${shapeClass} overflow-hidden border-2 border-[var(--accent-amber)] shrink-0 bg-[var(--card-bg)] shadow-md ${
          onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
        } ${className}`}
      >
        <img
          src={avatarUrl!}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Blank state: Clean 1-letter monogram of the first word with theme accent background
  return (
    <div
      onClick={onClick}
      className={`${sizeClasses[size]} ${shapeClass} bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] flex items-center justify-center select-none border-2 border-[var(--accent-amber)] shadow-md shrink-0 font-sans tracking-tight ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      } ${className}`}
      title={name || 'User Profile'}
    >
      <span>{initial}</span>
    </div>
  );
};

