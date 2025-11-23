import { api } from '../../utils/axios'
import type { Note } from '../types/note'
import type { AxiosResponse } from 'axios'


export interface FetchNotesParams {
page?: number
perPage?: number
search?: string
}


export interface FetchNotesResponse {
data: Note[]
total: number
page: number
perPage: number
}


export async function fetchNotes({ page = 1, perPage = 12, search = '' }: FetchNotesParams): Promise<FetchNotesResponse> {
const params: Record<string, string | number> = { page, perPage }
if (search) params.search = search


const resp: AxiosResponse = await api.get('/notes', { params })
return resp.data as FetchNotesResponse
}


export async function createNote(payload: { title: string; content?: string; tag: string }): Promise<Note> {
const resp: AxiosResponse = await api.post('/notes', payload)
return resp.data as Note
}


export async function deleteNote(id: string): Promise<{ _id: string }>
{
const resp: AxiosResponse = await api.delete(`/notes/${id}`)
return resp.data
}