import React from 'react'
import styles from './reference-edit.module.css'
import type { IAuthor } from '../interfaces'

type Props = {
  author: IAuthor
  handleAuthorChange: (author: IAuthor) => void
  handleAuthorDelete: (id: string) => void
}

export default function ReferenceAuthorEdit(props: Props) {
  const {
    author,
    handleAuthorChange,
    handleAuthorDelete
  } = props

  function handleChange(changes: object) {
    console.log('changes', changes)
    handleAuthorChange({ ...author, ...changes})
  }

  return (
    <>
      <input
        className={styles.input}
        type="text"
        autoComplete="none"
        onChange={(e) => handleChange({ name: e.target.value })}
        value={author.name}
      />
      <input
        className={styles.input}
        type="text"
        autoComplete="none"
        onChange={(e) => handleChange({ first: e.target.value })}
        value={author.first}
      />
      <button
        className="btn btn--danger btn--wide"
        onClick={() => handleAuthorDelete(author.id)}
      >
        &times;
      </button>
    </>
  )
}
