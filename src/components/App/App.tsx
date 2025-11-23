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
import css from './App.module.css';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const queryClient = useQueryClient();

  // Fetch notes з правильними опціями
  const { data, isLoading, isFetching, isError, isSuccess } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: queryClient.getQueryData(['notes', page - 1, debouncedSearch]),
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
  // "Updating..." тост
  if (isFetching && notes.length > 0) {
    toast.loading('Updating...', { id: 'fetch' });
  } else {
    toast.dismiss('fetch');
  }

  // "No notes found" тост
  if (isSuccess && notes.length === 0 && debouncedSearch) {
    toast('No notes found for your request.');
  }
}, [isFetching, isSuccess, notes.length, debouncedSearch]);



  const handleCreate = async (values: { title: string; content?: string; tag: string }) => {
    try {
      await createNote(values);
      toast.success('Note created!');
      setModalOpen(false);
      setPage(1);
      await queryClient.invalidateQueries({ queryKey: ['notes'], exact: false });
    } catch (err) {
      console.error(err);
      toast.error('Failed to create note');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      toast.success('Note deleted!');
      await queryClient.invalidateQueries({ queryKey: ['notes'], exact: false });
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete note');
    }
  };

  const noteListProps: any = { notes, onDelete: handleDelete };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />

      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {(isLoading || isFetching) && <Loader />}
        {isError && <ErrorMessage />}

        <NoteList {...noteListProps} />

        {totalPages > 1 && (
          <Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />
        )}

        {modalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <NoteForm {...({ onSubmit: handleCreate, onCancel: () => setModalOpen(false) } as any)} />
          </Modal>
        )}
      </main>
    </div>
  );
}
