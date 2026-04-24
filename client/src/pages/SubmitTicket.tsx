import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Headphones, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { useCreateTicket } from '../hooks/useTickets';
import { createTicketSchema } from '@helpdesk/shared';
import toast from 'react-hot-toast';

export const SubmitTicket: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    body: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  const createMutation = useCreateTicket();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, priority: e.target.value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = createTicketSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.');
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    createMutation.mutate(result.data, {
      onSuccess: (data) => setCreatedTicketId(data.ticketId),
      onError: (error) => toast.error(error.message),
    });
  };

  const handleCopy = () => {
    if (createdTicketId) {
      navigator.clipboard.writeText(createdTicketId);
      toast.success('Ticket ID copied!');
    }
  };

  if (createdTicketId) {
    return (
      <div className="public-layout">
        <div className="public-container animate-slide-up">
          <div className="public-header">
            <div className="public-header-logo">
              <Headphones size={28} />
            </div>
            <h1>Ticket Submitted!</h1>
            <p>We've received your request and will get back to you soon.</p>
          </div>
          <div className="public-card">
            <div className="success-state">
              <div className="success-icon"><CheckCircle size={32} /></div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Your Ticket ID</p>
              <div className="success-ticket-id" onClick={handleCopy} title="Click to copy">
                {createdTicketId}
                <Copy size={18} />
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Save this ID to check your ticket status anytime.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to={`/status?ticketId=${createdTicketId}`} className="btn btn-primary">
                  <ExternalLink size={16} /> Check Status
                </Link>
                <button className="btn btn-secondary" onClick={() => setCreatedTicketId(null)}>
                  Submit Another Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-layout">
      <div className="public-container animate-slide-up">
        <div className="public-header">
          <div className="public-header-logo">
            <Headphones size={28} />
          </div>
          <h1>Submit a Ticket</h1>
          <p>Tell us how we can help. We'll get back to you as soon as possible.</p>
        </div>

        <div className="public-card">
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name <span className="required">*</span></label>
                  <input id="name" name="name" type="text" className="form-input" placeholder="Your name" value={formData.name} onChange={handleChange} />
                  <span className="form-error">{errors.name}</span>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email <span className="required">*</span></label>
                  <input id="email" name="email" type="email" className="form-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                  <span className="form-error">{errors.email}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Subject <span className="required">*</span></label>
                <input id="subject" name="subject" type="text" className="form-input" placeholder="Brief summary" value={formData.subject} onChange={handleChange} />
                <span className="form-error">{errors.subject}</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="body">Description <span className="required">*</span></label>
                <textarea id="body" name="body" className="form-textarea" placeholder="Detailed description..." value={formData.body} onChange={handleChange} rows={5} />
                <span className="form-error">{errors.body}</span>
              </div>

              <div className="form-group">
                <label className="form-label">Priority <span className="required">*</span></label>
                <div className="priority-group">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <div className="priority-option" key={p}>
                      <input type="radio" id={`priority-${p}`} name="priority" value={p} checked={formData.priority === p} onChange={handleRadioChange} />
                      <label htmlFor={`priority-${p}`}>{p.charAt(0).toUpperCase() + p.slice(1)}</label>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={createMutation.isPending} style={{ width: '100%', marginTop: '8px' }}>
                {createMutation.isPending ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>

        <div className="public-footer">
          <Link to="/status">Check existing ticket status</Link>
          <span style={{ margin: '0 12px', color: 'var(--text-muted)' }}>·</span>
          <Link to="/login">Agent login</Link>
        </div>
      </div>
    </div>
  );
};
