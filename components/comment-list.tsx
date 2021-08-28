import React from 'react'
import Comment from './comment'
import styles from './comment-list.module.css'

export default function CommentList({selectedReference}: any) {

  const { comments } = Object(selectedReference)

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Discussion</div>
      {comments.map((comment: any) => {
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
