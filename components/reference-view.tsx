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

  function potatoName() {
    let last

    selectedReference.authors.map((author, index) => {
      let data = JSON.parse(author)
      if (JSON.parse(author).first === 'true'){
        last = data.name.split(' ')[1]
      }
    })
    let year = '2012'
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
    <div className={styles.container} key={selectedReference.id}>
      <div className={styles.uuid}>{selectedReference.id}</div>
      {/* <div className={styles.name}>{selectedReference.name}</div> */}
      <div className={styles.name}>{potatoName()}</div>
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
