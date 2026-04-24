import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, UserPlus } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Badge } from '../components/Badge';
import { Timeline } from '../components/Timeline';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorState } from '../components/ErrorState';
import { useTicket, useReplyToTicket, useUpdateTicketStatus, useAssignTicket } from '../hooks/useTickets';
import { useUsers } from '../hooks/useUsers';
import { useDraftReply } from '../hooks/useDraftReply';
import { useAuthStore } from '../store/authStore';
import { useSocket } from '../hooks/useSocket';
import { TICKET_STATUSES } from '@helpdesk/shared';
import toast from 'react-hot-toast';

export const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Real-time updates
  useSocket(id);

  const { data, isLoading, isError, refetch } = useTicket(id || '');
  const replyMutation = useReplyToTicket(id || '');
  const statusMutation = useUpdateTicketStatus(id || '');
  const assignMutation = useAssignTicket(id || '');
  const draftMutation = useDraftReply();
  const { data: users } = useUsers();

  const [replyMessage, setReplyMessage] = useState('');
  const isAdmin = user?.role === 'admin';

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    replyMutation.mutate(replyMessage.trim(), {
      onSuccess: () => { setReplyMessage(''); toast.success('Reply sent!'); },
      onError: (err) => toast.error(err.message),
    });
  };

  if (isLoading) return <Layout><LoadingSpinner /></Layout>;
  if (isError || !data) return <Layout><ErrorState message="Failed to load ticket" onRetry={() => refetch()} /></Layout>;

  const { ticket, events } = data;
  const assigneeName = ticket.assigneeId?.name || 'Unassigned';

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}><ArrowLeft size={18} /></button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--accent-primary)' }}>{ticket.ticketId}</span>
              <Badge variant="status" value={ticket.status} />
              <Badge variant="priority" value={ticket.priority} />
            </div>
            <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginTop: '4px' }}>{ticket.subject}</h1>
          </div>
        </div>

        <div className="ticket-detail">
          <div className="ticket-info-panel">
            <div className="glass-card ticket-info-card">
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: '12px' }}>Ticket Information</h3>
              <div className="ticket-info-row"><span className="ticket-info-label">Customer</span><span className="ticket-info-value">{ticket.name}</span></div>
              <div className="ticket-info-row"><span className="ticket-info-label">Email</span><span className="ticket-info-value">{ticket.email}</span></div>
              <div className="ticket-info-row"><span className="ticket-info-label">Priority</span><Badge variant="priority" value={ticket.priority} /></div>
              <div className="ticket-info-row"><span className="ticket-info-label">Status</span><Badge variant="status" value={ticket.status} /></div>
              <div className="ticket-info-row"><span className="ticket-info-label">Assignee</span><span className="ticket-info-value">{assigneeName}</span></div>
              <div className="ticket-info-row"><span className="ticket-info-label">Created</span><span className="ticket-info-value">{formatDate(ticket.createdAt)}</span></div>
            </div>
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: '12px' }}>Description</h3>
              <div className="ticket-body">{ticket.body}</div>
            </div>
          </div>

          <div className="ticket-timeline-panel">
            <div className="glass-card ticket-timeline-card">
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: '16px' }}>Activity Timeline</h3>
              <Timeline events={events} />
            </div>

            <div className="glass-card ticket-actions">
              <form onSubmit={handleReply}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600 }}>Reply</h3>
                  <button type="button" className="btn btn-ai btn-sm" onClick={() => draftMutation.mutate(id || '', { onSuccess: (d) => setReplyMessage(d.draft), onError: (e) => toast.error(e.message) })} disabled={draftMutation.isPending}>
                    <Sparkles size={14} /> {draftMutation.isPending ? 'Drafting...' : '✨ Draft Reply'}
                  </button>
                </div>
                <textarea className="form-textarea" placeholder="Write your reply..." value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} rows={4} />
                <div className="ticket-actions-row" style={{ marginTop: '12px' }}>
                  <button type="submit" className="btn btn-primary" disabled={!replyMessage.trim() || replyMutation.isPending}>
                    <Send size={16} /> {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
                  </button>
                  <select className="form-select" value={ticket.status} onChange={(e) => statusMutation.mutate(e.target.value, { onSuccess: () => toast.success('Status updated'), onError: (e) => toast.error(e.message) })} disabled={statusMutation.isPending} style={{ width: 'auto', minWidth: '140px' }}>
                    {TICKET_STATUSES.map((s) => <option key={s} value={s}>{s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                  {isAdmin && users && (
                    <select className="form-select" value={ticket.assigneeId?._id || ''} onChange={(e) => assignMutation.mutate(e.target.value, { onSuccess: () => toast.success('Assigned'), onError: (e) => toast.error(e.message) })} disabled={assignMutation.isPending} style={{ width: 'auto', minWidth: '150px' }}>
                      <option value="" disabled>Assign to...</option>
                      {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                    </select>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
