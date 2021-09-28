import React from 'react'
import styles from './label.module.css'
import type { ILabel } from '../interfaces'

type Props = {
  label: ILabel
}

export default function Label({ label } : Props) {
  const labelColor = {
    color: label.color
  }

  return (
    <span className={`${styles.container} mr-1`}>
      <span className={`${styles.color} mr-1`} style={labelColor}>●</span>
      <span className={styles.name}>{label.name}</span>
    </span>
  )
}
