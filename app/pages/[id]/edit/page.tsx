'use client'

import { useParams } from 'next/navigation'
import { PageEdit } from '@/pages/page-edit'

export default function PageEditPage() {
  const params = useParams()
  const id = params.id as string
  
  return <PageEdit id={id} />
} 