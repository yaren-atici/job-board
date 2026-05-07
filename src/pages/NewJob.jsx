import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function NewJob() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    company: '',
    position: '',
    location: '',
    salary_min: '',
    salary_max: '',
    description: '',
  })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase.from('job_postings').insert([{
      company: form.company,
      position: form.position,
      location: form.location,
      salary_min: parseInt(form.salary_min),
      salary_max: parseInt(form.salary_max),
      description: form.description,
      posted_at: new Date().toISOString().split('T')[0],
    }])

    if (!error) {
      navigate('/jobs')
    } else {
      alert('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <Link to="/jobs" className="back-link">← Back to all jobs</Link>
      <h1 className="page-title">Post a New Job</h1>
      <p className="page-subtitle">Fill in the details to list your opening</p>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Company Name</label>
              <input
                id="company"
                type="text"
                name="company"
                placeholder="e.g. Acme Corp"
                value={form.company}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Position Title</label>
              <input
                id="position"
                type="text"
                name="position"
                placeholder="e.g. Senior Designer"
                value={form.position}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="e.g. Remote · New York, NY"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salary_min">Salary Min ($)</label>
              <input
                id="salary_min"
                type="number"
                name="salary_min"
                placeholder="e.g. 4000"
                value={form.salary_min}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="salary_max">Salary Max ($)</label>
              <input
                id="salary_max"
                type="number"
                name="salary_max"
                placeholder="e.g. 6000"
                value={form.salary_max}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe responsibilities, requirements, benefits…"
              value={form.description}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>

          <div className="btn-row">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Posting…' : 'Post Job →'}
            </button>
            <Link to="/jobs" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}