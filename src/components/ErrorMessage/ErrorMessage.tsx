import css from './ErrorMessage.module.css'

export default function ErrorMessage() {
  return (
    <div className={css.error}>Something went wrong. Please try again later.</div>
  )
}
