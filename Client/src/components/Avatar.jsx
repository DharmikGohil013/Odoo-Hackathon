import React from 'react';

const Avatar = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-16 w-16 text-lg',
    lg: 'h-24 w-24 text-2xl',
    xl: 'h-32 w-32 text-4xl'
  };

  // Generate initials from user name
  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  // Generate background color based on user name
  const getBackgroundColor = (name) => {
    if (!name) return 'bg-gray-500';
    
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-emerald-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(user?.name);
  const bgColor = getBackgroundColor(user?.name);

  if (user?.profile_photo) {
    return (
      <img
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        src={user.profile_photo}
        alt={user.name || 'User'}
        onError={(e) => {
          // If image fails to load, replace with initials
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full ${bgColor} flex items-center justify-center text-white font-semibold ${className}`}>
      {initials}
    </div>
  );
};

export default Avatar;
