import React, {useState, useEffect} from 'react'
import ReferenceEdit from './reference-edit'
import { useSubscribe } from 'replicache-react'
import { useReferences } from './reference-provider'

export default function NavEast({rep} : any) {
  const { selectedReferenceId } = useReferences()
  const [selectedReference, setSelectedReference] = useState<any>()

  const references = useSubscribe(
    rep,
    async tx => {
      const list = await tx.scan({ prefix: 'ref/'}).entries().toArray()
      return list
    },
    [],
  )

  useEffect(() => {
    selectedReferenceId ?
    findSelectedReference()
    :
    setSelectedReference(null)
  }, [selectedReferenceId])

  function findSelectedReference(){
    references.map(([k, v]) => {
      if (k.substring(4) === selectedReferenceId) {
        const payload = v
        Object.assign(payload, {id: k.substring(4)})
        setSelectedReference(payload)
      }
    })
  }

  return (
    <>
      { selectedReferenceId &&
        <ReferenceEdit
          selectedReference={selectedReference}
          setSelectedReference={setSelectedReference}
        />
      }
    </>
  )
}
