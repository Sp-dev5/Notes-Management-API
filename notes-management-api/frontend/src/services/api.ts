import { apiClient, setAuthToken } from '../utils/api';
import { User, AuthResponse, Note, NotesResponse } from '../utils/types';

export async function register(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await apiClient.post('/auth/register', data);
  setAuthToken(response.data.data.token);
  return response.data.data;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await apiClient.post('/auth/login', data);
  setAuthToken(response.data.data.token);
  return response.data.data;
}

export async function getProfile(): Promise<User> {
  const response = await apiClient.get('/auth/profile');
  return response.data.data;
}

export async function createNote(data: {
  title: string;
  content: string;
}): Promise<Note> {
  const response = await apiClient.post('/notes', data);
  return response.data.data;
}

export async function getNotes(page = 1, limit = 10): Promise<NotesResponse> {
  const response = await apiClient.get('/notes', {
    params: { page, limit },
  });
  return response.data.data;
}

export async function getNoteById(id: string): Promise<Note> {
  const response = await apiClient.get(`/notes/${id}`);
  return response.data.data;
}

export async function updateNote(
  id: string,
  data: { title?: string; content?: string }
): Promise<Note> {
  const response = await apiClient.put(`/notes/${id}`, data);
  return response.data.data;
}

export async function deleteNote(id: string): Promise<void> {
  await apiClient.delete(`/notes/${id}`);
}

export async function searchNotes(
  query: string,
  page = 1,
  limit = 10
): Promise<NotesResponse> {
  const response = await apiClient.get('/notes/search', {
    params: { q: query, page, limit },
  });
  return response.data.data;
}
