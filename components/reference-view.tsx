import React from 'react'
import CommentList from './comment-list'
import CommentForm from './comment-form'
import styles from './reference-view.module.css'

export default function ReferenceView({ references, selectedReference }: any) {
  return (
    <>
      {selectedReference && references.map(([k, v] : [any, any]) => {
        const id = k.substring(4)
        return (
          id === selectedReference.id &&
            <div className={styles.container} key={id}>
              <div className={styles.name}>{v.name}</div>
              <div className={styles.description}>{v.description}</div>
              <div className={styles.buttonContainer}>
                <button className={`${styles.subReferenceButton} btn btn-secondary`}>+ Add sub-references</button>
              </div>
              <CommentList selectedReference={v}/>
              <CommentForm selectedReference={v}/>
            </div>
        )
      })}
    </>
  )
}
