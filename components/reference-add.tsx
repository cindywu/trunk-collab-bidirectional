import React, { useRef, ChangeEvent, useState, useEffect } from 'react'
import styles from './reference-add.module.css'
import { useReferences } from './reference-provider'
import FileUploadButton from './file-upload-button'
import { v4 as uuidv4 } from 'uuid'
import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from '../lib/constants'
import { AuthSession } from '@supabase/supabase-js'
import ReferenceAddSourceFileCard from './reference-add-source-file-card'

export default function ReferenceAdd() {
  const {
    showReferenceAdd,
    handleReferenceAdd,
    handleShowReferenceAdd,
    handleDraftSourceFileUpload,
  } = useReferences()

  const nameRef = useRef<HTMLInputElement>(null)
  const parentRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLTextAreaElement>(null)

  const [draftFileId, setDraftFileId] = useState<string>()
  const [draftRefId, setDraftRefId] = useState<string>()
  const [file, setFile] = useState<File>()
  const [sourceUrl, setSourceUrl] = useState('')
  const [session, setSession] = useState<AuthSession | null>()
  const [draftReference, setDraftReference] = useState<any>()

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const session = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
    setSession(session ? JSON.parse(session).currentSession : null)
    const date = new Date()
    const myDate = (date.toLocaleString('default', { month: 'short'})) + " " + date.getUTCDate()
    const newReference = {
      id: uuidv4(),
      links: [
        {
          id: uuidv4(),
          reference_id: '',
          type: 'standard',
        }
      ],
      publication_date: 'May 2 2019',
      authors: [
        {
          id: uuidv4(),
          name: '',
          first: 'true',
        }
      ],
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
    setDraftReference(newReference)
  },[])

  function handleSourceFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setFile(file)
    const draftFileId = uuidv4()
    setDraftFileId(draftFileId)
    const draftRefId = uuidv4()
    setDraftRefId(draftRefId)
    const userId = session?.user.id

    const sourceUrl = `${userId}/${draftRefId}/${draftFileId}.pdf`
    setDraftReference({...draftReference, source_url: sourceUrl})
    handleDraftSourceFileUpload(file, sourceUrl)
  }

  function handleSaveReference(){
    const date = new Date()
    const myDate = (date.toLocaleString('default', { month: 'short'})) + " " + date.getUTCDate()

    const changes = {
      name: nameRef.current ? nameRef.current.value : '',
      parent: parentRef.current ? parentRef.current.value : '',
      description: titleRef.current ? titleRef.current.value : '',
      date: myDate,
    }

    const newReference = {...draftReference, ...changes}

    setDraftReference(newReference)

    handleReferenceAdd(newReference)

    const brandNewReference = {
      id: uuidv4(),
      links: [
        {
          id: uuidv4(),
          reference_id: '',
          type: 'standard',
        }
      ],
      publication_date: 'May 2 2019',
      authors: [
        {
          id: uuidv4(),
          name: '',
          first: 'true',
        }
      ],
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
    setDraftReference(brandNewReference)
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
           {file
              ?
                <div>
                  <ReferenceAddSourceFileCard
                    draftReference={draftReference}
                    onUpload={handleSourceFileChange}
                    loading={loading}
                  />
                </div>
              :
                <FileUploadButton
                  onUpload={handleSourceFileChange}
                  loading={loading}
                  sourceUrl={''}
                />
              }

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
