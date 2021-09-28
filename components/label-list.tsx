import React from 'react'
import Label from './label'
import type { ILabel } from '../interfaces'

type Props = {
  labels: ILabel[]
}

export default function LabelList({ labels } : Props) {
  const labelElements = labels.map((label) => {
    let obj

    typeof(label) === 'object' ?
      obj = label
      :
      obj = JSON.parse(label)

    return <Label key={obj.id} label={obj} />
  })

  return (
    <>
      {labelElements}
    </>
  )
}
