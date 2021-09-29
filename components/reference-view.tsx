import React from 'react'
import CommentList from './comment-list'
import CommentForm from './comment-form'
import styles from './reference-view.module.css'
import type { IReference } from '../interfaces'

type Props = {
  selectedReference: IReference
}

export default function ReferenceView({ selectedReference }: Props) {
  function handleSourceFileAdd(){
    console.log('i am in handleSourceFileAdd')
  }

  return (
    <div className={styles.container} key={selectedReference.id}>
      <div className={styles.name}>{selectedReference.name}</div>
      <div className={styles.description}>{selectedReference.description}</div>
      {/* <div className={styles.buttonContainer}>
        <button className={`${styles.subReferenceButton} btn btn-secondary`}>+ Add sub-references</button>
      </div> */}
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.subReferenceButton} btn btn-secondary`}
          onClick={handleSourceFileAdd}
        >
          + Add source file
        </button>
      </div>
      <div>
        No source file
      </div>
      <CommentList selectedReference={selectedReference}/>
      <CommentForm selectedReference={selectedReference}/>
    </div>
  )
}
