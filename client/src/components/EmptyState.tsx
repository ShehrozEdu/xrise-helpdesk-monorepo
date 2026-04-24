import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState: React.FC<{ title?: string; description?: string }> = ({
  title = 'No items found',
  description = 'There are no items to display at this time.',
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Inbox size={28} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
