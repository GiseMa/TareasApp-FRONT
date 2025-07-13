import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TaskApp from './TaskApp.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TaskApp />
    </BrowserRouter>
  </StrictMode>
    
);
