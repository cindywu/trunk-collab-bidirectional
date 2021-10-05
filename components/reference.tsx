import React, { useEffect } from 'react'
import styles from './reference.module.css'
import LabelList from './label-list'
import type { IReference } from '../interfaces'
import { useReferences } from './reference-provider'

interface ReferenceProps {
  value:  IReference
  id: string
  selectedReference: IReference
}

export default function Reference(props : ReferenceProps ){
  const reference : IReference = props.value
  const { selectedReference } = props

  useEffect(() => {

  },[])

  const {
    handleReferenceSelect,
    handleReferenceExpandChange
  } = useReferences()

  function handleReferenceClick() {
    selectedReference && selectedReference.id === props.id.substring(4)
    ? handleReferenceExpandChange()
    :
    handleReferenceSelect(props.id.substring(4))
  }

  const emphasisStyle = {
    backgroundColor: 'hsl(210, 8%, 93%)'
  } as React.CSSProperties

  function getYearFromPublicationDate() {
    let year
    let array = reference.publication_date.split(' ')
    switch (array && array.length) {
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

    reference.authors.map((author, index) => {
      let data = JSON.parse(author)
      if (JSON.parse(author).first === 'true'){
        last = data.name.split(' ')[1]
      }
    })
    let year = getYearFromPublicationDate()
    let number = reference.authors.length

    let potatoName
    switch (number) {
      case 0:
        potatoName = `Anonymous ${year}`
        break
      case 1:
        potatoName = `${last} ${year}`
        break
      case 2:
        potatoName = `${last} and ${JSON.parse(reference.authors[1]).name.split(' ')[1]} ${year}`
        break
      default:
        potatoName = `${last} et al. ${year}`
        break
    }
    return potatoName
  }

  function truncatedDescription() {
    if (reference.description.length > 66) {
      return reference.description.substring(0, 66) + '...'
    } else if (reference.description.length === 0) {
      return 'No name'
    } else {
      return reference.description
    }
  }

  return (
    <div
      className={styles.container}
      onClick={() => handleReferenceClick()}
      style={(selectedReference && selectedReference.id === props.id.substring(4)) ? emphasisStyle : undefined }
    >
      <div>
        {/* <span className={styles.identifier}>{reference.name}</span> */}
        <span className={styles.identifier}>{potatoName()}</span>
        <span className={styles.parent}>{` › `}</span>
        <span className={`${styles.parent} mr-1`}>{reference.parent}</span>
        <span className={styles.title}>{truncatedDescription()}</span>
      </div>
      <div>
        <span className={`${styles.labels} mr-1`}>
          <LabelList labels={reference.labels} />
        </span>
        <span className={`${styles.createdAt} mr-1`}>{reference.date}</span>
        <span className={styles.assignee}></span>
      </div>
    </div>
  )
}
