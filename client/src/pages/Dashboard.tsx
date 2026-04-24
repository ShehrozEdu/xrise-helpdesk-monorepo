import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Badge } from '../components/Badge';
import { Pagination } from '../components/Pagination';
import { FilterBar } from '../components/FilterBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { useTickets } from '../hooks/useTickets';
import { useUiStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { useSocket } from '../hooks/useSocket';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activeFilters, setFilter } = useUiStore();
  const { user } = useAuthStore();
  
  // Real-time updates
  useSocket();

  const { data, isLoading, isError, refetch } = useTickets({
    page: activeFilters.page,
    limit: 10,
    status: activeFilters.status as any,
    priority: activeFilters.priority as any,
    assigneeId: activeFilters.assigneeId,
    search: activeFilters.search || undefined,
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const getAssigneeName = (ticket: any): string => {
    if (!ticket.assigneeId) return 'Unassigned';
    return ticket.assigneeId.name || 'Unknown';
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>{user?.role === 'admin' ? 'Manage all support tickets across your team.' : 'View and respond to your assigned tickets.'}</p>
        </div>

        <FilterBar />

        {isLoading && <LoadingSpinner />}
        {isError && <ErrorState message="Failed to load tickets" onRetry={() => refetch()} />}

        {data && data.items.length === 0 && (
          <EmptyState
            title="No tickets found"
            description={
              activeFilters.search || activeFilters.status || activeFilters.priority
                ? 'Try adjusting your filters.'
                : user?.role === 'agent'
                ? 'No tickets are assigned to you yet.'
                : 'No tickets have been submitted yet.'
            }
          />
        )}

        {data && data.items.length > 0 && (
          <>
            <div className="table-wrapper glass-card">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Subject</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assignee</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((ticket: any) => (
                    <tr key={ticket._id} onClick={() => navigate(`/tickets/${ticket._id}`)} style={{ cursor: 'pointer' }}>
                      <td><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{ticket.ticketId}</span></td>
                      <td><span style={{ maxWidth: '280px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.subject}</span></td>
                      <td><Badge variant="priority" value={ticket.priority} /></td>
                      <td><Badge variant="status" value={ticket.status} /></td>
                      <td style={{ color: ticket.assigneeId ? 'var(--text-primary)' : 'var(--text-muted)' }}>{getAssigneeName(ticket)}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>{formatDate(ticket.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={(p) => setFilter('page', p)}
            />
            <div style={{ textAlign: 'center', marginTop: '8px', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              Showing {data.items.length} of {data.pagination.total} tickets
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
