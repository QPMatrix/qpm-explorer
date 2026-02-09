import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

interface QueryProviderProps {
  children: ReactNode
}

/**
 * TanStack Query provider for the application
 * 
 * @param props - Component props
 * @param props.children - Child components
 * @returns Provider component
 */
export function QueryProvider({ children }: QueryProviderProps):ReactNode {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
