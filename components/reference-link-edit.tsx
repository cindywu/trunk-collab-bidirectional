import React from 'react'
import styles from './reference-edit.module.css'
import type { ILink} from '../interfaces'

type Props = {
  link: ILink
  handleLinkChange: (link: ILink) => void
  handleLinkDelete: (id: string) => void
}

export default function ReferenceLinkEdit(props : Props) {
  const {
    link,
    handleLinkChange,
    handleLinkDelete
  } = props

  function handleChange(changes: object) {
    handleLinkChange({ ...link, ...changes})
  }

  return (
    <>
      <input
        className={styles.input}
        type="text"
        autoComplete="none"
        onChange={(e) => handleChange({ reference_id: e.target.value.trim() })}
        value={link.reference_id}
      />
      <input
        className={styles.input}
        type="text"
        autoComplete="none"
        onChange={(e) => handleChange({ type: e.target.value })}
        value={link.type}
      />
      <button
        className="btn btn--danger btn--wide"
        onClick={() => handleLinkDelete(link.id)}
      >
        &times;
      </button>
    </>
  )
}
