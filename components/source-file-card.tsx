import React, { useEffect, useState} from 'react'
import { idbOK } from '../utils'

type Props = {
  selectedReference: any
}
export default function SourceFileCard({ selectedReference } : Props) {
  const [url, setUrl] = useState<string>('')
  const [localUrl, setLocalUrl] = useState<string | null>(null)

  const { source_url } = selectedReference

  useEffect(() => {
    if (source_url) {
      generateSourceFileUrl(source_url)
    }
  }, [source_url])

  function generateSourceFileUrl(url) {
    let idArray = url.split('/')
    let filePath = idArray[1]+"/"+idArray[2]
    let thing = filePath.split('.')
    let final = thing[0]

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

      var request = store.get(final)

      request.onerror = function(event: any) {
        console.log('error', event.target.error.name)
      }

      request.onsuccess = function(event: any){
        var result = event.target.result
        console.dir(result)
        const hi = URL.createObjectURL(result.file)
        setLocalUrl(hi)
      }

      request.onerror = function(event: any) {
        console.dir(event)
      }
    }

    openRequest.onerror = function(event: any) {
      console.dir(event)
    }
  }

  return localUrl ? (
    <div>
      <a href={localUrl} target="_blank">🗂 Source file</a>
    </div>
  ) : (
    <div>
      No source file
    </div>
  )

}
