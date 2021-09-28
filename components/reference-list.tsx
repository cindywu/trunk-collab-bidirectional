import React from 'react'
import Reference from './reference'
import styles from './reference-list.module.css'
import type { IReference } from '../interfaces'

type Props = {
  references: any,
  selectedReference: IReference
}

export default function ReferenceList({ references, selectedReference } : Props) {
  return (
    <div className={styles.container}>
      {references.map(([k, v]: [string, IReference]) => {
        return (
          <Reference
            key={k}
            value={v}
            id={k}
            selectedReference={selectedReference}
          />
        )
      })}
    </div>
  )
}
