import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'
import { queryClient } from '@/lib/query-client'

export default function AppProvider({children}: {children: ReactNode}) {
  return (
    <QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}
