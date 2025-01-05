import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProviderWrapper } from './context/themeContext.tsx'
import { ClientProvider } from './context/ClientContext.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProviderWrapper>
      <ClientProvider>
        <App />
      </ClientProvider>
    </ThemeProviderWrapper>
  </StrictMode>
)