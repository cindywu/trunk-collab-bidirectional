import { ChangeEventHandler } from 'react'

type Props = {
  onUpload: ChangeEventHandler
  loading: boolean
  sourceUrl: string
}

export default function ReferenceAddFileUploadButton(props : Props) {
  return (
    <div>
      <label className="button primary block" htmlFor="single">
        {props.loading ? 'Uploading ...' :
          props.sourceUrl ? '+ Replace' : '+ Add source file'
        }
      </label>
      <input
        style={{
          visibility: 'hidden',
          position: 'absolute',
        }}
        type="file"
        id="single"
        accept="image/*, application/pdf"
        onChange={props.onUpload}
        disabled={props.loading}
      />
    </div>
  )
}
