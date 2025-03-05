'use client'
import { useQuery } from '@tanstack/react-query'

async function fetchContent(id: string) {
  const response = await fetch(`/api/content/${id}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export function useContent(id: string) {
  return useQuery({
    queryKey: ['content', id],
    queryFn: () => fetchContent(id),
    enabled: !!id,
  })
}