import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Movie } from '../../types/movie'
import styles from './MovieModal.module.css'
import { getImageUrl } from '../../services/movieService'

interface MovieModalProps {
  movie: Movie
  onClose: () => void
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKey)

    
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = document.body.style.overflow
    const prevPaddingRight = document.body.style.paddingRight

    
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollBarWidth}px`

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPaddingRight
    }
  }, [onClose])

  function onBackdropClick(e: React.MouseEvent) {
    if (e.currentTarget === e.target) onClose()
  }

  const portalRoot = document.getElementById('modal-root') || document.body
  const backdropUrl = getImageUrl(movie.backdrop_path, 'original')

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onBackdropClick}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>

        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={movie.title}
            className={styles.image}
          />
        )}

        <div className={styles.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    portalRoot
  )
}
