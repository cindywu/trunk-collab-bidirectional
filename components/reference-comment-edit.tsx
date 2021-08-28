import React from 'react'
import styles from './reference-edit.module.css'
import { IComment } from '../interfaces'

type Props = {
  comment: IComment
  handleCommentChange: (id: string, comment: IComment) => void
  handleCommentDelete: (id: string) => void
  selectedReference: any
}

export default function ReferenceCommentEdit(props : Props) {
  const {
    comment,
    handleCommentChange,
    handleCommentDelete
  } = props

  let obj: { user: string; content: string; id: string }

  typeof(comment) === 'object' ?
    obj = comment
    :
    obj = JSON.parse(comment)

  function handleChange(changes: object) {
    handleCommentChange(comment.id, { ...comment, ...changes})
  }

  return (
    <>
      <input
        className={styles.input}
        type="text"
        autoComplete="none"
        onChange={(e) => handleChange({ name: e.target.value })}
        value={obj.user}
      />
      <input
        className={styles.input}
        type="text"
        autoComplete="none"
        onChange={(e) => handleChange({ content: e.target.value })}
        value={obj.content}
      />
      <button
        className="btn btn--danger"
        onClick={() => handleCommentDelete(obj.id)}
      >
        &times;
      </button>
    </>
  )
}
