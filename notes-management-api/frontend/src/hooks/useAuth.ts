import { useQuery, useMutation } from '@tanstack/react-query';
import * as api from '../services/api';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.login(data),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
    }) => api.register(data),
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(),
  });
};
