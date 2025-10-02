import React, { useState } from 'react'

export default function ResumeUpload({ onParsed }) {
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)

  const handleFile = async (e) => {
    setError(null)
    const f = e.target.files[0]
    if (!f) return
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(f.type) && !f.name.endsWith('.pdf') && !f.name.endsWith('.docx')) {
      setError('Please upload a PDF or DOCX file')
      return
    }
    setFileName(f.name)
    // Basic stub: we don't parse PDF/DOCX here without extra libs.
    // Instead, return best-effort empty result and let the chatbot collect missing fields.
    // Later you can integrate `pdfjs-dist` or a server-side parser for accurate extraction.
    onParsed({ name: '', email: '', phone: '' })
  }

  return (
    <div>
      <label style={{display:'block', marginBottom:8}}>Upload resume (PDF or DOCX)</label>
      <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFile} />
      {fileName && <div style={{marginTop:8}}>Uploaded: {fileName}</div>}
      {error && <div style={{color:'var(--danger)'}}>{error}</div>}
      <p style={{fontSize:12, color:'var(--muted)'}}>Note: this demo uses a stub parser. Integrate a parser for real extraction.</p>
    </div>
  )
}
