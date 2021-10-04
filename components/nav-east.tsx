import React, {useState, useEffect} from 'react'
import ReferenceEdit from './reference-edit'
import { useSubscribe } from 'replicache-react'
import { useReferences } from './reference-provider'
import { Replicache } from 'replicache'
import type { IReference } from '../interfaces'

type Props = {
  rep: Replicache
}

export default function NavEast({ rep } : Props) {
  const { selectedReferenceId } = useReferences()
  const [selectedReference, setSelectedReference] = useState<IReference>()

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
  }, [selectedReferenceId, references])

  function findSelectedReference(){
    references.map(([k, v]: [string, IReference]) => {
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
