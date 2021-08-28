import React , { useRef, useEffect, useState } from 'react'
import styles from './comment-form.module.css'
import { useReferences } from './reference-provider'
import { v4 as uuidv4 } from 'uuid'
import { AuthSession } from '@supabase/supabase-js'

export default function CommentForm({selectedReference} : any) {
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [session, setSession] = useState(null)

  const LOCAL_STORAGE_KEY = 'supabase.auth.token'

  const { handleReferenceChange } = useReferences()

  useEffect(() => {
    const session = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (session != null) (
      setSession(JSON.parse(session).currentSession)
    )
  }, [])

  function handleChange(changes: object) {
    selectedReference && handleReferenceChange({ ...selectedReference, ...changes })
  }

  function handleCommentAdd() {
    let email

    if (session !== null) {
      const { user } = session
      email = user.email
    } else {
      email = 'cindy'
    }

    const newComment = {
      id: uuidv4(),
      user: email,
      content: contentRef.current && contentRef.current.value,
    }
    selectedReference && handleChange({ comments: [...selectedReference.comments, newComment]})
    contentRef.current && (contentRef.current.value = '')
  }

  return (
    <div className={styles.container}>
      <div className={styles.timeline}>
        <div className={styles.userAvatar}></div>
      </div>
      <div className={styles.comment}>
        <form
          className={styles.form}
        >
          <textarea
            className={styles.textArea}
            placeholder="What's on your mind..."
            ref={contentRef}
            required
          />
        </form>
        <div className={styles.submitButtonContainer}>
          <button
            className={` ${styles.submitButton} btn btn--primary`}
            onClick={handleCommentAdd}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  )
}
