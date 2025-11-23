import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import NoteForm from '../NoteForm/NoteForm';
import Modal from '../Modal/Modal';
import Pagination from '../Pagination/Pagination';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import type { FetchNotesResponse } from '../../services/noteService';

import { fetchNotes, createNote, deleteNote } from '../../services/noteService';
import { useDebounce } from 'use-debounce';
import './App.module.css';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);
  const queryClient = useQueryClient();

  // -------------------------------
  // Fetch notes
  // -------------------------------
  const {
    data,
    error,
    isLoading,
    isFetching,
    isSuccess,
  } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch,
      }),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const notes = data?.data ?? [];
  const totalPages = data?.total ?? 1;

  // -------------------------------
  // Toasts
  // -------------------------------
  useEffect(() => {
    if (isFetching && notes.length > 0) {
      toast.loading('Updating...', { id: 'fetch' });
    } else {
      toast.dismiss('fetch');
    }

    if (isSuccess && notes.length === 0) {
      toast('No notes found for your request.');
    }
  }, [isFetching, isSuccess, notes.length]);

  // -------------------------------
  // Create note
  // -------------------------------
 async function handleCreate(values: { title: string; content?: string; tag: string }) {
  try {
    await createNote(values);
    toast.success('Note created!');
    setModalOpen(false);
    setPage(1);

    // Інвалідовуємо всі запити notes, щоб TanStack Query заново отримав дані
    queryClient.invalidateQueries({ queryKey: ['notes'] })
  } catch (err) {
    toast.error('Failed to create note');
  }
}


  // -------------------------------
  // Delete note
  // -------------------------------
  async function handleDelete(id: string) {
    try {
      await deleteNote(id);
      toast.success('Note deleted!');
      await queryClient.invalidateQueries({ queryKey: ['notes'], exact: false });
    } catch (err) {
      toast.error('Failed to delete note');
    }
  }

  return (
    <div className="app">
      <Toaster position="top-center" />

      <header className="toolbar">
        <SearchBox value={search} onChange={setSearch} />
        <button className="button" onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <Loader />}
        {error && <ErrorMessage />}

        {notes.length > 0 && <NoteList notes={notes} onDelete={handleDelete} />}

        {totalPages > 1 && (
          <Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />
        )}

        {modalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <NoteForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} />
          </Modal>
        )}
      </main>
    </div>
  );
}
