"use client"

import { QueryClient, QueryClientProvider } from "react-query"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "./auth-providers"
import { Toaster } from "sonner"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
      <Toaster />
    </QueryClientProvider>
  )
}

