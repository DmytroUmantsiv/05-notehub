import toast from "react-hot-toast";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  async function handleAction(formData: FormData) {
    const query = String(formData.get("query") || "").trim();

    if (!query) {
      toast.error("Please enter your search query.");
      return;
    }

    onSearch(query);
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Powered by TMDB
        </a>

        <form action={handleAction} className={styles.form}>
          <input
            type="text"
            name="query"
            placeholder="Search movies…"
            autoComplete="off"
            className={styles.input}
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
