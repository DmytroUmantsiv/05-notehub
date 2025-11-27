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
import { fetchNotes} from '../../services/noteService';
import { useDebounce } from 'use-debounce';
import css from './App.module.css';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const queryClient = useQueryClient();

   
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

 
  const { data, isLoading, isFetching, isError, isSuccess } =
    useQuery<FetchNotesResponse, Error>({
      queryKey: ['notes', page, debouncedSearch],
      queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
      placeholderData: queryClient.getQueryData(['notes', page - 1, debouncedSearch]),
      staleTime: 60000,
      refetchOnWindowFocus: false,
    });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  
  useEffect(() => {
    if (isFetching && notes.length > 0) {
      toast.loading('Updating...', { id: 'fetch' });
    } else {
      toast.dismiss('fetch');
    }

    if (isSuccess && notes.length === 0 && debouncedSearch) {
      toast('No notes found for your request.');
    }
  }, [isFetching, isSuccess, notes.length, debouncedSearch]);

  return (
    <div className={css.app}>
      <Toaster position="top-center" />

      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {(isLoading || isFetching) && <Loader />}
        {isError && <ErrorMessage />}

        <NoteList notes={notes}/>

        {totalPages > 1 && (
          <Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />
        )}

        {modalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <NoteForm onCancel={() => setModalOpen(false)} />
          </Modal>
        )}
      </main>
    </div>
  );
}
