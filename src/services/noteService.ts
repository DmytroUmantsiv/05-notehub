import { api } from '../../utils/axios';
import type { AxiosResponse } from 'axios';
import type { Note } from '../types/note';

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

 
export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = '',
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const resp: AxiosResponse<FetchNotesResponse> = await api.get('/notes', {
    params,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
  });

  return resp.data;
}
 
export async function createNote(payload: {
  title: string;
  content?: string;
  tag: string;
}): Promise<Note> {
  const resp: AxiosResponse<Note> = await api.post('/notes', payload, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
  });
  return resp.data;
}

 
export async function deleteNote(id: string): Promise<Note> {
  const resp: AxiosResponse<Note> = await api.delete(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
  });
  return resp.data;
}
