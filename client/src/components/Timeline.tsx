import React from 'react';
import type { EventResponse } from '@helpdesk/shared';

interface TimelineProps {
  events: EventResponse[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '32px 20px' }}>
        <p>No activity yet.</p>
      </div>
    );
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'created': return 'Ticket Created';
      case 'reply': return 'Reply';
      case 'status_change': return 'Status Changed';
      case 'reassigned': return 'Reassigned';
      default: return type;
    }
  };

  return (
    <div className="timeline">
      {events.map((event) => (
        <div key={event._id} className="timeline-item animate-fade-in">
          <div className={`timeline-dot ${event.type}`} />
          <div className="timeline-meta">
            <span className="timeline-author">
              {event.createdBy ? `${event.createdBy.name} (${event.createdBy.role})` : 'System'}
            </span>
            <span>·</span>
            <span>{getEventLabel(event.type)}</span>
            <span>·</span>
            <span>{formatDate(event.createdAt)}</span>
          </div>
          <div className="timeline-message">{event.message}</div>
        </div>
      ))}
    </div>
  );
};
