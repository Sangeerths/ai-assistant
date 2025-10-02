import React from 'react'

export default function InterviewerLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <main style={{ padding: 20 }}>
        <h2 style={{marginTop:0}}>Interviewer</h2>
        {children}
      </main>
    </div>
  )
}
