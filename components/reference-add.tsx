import React, { useRef } from 'react'
import styles from './reference-add.module.css'
import { useReferences } from './reference-provider'
import { v4 as uuidv4 } from 'uuid'

export default function ReferenceAdd() {
  const {
    showReferenceAdd,
    handleReferenceAdd,
    handleShowReferenceAdd
  } = useReferences()

  const nameRef = useRef<HTMLInputElement>(null)
  const parentRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLTextAreaElement>(null)

  function handleSaveReference(){
    const date = new Date()
    const myDate = (date.toLocaleString('default', { month: 'short'})) + " " + date.getUTCDate()

    const newReference = {
      id: uuidv4(),
      name: nameRef.current ? nameRef.current.value : '',
      parent: parentRef.current ? parentRef.current.value : '',
      date: myDate,
      description: titleRef.current ? titleRef.current.value : '',
      labels: [
        {
          id: uuidv4(),
          name: 'label',
          color: '#DB615D'
        }
      ],
      comments: [
        {
          id: uuidv4(),
          user: 'cindy',
          content: 'why are we reading this?'
        }
      ],
    }
    handleReferenceAdd(newReference)
  }

  function handleSourceFileAdd(){
    console.log('I am in handleSourceFileAdd')
  }

  return (
    <>
      {showReferenceAdd &&
        <div className={styles.container}>
          <div className={styles.buttonContainer}>
          <div className={styles.title}>
            {/* New reference */}
          </div>
          <div className={styles.buttonContainer}>
            <button className="btn btn--secondary">Expand</button>
            <button
              className="btn btn--secondary"
              onClick={handleShowReferenceAdd}
            >&times;</button>
          </div>
        </div>
        <div className={styles.detailsGrid}>
          <input
            type="text"
            autoComplete="off"
            name="name"
            id={styles.name}
            className={styles.input}
            placeholder="name"
            ref={nameRef}
          />
          <input
            type="text"
            autoComplete="off"
            name="parent"
            id="parent"
            className={styles.input}
            placeholder="parent"
            ref={parentRef}
          />
          <textarea
            name="description"
            id="description"
            className={styles.input}
            placeholder="title"
            ref={titleRef}
          />
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.left}>
            <button
              className="btn btn--secondary"
              onClick={handleSourceFileAdd}
            >
              + Add source file
            </button>
          </div>
          <div className={styles.right}>
            <button
              className="btn btn--primary"
              onClick={handleSaveReference}
            >
              Save Reference
            </button>
          </div>
        </div>
        </div>
      }
    </>
  )
}
