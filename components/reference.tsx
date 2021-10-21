import React, { useEffect, useState } from 'react'
import styles from './reference.module.css'
import LabelList from './label-list'
import type { IReference } from '../interfaces'
import { useReferences } from './reference-provider'
import ReferenceLink from './reference-link'
import { v4 as uuidv4 } from 'uuid'

interface ReferenceProps {
  value:  IReference
  id: string
  selectedReference: IReference
  references: IReference[]
}

export default function Reference(props : ReferenceProps ){
  const reference : IReference = props.value
  const { selectedReference, references } = props
  const [links, setLinks] = useState([])

  useEffect(() => {
    getLinks()
  },[])

  useEffect(() => {
    getLinks()
  }, [selectedReference])

  const {
    handleReferenceSelect,
    handleReferenceExpandChange
  } = useReferences()

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
    let array = reference && reference.publication_date && reference.publication_date.split(' ')
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

    reference.authors.map(author => {
      let str
      if (typeof author === 'object') {
        str = JSON.stringify(author)
      } else {
        str = author
      }
      if (JSON.parse(str).first === 'true') {
        last = JSON.parse(str).name.split(' ')[1]
      }
    })

    let year = getYearFromPublicationDate()
    let number = reference && reference.authors && reference.authors.length

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
    if (reference && reference.description && reference.description.length > 66) {
      return reference.description.substring(0, 66) + '...'
    } else if (reference && reference.description && reference.description.length === 0) {
      return 'No name'
    } else {
      return reference.description
    }
  }

  return (
    <>
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
      <div>
        { selectedReference && (reference.id === selectedReference.id ) && links.map((link, index) => {
          return (
            <ReferenceLink
              key={link[0].substring(4)}
              id={link[0].substring(4)}
              value={link[1]}
              selectedReference={selectedReference}
            />
          )
        })}
    </div>
  </>
  )
}
