import React, { useState, ChangeEvent, useEffect} from 'react'
import CommentList from './comment-list'
import CommentForm from './comment-form'
import SourceFileCard from './source-file-card'
import { useReferences } from './reference-provider'
import FileUploadButton from './file-upload-button'
import styles from './reference-view.module.css'
import type { IReference } from '../interfaces'
import Reference from './reference'

type Props = {
  selectedReference: IReference
  references: any
}

export default function ReferenceView({ selectedReference, references}: Props) {
  const [loading, setLoading] = useState(false)
  const { handleSourceFileUpload } = useReferences()
  const [hideLinks, setHideLinks] = useState(true)
  const [links, setLinks] = useState<any>()

  useEffect(() => {
    getLinks()
  }, [])

  function getLinks() {
    let links = []
    selectedReference && selectedReference.links.map(link => {
      const index = references.findIndex((reference) =>
        JSON.parse(link).reference_id === reference[0].substring(4)
      )
      if (index !== -1) {
        links.push(references[index])
      }
    })
    setLinks(links)
  }


  function handleSourceFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    handleSourceFileUpload(file, selectedReference)
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

  function handleSubReferenceAdd() {
    console.log('handleSubReferenceAdd')
  }

  return (
    <div className={styles.container} key={selectedReference.id}>
      <div className={styles.uuid}>{selectedReference.id}</div>
      {/* <div className={styles.name}>{selectedReference.name}</div> */}
      <div className={styles.name}>{potatoName()}</div>
      <div className={styles.description}>{selectedReference.description}</div>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.subReferenceButton} btn btn-secondary`}
          onClick={handleSubReferenceAdd}
        >
          + Add sub-references
        </button>
      </div>
      <div onClick={() => setHideLinks(!hideLinks)}>
        {links && links.length} links
      </div>
      <div>
        {!hideLinks && links.map((link) =>
          <div>
            <Reference
              key={link[0]}
              id={link[0]}
              value={link[1]}
              selectedReference={selectedReference}
              references={references}
            />
          </div>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.subReferenceButton} btn btn-secondary`}
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
      <CommentList selectedReference={selectedReference}/>
      <CommentForm selectedReference={selectedReference}/>
    </div>
  )
}
