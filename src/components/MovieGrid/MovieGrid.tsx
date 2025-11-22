import type { Movie } from '../../types/movie'
import styles from './MovieGrid.module.css'
import { getImageUrl } from '../../services/movieService'

interface MovieGridProps {
  movies: Movie[]
  onSelect: (movie: Movie) => void
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (!movies || movies.length === 0) return null

  return (
    <ul className={styles.grid}>
      {movies.map(movie => {
        const posterUrl = getImageUrl(movie.poster_path, 'w500')
        return (
          <li key={movie.id}>
            <div
              className={styles.card}
              onClick={() => onSelect(movie)}
              role="button"
              tabIndex={0}
            >
              {posterUrl ? (
                <img
                  className={styles.image}
                  src={posterUrl}
                  alt={movie.title}
                  loading="lazy"
                />
              ) : (
                <div className={styles.placeholder}>No image</div>
              )}
              <h2 className={styles.title}>{movie.title}</h2>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
