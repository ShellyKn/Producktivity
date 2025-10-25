import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ToDo from './pages/ToDo.jsx'
import LogIn from './pages/LogIn.jsx'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route exact path="/todo" element={<ToDo />} />
        <Route exact path="/login" element={<LogIn />} />
      </Routes>
    </Router>
  </StrictMode>,
)
