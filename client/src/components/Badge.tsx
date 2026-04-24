import React from 'react';

interface BadgeProps {
  variant: 'status' | 'priority';
  value: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, value }) => {
  const className = `badge badge-${value.replace(' ', '-')}`;
  const displayValue = value === 'in-progress' ? 'In Progress' : value;

  return (
    <span className={className} id={`badge-${variant}-${value}`}>
      {displayValue}
    </span>
  );
};
