'use client'

import { useParams } from 'next/navigation'
import { UserProfile } from '@/pages/user-profile'

export default function UserProfilePage() {
  const params = useParams()
  const id = params.id as string
  
  return <UserProfile userId={id} />
} 