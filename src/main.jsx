import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

// Wake the backend the instant the page loads — before React even renders.
// This gives the backend the maximum possible time to spin up before the
// user reaches the contact form.
const _apiBase = import.meta.env.VITE_API_URL ?? ""
if (_apiBase) fetch(`${_apiBase}/api/health`).catch(() => {})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
