import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ReactPaginate from "react-paginate";
import { Toaster, toast } from "react-hot-toast";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import styles from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Movie | null>(null);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.length > 0,
    placeholderData: (prev) => prev,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

 useEffect(() => {
  if (isFetching && movies.length > 0) {
    toast.loading("Updating...", { id: "fetch" });
  } else {
    toast.dismiss("fetch");
  }

  if (isSuccess && movies.length === 0) {
    toast("No movies found for your request.", { id: "no-movies" });
  } else {
    toast.dismiss("no-movies");
  }
}, [isFetching, isSuccess, movies.length]);


  function handleSearch(newQuery: string) {
    setQuery(newQuery);
    setPage(1);
  }

  return (
    <div>
      <Toaster position="top-center" />

      <SearchBar onSearch={handleSearch} />
      

      <main>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}

        {!isLoading && !isError && movies.length > 0 && (
          <>
            <MovieGrid movies={movies} onSelect={setSelected} />

            {totalPages > 1 && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected }) => setPage(selected + 1)}
                forcePage={page - 1}
                containerClassName={styles.pagination}
                activeClassName={styles.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}
          </>
        )}

        {selected && (
          <MovieModal movie={selected} onClose={() => setSelected(null)} />
        )}
      </main>
    </div>
  );
}
