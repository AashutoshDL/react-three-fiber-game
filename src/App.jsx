import React from 'react'
import './App.css'
import Scene from './components/Scene'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Scene />} />
      </Routes>
    </Router>
  )
}

export default App