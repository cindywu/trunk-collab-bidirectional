export type IReference = {
  id: string
  source_url: string,
  name: string
  parent: string
  date: string
  description: string
  labels: ILabel[]
  comments: IComment[]
}

export type ILabel = {
  id: string
  name: string
  color: string
}

export type IComment = {
  id: string
  user: string
  content: string
}