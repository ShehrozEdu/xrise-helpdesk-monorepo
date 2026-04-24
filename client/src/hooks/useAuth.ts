import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/auth.api';
import { useAuthStore } from '../store/authStore';
import type { LoginInput } from '@helpdesk/shared';

export const useHydrateAuth = () => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const hydrate = async () => {
      setLoading(true);
      try {
        const user = await authApi.getMe();
        setUser(user);
      } catch {
        setUser(null);
      }
    };
    hydrate();
  }, [setUser, setLoading]);
};

export const useLogin = () => {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (user) => {
      setUser(user);
    },
  });
};

export const useLogout = () => {
  const { clearUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearUser();
      queryClient.clear();
    },
  });
};
