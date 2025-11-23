import { api } from '../../utils/axios';
import type { AxiosResponse } from 'axios';
import type { Note } from '../types/note';

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  data: Note[];
  total: number;
  page: number;
  perPage: number;
}

 
export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = '',
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const resp: AxiosResponse = await api.get('/notes', { params });
 
  const notes: Note[] = resp.data.notes.map((note: Note & { id: string }) => ({
    ...note,
    _id: note.id,
  }));

  return {
    data: notes,
    total: resp.data.totalPages,
    page: page,
    perPage: perPage,
  };
}

export async function createNote(payload: {
  title: string;
  content?: string;
  tag: string;
}): Promise<Note> {
  const resp: AxiosResponse = await api.post('/notes', payload);
  const note: Note & { id: string } = resp.data;
  return { ...note, _id: note.id };
}

 
export async function deleteNote(id: string): Promise<{ _id: string }> {
  const resp: AxiosResponse = await api.delete(`/notes/${id}`);
  return { _id: resp.data.id };
}
