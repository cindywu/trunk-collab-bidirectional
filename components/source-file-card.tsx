import React, { useEffect, useState} from 'react'
import { DEFAULT_SOURCE_FILES_BUCKET } from '../lib/constants'
import { supabase } from '../lib/supabaseClient'
import { idbOK } from '../utils'
import styles from './source-file-card.module.css'

type Props = {
  selectedReference: any
}
export default function SourceFileCard({ selectedReference } : Props) {
  const [localUrl, setLocalUrl] = useState<string | null>(null)

  useEffect(() => {
    !localUrl && downloadSourceFile()
  }, [localUrl])

  useEffect(() => {
    generateSourceFileUrl()
  }, [selectedReference.source_url])

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

      let request = store.get(selectedReference.source_url)

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

  function handleFetch(){
    downloadSourceFile()
  }

  async function downloadSourceFile(){
    try {
      const { data, error } = await supabase.storage.from(DEFAULT_SOURCE_FILES_BUCKET).download(selectedReference.source_url)

      if (error) {
        throw error
      }

      uploadFileToIndexedDB(data)
    } catch {
      console.log('error')
    } finally {
    }
  }

  function uploadFileToIndexedDB(data: Blob){
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

      let newFile = {
        id: selectedReference.source_url,
        file: data
      }

      let request = store.add(newFile)

      request.onerror = function(event: any) {
        console.log('error', event.target.error.name)
      }

      request.onsuccess = function(event: any){
        generateSourceFileUrl()
      }
    }

    openRequest.onerror = function(event: any) {
      console.log('error', event)
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

      let request = store.delete(selectedReference.source_url)

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
      <div
        className={styles.deleteSourceFile}
        onClick={handleSourceFileDelete}
      >
        <button className={styles.deleteSourceFileButton}>
          Delete
        </button>
      </div>
    </div>
  ) : (
    selectedReference.source_url ? (
      <div>
        source_url present but no local file
        <button onClick={handleFetch}>
          fetch
        </button>
      </div>
    ) : (
    <div>
      No source file
    </div>
    )
  )

}
