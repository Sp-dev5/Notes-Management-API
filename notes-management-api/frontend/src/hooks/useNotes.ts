import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import { Note } from '../utils/types';

export const useNotes = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['notes', page, limit],
    queryFn: () => api.getNotes(page, limit),
  });
};

export const useSearchNotes = (query: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['notes', 'search', query, page, limit],
    queryFn: () => api.searchNotes(query, page, limit),
    enabled: !!query,
  });
};

export const useNoteById = (id: string) => {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: () => api.getNoteById(id),
    enabled: !!id,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      api.createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useUpdateNote = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title?: string; content?: string }) =>
      api.updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', id] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
