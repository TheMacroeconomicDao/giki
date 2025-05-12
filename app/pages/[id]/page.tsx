"use client"

import { useParams } from 'next/navigation'
import { PageView } from '@pages/page-view'

export default function PageViewPage() {
  const params = useParams()
  const id = params.id as string
  
  return <PageView id={id} />
}
