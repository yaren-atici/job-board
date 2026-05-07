import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import JobList from './pages/JobList'
import JobDetail from './pages/JobDetail'
import NewJob from './pages/NewJob'
import ApplyJob from './pages/ApplyJob'
import './index.css'

function Navbar() {
  return (
    <nav>
      <Link to="/jobs" className="nav-brand">
        bloom<span>jobs</span>
      </Link>
      <Link to="/jobs/new" className="nav-link">+ Post a Job</Link>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/new" element={<NewJob />} />
        <Route path="/jobs/:id/apply" element={<ApplyJob />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
      </Routes>
    </BrowserRouter>
  )
}