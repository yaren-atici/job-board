import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function ApplyJob() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    applicant_name: '',
    applicant_email: '',
    cover_letter: '',
  })

  useEffect(() => {
    async function fetchJob() {
      const { data } = await supabase
        .from('job_postings')
        .select('id, company, position')
        .eq('id', id)
        .single()
      setJob(data)
    }
    fetchJob()
  }, [id])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase.from('applications').insert([{
      job_id: id,
      applicant_name: form.applicant_name,
      applicant_email: form.applicant_email,
      cover_letter: form.cover_letter,
      applied_at: new Date().toISOString(),
    }])

    if (!error) {
      navigate(`/jobs/${id}`)
    } else {
      alert('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <Link to={`/jobs/${id}`} className="back-link">← Back to job details</Link>
      <h1 className="page-title">Submit Application</h1>
      <p className="page-subtitle">Tell us why you're a great fit</p>

      {job && (
        <div className="apply-for-job">
          <div>
            <span className="apply-for-badge">Applying for</span>
            <div className="apply-for-position">{job.position}</div>
            <div className="apply-for-company">at {job.company}</div>
          </div>
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="applicant_name">Full Name</label>
            <input
              id="applicant_name"
              type="text"
              name="applicant_name"
              placeholder="Your full name"
              value={form.applicant_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicant_email">Email Address</label>
            <input
              id="applicant_email"
              type="email"
              name="applicant_email"
              placeholder="you@example.com"
              value={form.applicant_email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cover_letter">Cover Letter</label>
            <textarea
              id="cover_letter"
              name="cover_letter"
              placeholder="Share your experience, motivation, and why you're the best candidate…"
              value={form.cover_letter}
              onChange={handleChange}
              rows={8}
              required
            />
          </div>

          <div className="btn-row">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Application →'}
            </button>
            <Link to={`/jobs/${id}`} className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}