import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import IntroPage from './IntroPage.jsx'
import { Amplify } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
import outputs from '../amplify_outputs.json'

Amplify.configure(outputs)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  </StrictMode>
)
