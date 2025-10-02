import React from 'react'

export default function CandidateDetail({ candidate }){
  if (!candidate) return <div>Select a candidate</div>
  return (
    <div style={{padding:12}}>
      <h3>{candidate.profile?.name || 'Unknown'}</h3>
      <p>Email: {candidate.profile?.email}</p>
      <p>Phone: {candidate.profile?.phone}</p>
      <h4>Final score: {candidate.finalScore}</h4>
      <h4>Summary</h4>
      <p>{candidate.summary}</p>
      <h4>Answers</h4>
      <ol>
        {(candidate.answers || []).map((a,i)=> (
          <li key={i}><strong>{a.question}</strong><br/>Answer: {a.answer || '—'}<br/>Score: {a.score}</li>
        ))}
      </ol>
    </div>
  )
}
