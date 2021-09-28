import React from 'react'
import Comment from './comment'
import styles from './comment-list.module.css'
import type { IReference, IComment } from '../interfaces'

type Props = {
  selectedReference: IReference
}

export default function CommentList({ selectedReference } : Props) {

  const { comments } = Object(selectedReference)

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Discussion</div>
      {comments.map((comment: IComment) => {
        let obj

        typeof(comment) === 'object' ?
          obj = comment
          :
          obj = JSON.parse(comment)

        return (
          <Comment
            key={obj.id}
            {...obj}
          />
        )
      })}
    </div>
  )
}
