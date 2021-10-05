export type IReference = {
  id: string
  authors: any,
  source_url: string,
  name: string
  parent: string
  date: string
  description: string
  labels: any
  comments: any
  publication_date: string
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

export type IAuthor = {
  id: string
  name: string
  first: string
}