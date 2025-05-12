"use client"

import { useParams } from 'next/navigation'
import { PageView } from '../../../src/pages/page-view'

export default function PageViewWrapper() {
  const params = useParams()

  if (!params || !params.id) {
    return <div>Page ID is missing</div>
  }

  const id = params.id as string

  return <PageView id={id} />
}
