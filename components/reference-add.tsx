import React, { useRef, ChangeEvent, useState, useEffect } from 'react'
import styles from './reference-add.module.css'
import { useReferences } from './reference-provider'
import FileUploadButton from './file-upload-button'
import { v4 as uuidv4 } from 'uuid'

export default function ReferenceAdd() {
  const {
    showReferenceAdd,
    handleReferenceAdd,
    handleShowReferenceAdd,
    handleSourceFileUpload,
    session,
  } = useReferences()

  const nameRef = useRef<HTMLInputElement>(null)
  const parentRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const id = uuidv4()

  const [fileId, setFileId] = useState(uuidv4())
  const [file, setFile] = useState<File>()
  const [sourceUrl, setSourceUrl] = useState('')

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setSourceUrl(`${session?.user.id}/${id}/${fileId}.pdf`)
  }, [session, fileId])

  function handleSourceFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setFile(file)
    const fileId = uuidv4()
    setFileId(fileId)
    // handleSourceFileUpload(file, fileId)
  }

  function handleSaveReference(){
    const date = new Date()
    const myDate = (date.toLocaleString('default', { month: 'short'})) + " " + date.getUTCDate()

    // console.log('file', file)
    // if (file) {
    //   const fileExt = file.name.split('.').pop()
    //   const newFile =`${id}/${fileId}`
    //   const sourceUrl = `${session?.user.id}/${newFile}.${fileExt}`
    //   setSourceUrl(sourceUrl)
    // }

    console.log('file', file)

    const newReference = {
      id: id,
      source_url: file != undefined ? sourceUrl : '',
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
            <button className="btn btn--secondary">
              {/* <FileUploadButton
                onUpload={handleSourceFileChange}
                loading={loading}
                sourceUrl={file !== undefined ? sourceUrl: ''}
              /> */}
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
