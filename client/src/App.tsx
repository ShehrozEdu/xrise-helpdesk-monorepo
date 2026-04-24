import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useHydrateAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SubmitTicket } from './pages/SubmitTicket';
import { CheckStatus } from './pages/CheckStatus';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { TicketDetail } from './pages/TicketDetail';
import { Analytics } from './pages/Analytics';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const AppRoutes: React.FC = () => {
  useHydrateAuth();
  return (
    <Routes>
      <Route path="/" element={<SubmitTicket />} />
      <Route path="/status" element={<CheckStatus />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a3e', color: '#e8e8f0', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', fontSize: '14px' } }} />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
