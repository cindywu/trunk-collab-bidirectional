import React, { useState, createContext, useContext } from 'react'
import { IReference } from '../interfaces'
// import { sampleReferenceData } from '../utils/sample-data'

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
  handleSetRep: (rep: any) => {}
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

  function handleSetRep(rep: any) {
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