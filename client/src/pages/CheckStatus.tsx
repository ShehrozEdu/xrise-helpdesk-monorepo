import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ticketApi } from '../services/ticket.api';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { checkTicketStatusSchema, TicketStatusResponse } from '@helpdesk/shared';
import toast from 'react-hot-toast';

export const CheckStatus: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [ticketId, setTicketId] = useState(searchParams.get('ticketId') || '');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TicketStatusResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = checkTicketStatusSchema.safeParse({ ticketId, email });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        fieldErrors[err.path.join('.')] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setResult(null);

    try {
      const data = await ticketApi.checkStatus(parsed.data.ticketId, parsed.data.email);
      setResult(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to check status');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  };

  return (
    <div className="public-layout">
      <div className="public-container animate-slide-up">
        <div className="public-header">
          <div className="public-header-logo"><Search size={28} /></div>
          <h1>Check Ticket Status</h1>
          <p>Enter your ticket ID and email to view your ticket's status.</p>
        </div>

        <div className="public-card">
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="ticketId">Ticket ID <span className="required">*</span></label>
                <input id="ticketId" type="text" className="form-input" placeholder="e.g. TKT-000001" value={ticketId} onChange={(e) => { setTicketId(e.target.value); if (errors.ticketId) setErrors(p => ({ ...p, ticketId: '' })); }} />
                <span className="form-error">{errors.ticketId}</span>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="status-email">Email <span className="required">*</span></label>
                <input id="status-email" type="email" className="form-input" placeholder="Email used for the ticket" value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); }} />
                <span className="form-error">{errors.email}</span>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </form>

          {loading && <LoadingSpinner />}

          {result && (
            <div className="status-result glass-card">
              <div className="status-result-header">
                <h3>{result.subject}</h3>
                <Badge variant="status" value={result.status} />
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Ticket ID</span>
                  <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>{result.ticketId}</div>
                </div>
                <div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Priority</span>
                  <div><Badge variant="priority" value={result.priority} /></div>
                </div>
                <div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Submitted</span>
                  <div style={{ fontSize: 'var(--font-size-sm)' }}>{formatDate(result.createdAt)}</div>
                </div>
              </div>

              {result.latestReply ? (
                <div className="status-reply">
                  <div className="status-reply-label">Latest Agent Reply</div>
                  <div className="status-reply-message">{result.latestReply.message}</div>
                  <div className="status-reply-time">{formatDate(result.latestReply.createdAt)}</div>
                </div>
              ) : (
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No replies yet. Our team will respond shortly.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="public-footer">
          <Link to="/">Submit a new ticket</Link>
          <span style={{ margin: '0 12px', color: 'var(--text-muted)' }}>·</span>
          <Link to="/login">Agent login</Link>
        </div>
      </div>
    </div>
  );
};
