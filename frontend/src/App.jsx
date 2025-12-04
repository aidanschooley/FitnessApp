import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './assets/Pages/Dashboard.jsx'
import Workout from './assets/Pages/workout.jsx';
import Record from './assets/Pages/record.jsx';
import Goals from './assets/Pages/goal.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Login from './assets/components/LoginForm.jsx'
import CreateAccount from './assets/Pages/CreateAccount.jsx'
function App() {

  return (
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/record" element={<Record/>} />
            <Route path="/goals" element={<Goals/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<CreateAccount />} />
          </Routes>
        </BrowserRouter>
  )
    
}

export default App
