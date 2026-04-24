import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LessonProvider } from './context/LessonContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LessonProvider>
      <App />
    </LessonProvider>
  </StrictMode>,
)
