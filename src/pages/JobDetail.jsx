import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })
}

function ApplicationCard({ app }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="application-card">
      <div className="application-header" onClick={() => setOpen(o => !o)}>
        <div>
          <div className="applicant-name">{app.applicant_name}</div>
          <div className="applicant-email">{app.applicant_email}</div>
        </div>
        <div className="application-date">
          Applied {formatDate(app.applied_at)}
        </div>
      </div>
      <button className="cover-letter-toggle" onClick={() => setOpen(o => !o)}>
        {open ? '▲ Hide cover letter' : '▼ Read cover letter'}
      </button>
      {open && (
        <div className="cover-letter-body">
          {app.cover_letter}
        </div>
      )}
    </div>
  )
}

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: jobData } = await supabase
        .from('job_postings')
        .select('*')
        .eq('id', id)
        .single()

      const { data: appsData } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', id)
        .order('applied_at', { ascending: false })

      setJob(jobData)
      setApplications(appsData || [])
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) return <div className="loading">Loading…</div>
  if (!job) return <div className="page"><p>Job not found.</p></div>

  return (
    <div className="page">
      <Link to="/jobs" className="back-link">← Back to all jobs</Link>

      <div className="detail-header">
        <div className="detail-company">{job.company}</div>
        <h1 className="detail-position">{job.position}</h1>
        <div className="detail-tags">
          <span className="tag">📍 {job.location}</span>
          <span className="tag salary">
            💰 ${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()}
          </span>
          <span className="tag">
            📅 Posted {new Date(job.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <p className="detail-description">{job.description}</p>
        <div className="btn-row">
          <Link to={`/jobs/${job.id}/apply`} className="btn-primary">
            Apply Now →
          </Link>
        </div>
      </div>

      <h2 className="section-title">
        Applications ({applications.length})
      </h2>

      {applications.length === 0 ? (
        <div className="empty-state">
          <strong>No applications yet</strong>
          <p>Be the first to apply for this position!</p>
        </div>
      ) : (
        applications.map(app => (
          <ApplicationCard key={app.id} app={app} />
        ))
      )}
    </div>
  )
}