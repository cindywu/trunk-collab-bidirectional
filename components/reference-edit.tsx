import React, { useState } from 'react'
import styles from './reference-edit.module.css'
import ReferenceLabelEdit from './reference-label-edit'
import ReferenceCommentEdit from './reference-comment-edit'
import { useReferences } from './reference-provider'
import { ILabel, IComment, IReference } from '../interfaces'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  selectedReference: IReference,
  setSelectedReference: (reference: IReference) => void,
}


export default function ReferenceEdit({ selectedReference, setSelectedReference }: Props) {
  const {
    handleReferenceArchive,
    handleReferenceDeselect,
    handleReferenceChange,
    handleReferenceExpandChange,
    expandSelectedReference,
  } = useReferences()

  if (selectedReference === undefined) {
    return null
  }

  function handleChange(changes: object){
    const payload = {...selectedReference, ...changes}
    selectedReference && handleReferenceChange(payload)
    setSelectedReference(payload)
  }

  function handleLabelChange(id: string, label: ILabel) {
    if (selectedReference !== undefined) {
      const newLabels = [...selectedReference.labels]
      const index = newLabels.findIndex(i => i.id === id)
      newLabels[index] = label
      handleChange({ labels: newLabels })
    }
  }

  const handleLabelAdd = () =>  {
    const newLabel = {
      id: uuidv4(),
      name: 'new label',
      color: 'red',
    }
    handleChange({ labels: [...selectedReference.labels, newLabel]})
  }

  const handleLabelDelete = (id: string) => {
    handleChange({
      labels: selectedReference.labels.filter((label: ILabel) => label.id !== id)
    })
  }

  function handleCommentChange(id: string, comment: IComment) {
    if (selectedReference !== undefined) {
      const newComments = [...selectedReference.comments]
      const index = newComments.findIndex(i => i.id === id)
      newComments[index] = comment
      handleChange({ comments: newComments })
    }

  }

  const handleCommentAdd = () => {
    const newComment = {
      id: uuidv4(),
      user: 'cindy',
      content: ''
    }
    handleChange({ comments: [...selectedReference.comments, newComment]})
  }

  const handleCommentDelete = (id: string) => {
    let obj

    typeof(selectedReference.comments) === 'object' ?
      obj  = selectedReference.comments
      :
      obj = JSON.parse(selectedReference.comments)

    handleChange({
      comments: obj.filter((comment: string) => JSON.parse(comment).id !== id)
    })
  }

  function handleSourceFileAdd() {
    console.log('I am in handleSourceFileAdd')
  }

  return (
    selectedReference &&
    <div className={styles.container}>
      <div className={styles.navigationButtonContainer}>
        {!expandSelectedReference &&
          <button
            className="btn btn--secondary"
            onClick={handleReferenceExpandChange}
          >
            Expand
          </button>
        }
        <button
          className="btn btn--secondary"
          onClick={handleReferenceDeselect}
        >
          &times;
        </button>
      </div>
      <div className={styles.detailsGrid}>
        <label
          htmlFor="name"
          className={styles.label}
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          autoComplete="off"
          value={selectedReference.name}
          onChange={e => handleChange({ name: e.target.value })}
          className={styles.input} />
        <label
          htmlFor="parent"
          className={styles.label}
        >
          Parent
        </label>
        <input
          type="text"
          name="parent"
          id="parent"
          autoComplete="off"
          value={selectedReference.parent}
          onChange={e => handleChange({ parent: e.target.value })}
          className={styles.input} />
        <label
          htmlFor="date"
          className={styles.label}>
          Date
        </label>
        <input
          type="text"
          name="date"
          id="date"
          autoComplete="off"
          value={selectedReference.date}
          onChange={e => handleChange({ date: e.target.value })}
          className={styles.input} />
        <label
          htmlFor="description"
          className={styles.label}>
          Description
        </label>
        <textarea
          name="description"
          id="description"
          onChange={e => handleChange({ description: e.target.value })}
          value={selectedReference.description}
          className={styles.input} />
      </div>
      <div className={styles.labelContainer}>
        <label htmlFor="labels" className={styles.label}/>

        <div className={styles.buttonContainer}>
          <button
            className="btn btn--secondary"
            onClick={handleLabelAdd}
          >
            + Add label
          </button>
        </div>
        <div className={styles.labelGrid}>
          <div>
            Name
          </div>
          <div>
            Color
          </div>
          <div></div>
          {selectedReference.labels.map((label: any) => (
            <ReferenceLabelEdit
              handleLabelChange={handleLabelChange}
              handleLabelDelete={handleLabelDelete}
              label={JSON.parse(label)}
              key={JSON.parse(label).id}
            />
          ))}
        </div>
        <div className={styles.commentsContainer}>
          <label htmlFor="comments" className={styles.label}/>
          <div className={styles.buttonContainer}>
            <button
              className="btn btn--secondary"
              onClick={handleCommentAdd}
            >
              + Add comment
            </button>
          </div>
          <div className={styles.commentGrid}>
            <div>User</div>
            <div>Content</div>
            <div></div>
            {selectedReference.comments.map((comment: any) => (
              <ReferenceCommentEdit
                key={JSON.parse(comment).id}
                handleCommentChange={handleCommentChange}
                handleCommentDelete={handleCommentDelete}
                selectedReference={selectedReference}
                comment={comment}
              />
            ))}
          </div>
        </div>
        <div className={styles.sourceFileContainer}>
          <label htmlFor="sourceFile" className={styles.label}/>
          <div className={styles.buttonContainer}>
            <button
              className="btn btn--secondary"
              onClick={handleSourceFileAdd}
            >
           + Add source file
           </button>
          </div>
          <div>
            No source file
          </div>

        </div>
        <div className={styles.archiveContainer}>
          <label htmlFor="archiveReference" className={styles.label}/>
          <div
            className={styles.lastButtonContainer}
          >
            <button
              className="btn btn--secondary"
              onClick={() => handleReferenceArchive(selectedReference.id)}
            >
              Archive reference
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
