'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// You can extend the theme here if needed
// import { extendTheme } from '@chakra-ui/react'
// const theme = extendTheme({ colors: { ... } })

// Create a client
const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ChakraProvider theme={theme}>{children}</ChakraProvider> */}
      <ChakraProvider>{children}</ChakraProvider>
    </QueryClientProvider>
  )
}
