import React, { useEffect, useState} from 'react'
import { idbOK } from '../utils'
import styles from './reference-add-source-file-card.module.css'
import ReferenceAddFileUploadButton from './reference-add-file-upload-button'

type Props = {
  draftReference: any
  onUpload: any
  loading: boolean
}

export default function ReferenceAddSourceFileCard({ draftReference, onUpload, loading } : Props) {
  const [localUrl, setLocalUrl] = useState<string | null>(null)

  const { source_url } = draftReference

  useEffect(() => {
    generateSourceFileUrl()
  }, [source_url])

  function generateSourceFileUrl() {
    if (!idbOK()) return

    let openRequest = indexedDB.open('trunk_idb1', 1)

    openRequest.onupgradeneeded = function(event: any) {
      let thisDB = event.target.result

      if (!thisDB.objectStoreNames.contains('source-files')) {
        thisDB.createObjectStore('source-files', { keyPath: 'id' })
      }
    }

    openRequest.onsuccess = function(event: any) {
      let db = event.target.result
      let tx = db.transaction(['source-files'], 'readonly')
      let store = tx.objectStore('source-files')

      let request = store.get(source_url)

      request.onerror = function(event: any) {
        console.log('error', event.target.error.name)
      }

      request.onsuccess = function(event: any){
        let result = event.target.result
        result && setLocalUrl(URL.createObjectURL(result.file))
      }

      request.onerror = function(event: any) {
        console.dir(event)
      }
    }

    openRequest.onerror = function(event: any) {
      console.dir(event)
    }
  }

  function handleSourceFileDelete() {
    if (!idbOK()) return
    let openRequest = indexedDB.open('trunk_idb1', 1)

    openRequest.onupgradeneeded = function(event: any) {
      let thisDB = event.target.result

      if (!thisDB.objectStoreNames.contains('source-files')) {
        thisDB.createObjectStore('source-files', { keyPath: 'id' })
      }
    }

    openRequest.onsuccess = function(event: any) {
      let db =  event.target.result
      let tx = db.transaction(['source-files'], 'readwrite')
      let store = tx.objectStore('source-files')

      let request = store.delete(source_url)

      request.onerror = function(event: any) {
        console.log('error', event.target.error.name)
      }

      request.onsuccess = function(event: any){
        setLocalUrl(null)
      }
    }

    openRequest.onerror = function(event: any) {
      console.log('error', event)
    }
  }

  return localUrl ? (
    <div className={styles.sourceFileContainer}>
      <div className={styles.sourceFile}>
        <a href={localUrl} target="_blank">🗂 Source file</a>
      </div>
      <div className={styles.deleteSourceFile}>
        <button
          className={styles.deleteSourceFileButton}
          onClick={handleSourceFileDelete}
        >
          Delete
        </button>
      </div>
      <div className={styles.replaceSourceFile}>
        <ReferenceAddFileUploadButton
          onUpload={onUpload}
          loading={loading}
          sourceUrl={draftReference.source_url}
        />
      </div>
    </div>
  ) :
    <div>
      <ReferenceAddFileUploadButton
        onUpload={onUpload}
        loading={loading}
        sourceUrl={localUrl}
      />
    </div>
}
