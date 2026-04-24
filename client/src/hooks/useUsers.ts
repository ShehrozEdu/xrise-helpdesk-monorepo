import { useQuery } from '@tanstack/react-query';
import { userApi } from '../services/user.api';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getAll(),
    staleTime: 60_000,
  });
};
