import React, { useState, ChangeEvent } from 'react'
import styles from './reference-edit.module.css'
import ReferenceLabelEdit from './reference-label-edit'
import ReferenceCommentEdit from './reference-comment-edit'
import { useReferences } from './reference-provider'
import { ILabel, IComment, IReference } from '../interfaces'
import { v4 as uuidv4 } from 'uuid'
import FileUploadButton from './file-upload-button'
import SourceFileCard from './source-file-card'
import ReferenceAuthorEdit from './reference-author-edit'

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
    handleSourceFileUpload
  } = useReferences()

  console.log("selectedReference", selectedReference)
  const [loading, setLoading] = useState(false)

  if (selectedReference === undefined) {
    return null
  }

  function handleSourceFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    handleSourceFileUpload(file, selectedReference)
  }

  function handleChange(changes: object){
    const payload = {...selectedReference, ...changes}
    selectedReference && handleReferenceChange(payload)
    setSelectedReference(payload)
  }

  function handleLabelChange(label: ILabel) {
    if (selectedReference !== undefined) {
      const newLabels = [...selectedReference.labels]
      const index = newLabels.findIndex(i =>(JSON.parse(i)).id === label.id)
      newLabels[index] = JSON.stringify(label)
      handleChange({ labels: newLabels })
    }
  }

  const handleLabelAdd = () =>  {
    const newLabel = {
      id: uuidv4(),
      name: 'new label',
      color: 'red',
    }
    handleChange({ labels: [...selectedReference.labels, JSON.stringify(newLabel)]})
  }

  const handleLabelDelete = (id: string) => {
    const index = selectedReference.labels.findIndex((label: any) =>(JSON.parse(label)).id === id)
    handleChange({
      labels: selectedReference.labels.filter((_ : any, i: number) => i !== index)
    })
  }

  function handleCommentChange(comment: IComment) {
    if (selectedReference !== undefined) {
      const newComments = [...selectedReference.comments]
      const index = newComments.findIndex(i => (JSON.parse(i)).id === comment.id)
      newComments[index] = JSON.stringify(comment)
      handleChange({ comments: newComments })
    }
  }

  const handleCommentAdd = () => {
    const newComment = {
      id: uuidv4(),
      user: 'cindy',
      content: ''
    }
    handleChange({ comments: [...selectedReference.comments, JSON.stringify(newComment)]})
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

  const handleAuthorAdd = () => {
   const newAuthor = {
      id: uuidv4(),
      name: 'new author',
      first: ''
    }
    handleChange({ authors: [...selectedReference.authors, JSON.stringify(newAuthor)]})
  }

  function handleAuthorChange(author: any) {
    if (selectedReference !== undefined) {
      const newAuthors = [...selectedReference.authors]
      const index = newAuthors.findIndex(i => (JSON.parse(i)).id === author.id)
      newAuthors[index] = JSON.stringify(author)
      handleChange({ authors: newAuthors })
    }
  }

  function handleAuthorDelete(id: any) {
    let obj

    typeof(selectedReference.authors) === 'object' ?
      obj  = selectedReference.authors
      :
      obj = JSON.parse(selectedReference.authors)

    handleChange({
      authors: obj.filter((author: string) => JSON.parse(author).id !== id)
    })
  }

  function getYearFromPublicationDate() {
    let year
    let array = selectedReference.publication_date.split(' ')
    switch (array.length) {
      case 0:
        year = 'YYYY'
        break
      case 1:
        year = array[0]
        break
      case 2:
        year = array[1]
        break
      case 3:
        year = array[2]
        break
      default:
        year = 'YYYY'
        break
    }
    return year
  }

  function potatoName() {
    let last

    selectedReference.authors.map((author, index) => {
      let data = JSON.parse(author)
      if (JSON.parse(author).first === 'true'){
        last = data.name.split(' ')[1]
      }
    })
    let year = getYearFromPublicationDate()
    let number = selectedReference.authors.length

    let potatoName
    switch (number) {
      case 0:
        potatoName = `Anonymous ${year}`
        break
      case 1:
        potatoName = `${last} ${year}`
        break
      case 2:
        potatoName = `${last} and ${JSON.parse(selectedReference.authors[1]).name.split(' ')[1]} ${year}`
        break
      default:
        potatoName = `${last} et al. ${year}`
        break
    }
    return potatoName
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
        <div>
          UUID
        </div>
        <div>
          {selectedReference.id}
        </div>
        <label
          htmlFor="name"
          className={styles.label}
        >
          Name
        </label>
        <div>
          {potatoName()}
        </div>
        {/* <input
          type="text"
          name="name"
          id="name"
          autoComplete="off"
          value={selectedReference.name}
          onChange={e => handleChange({ name: e.target.value })}
          className={styles.input} /> */}
         <label
          htmlFor="name"
          className={styles.label}
        >
          References
        </label>
        <textarea
          name="name"
          id="name"
          value={selectedReference.name}
          onChange={e => handleChange({ name: e.target.value })}
          className={styles.input}
          spellCheck="false" />
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
          htmlFor="parent"
          className={styles.label}
        >
          Publication date
        </label>
        <input
          type="text"
          name="parent"
          id="parent"
          autoComplete="off"
          value={selectedReference.publication_date}
          onChange={e => handleChange({ publication_date: e.target.value })}
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
      <div className={styles.authorsContainer}>
        <label htmlFor="authors" className={styles.label}/>
        <div className={styles.buttonContainer}>
          <button
            className="btn btn--secondary"
            onClick={handleAuthorAdd}
          >
            + Add author
          </button>
        </div>
        <div className={styles.labelGrid}>
          <div>
            Name
          </div>
          <div>
            First author?
          </div>
          <div></div>
          {selectedReference.authors.map((author: any) => (
            <ReferenceAuthorEdit
              handleAuthorChange={handleAuthorChange}
              handleAuthorDelete={handleAuthorDelete}
              author={JSON.parse(author)}
              key={JSON.parse(author).id}
            />
          ))}
        </div>
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
              comment={JSON.parse(comment)}
            />
          ))}
        </div>
      </div>
      <div className={styles.sourceFileContainer}>
        <label htmlFor="sourceFile" className={styles.label}/>
        <div className={styles.buttonContainer}>
          <button
            className="btn btn--secondary"
          >
          <FileUploadButton
            onUpload= {handleSourceFileChange}
            loading = {loading}
            sourceUrl = {selectedReference.source_url}
          />
          </button>
        </div>
        <SourceFileCard
          selectedReference={selectedReference}
        />
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

  )
}
