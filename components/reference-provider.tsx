import React, { useState, createContext, useContext, useEffect, } from 'react'
import { IReference } from '../interfaces'
import { AuthSession } from '@supabase/supabase-js'
import { Replicache } from 'replicache'
import { idbOK } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../lib/supabaseClient'
import { DEFAULT_SOURCE_FILES_BUCKET } from '../lib/constants'
import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from '../lib/constants'

type ReferencesContextType = {
  selectedReferenceId: string | undefined
  showReferenceAdd: boolean
  expandSelectedReference: boolean
  handleReferenceAdd: (newReference: IReference) => void
  handleReferenceArchive: (id: string) => void
  handleReferenceSelect: (id: string) => void
  handleReferenceDeselect: () => void
  handleReferenceChange: (reference: IReference) => void
  handleShowReferenceAdd: () => void
  handleReferenceExpandChange: () => void
  handleSetRep: (rep: any) => void
  handleSourceFileUpload: (file: File, reference: IReference) => void
}

const defaultContextValue = {
  selectedReferenceId: '',
  showReferenceAdd: false,
  expandSelectedReference: false,
  handleReferenceAdd: (newReference: IReference) => {},
  handleReferenceArchive: (id: string) => {},
  handleReferenceSelect: (id: string) => {},
  handleReferenceDeselect: () => {},
  handleReferenceChange: (reference: IReference) => {},
  handleShowReferenceAdd: () => {},
  handleReferenceExpandChange: () => {},
  handleSetRep: (rep: any) => {},
  handleSourceFileUpload: (file: File, reference: IReference) => {},
}

export const ReferencesContext = createContext<ReferencesContextType>(defaultContextValue)

type ReferenceProviderProps = {
  children: React.ReactNode
}

export const ReferenceProvider = ({ children } : ReferenceProviderProps) => {
  const [showReferenceAdd, setShowReferenceAdd] = useState<boolean>(false)
  const [selectedReferenceId, setSelectedReferenceId] = useState<string | undefined>()
  const [expandSelectedReference, setExpandSelectedReference] = useState<boolean>(false)
  const [rep, setRep] = useState<any>()
  const [session, setSession] = useState<AuthSession | null>()

  useEffect(() => {
    const session = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
    setSession(session ? JSON.parse(session).currentSession : null)
  },[])

  const referencesContextValue = {
    selectedReferenceId,
    showReferenceAdd,
    expandSelectedReference,
    handleReferenceAdd,
    handleReferenceArchive,
    handleReferenceSelect,
    handleReferenceDeselect,
    handleReferenceChange,
    handleShowReferenceAdd,
    handleReferenceExpandChange,
    handleSetRep,
    handleSourceFileUpload
  }

  function handleSourceFileUpload(file: File, reference: IReference) {
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
      let tx = db.transaction(['source-files'], 'readwrite')
      let store = tx.objectStore('source-files')

      const fileID = uuidv4()
      const refID = reference.id
      const newFileID = `${session.user.id}/${refID}/${fileID}.pdf`

      const newFile = {
        id: newFileID,
        file: file
      }

      let request = store.add(newFile)

      request.onerror = function(event: any) {
        console.log('error', event.target.error.name)
      }

      request.onsuccess = function(event: any) {
        uploadSourceFile(file, fileID, reference)
      }
    }

    openRequest.onerror = function(event: any) {
      console.dir(event)
    }
  }

  async function uploadSourceFile(file: File, fileID: string, reference: IReference){
    try {

      const user = session.user
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${reference.id}/${fileID}.${fileExt}`
      const filePath = fileName

      let payload = {...reference, source_url: filePath }
      handleReferenceChange(payload)

      let { error : uploadError } = await supabase.storage
        .from(DEFAULT_SOURCE_FILES_BUCKET)
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

    } catch (error) {
      alert(error.message)
    } finally {

    }
  }

  function handleReferenceSelect(id: string){
    setSelectedReferenceId(id)
  }

  function handleShowReferenceAdd() {
    setShowReferenceAdd(!showReferenceAdd)
  }

  function handleReferenceAdd(newReference: IReference) {
    if (rep != undefined) {
      rep.mutate.createReference(newReference)
      showReferenceAdd && setShowReferenceAdd(!showReferenceAdd)
    }
  }

  function handleReferenceArchive(id: string) {
    if (rep != undefined) {
      rep.mutate.deleteReference({id: id})
    }
    expandSelectedReference === true && setExpandSelectedReference(!expandSelectedReference)
  }

  function handleReferenceDeselect() {
    setSelectedReferenceId(undefined)
    expandSelectedReference && setExpandSelectedReference(!expandSelectedReference)
  }

  function handleReferenceChange(reference: IReference) {
    if (rep != undefined) {
      rep.mutate.updateReference({
        id: reference.id,
        source_url: reference.source_url,
        name: reference.name,
        parent: reference.parent,
        date: reference.date,
        description: reference.description,
        labels: reference.labels,
        comments: reference.comments
      })
    }
  }

  function handleReferenceExpandChange() {
    setExpandSelectedReference(!expandSelectedReference)
  }

  function handleSetRep(rep: Replicache) {
    setRep(rep)
  }

  return (
    <ReferencesContext.Provider
      value={referencesContextValue}
    >
      {children}
    </ReferencesContext.Provider>
  )
}

export const useReferences = () => useContext(ReferencesContext)

export default ReferenceProvider