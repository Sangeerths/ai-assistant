import React, { useEffect, useState } from 'react'
import { listCandidates, getCandidate } from '../../store/useInterviewStore'
import CandidateDetail from './CandidateDetail'

export default function InterviewerDashboard(){
  const [candidates, setCandidates] = useState([])
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('score')
  const [selected, setSelected] = useState(null)
  useEffect(()=>{
    let mounted = true
    const fetchServer = async () => {
      try {
        const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/api/candidates')
        const json = await res.json()
        let serverList = []
        if (json && json.ok && mounted) {
          serverList = json.candidates.map(c => ({ id: c._id || c.id, profile: c.profile, finalScore: c.finalScore, answers: c.answers }))
        }
        // always merge with local candidates so interviewer sees offline-saved items too
        const localList = listCandidates()
        const byKey = new Map()
        const add = (item)=>{
          // prefer server item if IDs match; otherwise dedupe by email
          const key = item.id || (item.profile && item.profile.email) || JSON.stringify(item.profile || {})
          if (!byKey.has(key)) byKey.set(key, item)
        }
        serverList.forEach(add)
        localList.forEach(add)
        const merged = Array.from(byKey.values())
        if (mounted) setCandidates(merged)
      } catch (err) {
        // on error, fallback to local
        if (mounted) setCandidates(listCandidates())
      }
    }
    fetchServer()
    const t = setInterval(fetchServer, 10000)
    return ()=> { mounted = false; clearInterval(t) }
  }, [])

  const filtered = candidates.filter(c=> (c.profile?.name || '').toLowerCase().includes(query.toLowerCase()) || (c.profile?.email || '').toLowerCase().includes(query.toLowerCase()))
  const sorted = [...filtered].sort((a,b)=> {
    if (sortBy === 'score') return (b.finalScore || 0) - (a.finalScore || 0)
    return (a.profile?.name || '').localeCompare(b.profile?.name || '')
  })

  return (
    <div style={{padding:20}}>
      <h3>Candidates</h3>
      <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:12}}>
        <input placeholder="Search" value={query} onChange={e=>setQuery(e.target.value)} style={{flex:1}} />
        <label style={{whiteSpace:'nowrap'}}>
          Sort:
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{marginLeft:8}}>
            <option value="score">Score</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <div style={{display:'grid', gap:12}}>
        <div>
          <ul style={{listStyle:'none', padding:0, margin:0}}>
            {sorted.map(c=> (
              <li key={c.id} style={{padding:10, borderBottom:'1px solid rgba(255,255,255,0.03)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <strong>{c.profile?.name || 'Unknown'}</strong>
                  <div style={{fontSize:12}}>{c.profile?.email}</div>
                </div>
                <div style={{display:'flex', gap:8, alignItems:'center'}}>
                  <div style={{fontSize:14}}>{c.finalScore || 0}</div>
                  <button onClick={()=>setSelected(c)}>View</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 style={{marginTop:0}}>Candidate detail</h3>
          <CandidateDetail candidate={selected ? selected : getCandidate(selected)} />
        </div>
      </div>
    </div>
  )
}
