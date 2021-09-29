import React, { useState, ChangeEvent} from 'react'
import CommentList from './comment-list'
import CommentForm from './comment-form'
import SourceFileCard from './source-file-card'
import { useReferences } from './reference-provider'
import FileUploadButton from './file-upload-button'
import styles from './reference-view.module.css'
import type { IReference } from '../interfaces'

type Props = {
  selectedReference: IReference
}

export default function ReferenceView({ selectedReference }: Props) {
  const [loading, setLoading] = useState(false)
  const { handleSourceFileUpload } = useReferences()

  function handleSourceFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    handleSourceFileUpload(file, selectedReference)
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
        >
          <FileUploadButton
            onUpload= {handleSourceFileChange}
            loading = {loading}
            sourceUrl = {selectedReference.source_url} //fix this add selectedReference.sourceUrl
          />
        </button>
      </div>
      <SourceFileCard
        selectedReference={selectedReference}
      />
      <CommentList selectedReference={selectedReference}/>
      <CommentForm selectedReference={selectedReference}/>
    </div>
  )
}
