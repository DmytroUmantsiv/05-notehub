import type { ChangeEvent } from 'react'
import css from './SearchBox.module.css'

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      type="text"
      placeholder="Search notes"
      className={css.input}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  )
}
