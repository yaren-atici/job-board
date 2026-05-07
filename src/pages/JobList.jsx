import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function formatSalary(min, max) {
  return `$${min.toLocaleString()} – $${max.toLocaleString()}`
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function JobList() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('posted_at', { ascending: false })

      if (!error) setJobs(data)
      setLoading(false)
    }
    fetchJobs()
  }, [])

  if (loading) return <div className="loading">Loading jobs…</div>

  return (
    <div className="page">
      <h1 className="page-title">Open Positions</h1>
      <p className="page-subtitle">{jobs.length} job{jobs.length !== 1 ? 's' : ''} available right now</p>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <strong>No jobs posted yet</strong>
          <p>Be the first to post a job opening!</p>
        </div>
      ) : (
        jobs.map(job => (
          <Link to={`/jobs/${job.id}`} className="job-card" key={job.id}>
            <div className="job-card-header">
              <div>
                <div className="job-card-company">{job.company}</div>
                <div className="job-card-position">{job.position}</div>
              </div>
              <div className="job-card-salary">
                {formatSalary(job.salary_min, job.salary_max)}
              </div>
            </div>
            <div className="job-card-meta">
              <span>📍 {job.location}</span>
              <span>📅 {formatDate(job.posted_at)}</span>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}