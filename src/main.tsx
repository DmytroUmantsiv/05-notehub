import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import 'modern-normalize/modern-normalize.css'
import App from './components/App/App'


const queryClient = new QueryClient()


createRoot(document.getElementById('root')!).render(
<React.StrictMode>
<QueryClientProvider client={queryClient}>
<App />
<Toaster position="top-center" />
</QueryClientProvider>
</React.StrictMode>
)