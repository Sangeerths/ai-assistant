import ResumeUpload from '../../components/ResumeUpload'
import React, { useEffect, useState } from 'react'
import ChatBot from '../../components/ChatBot'
import { createSession, getSession, setCandidate, updateSession, clearSession } from '../../store/useInterviewStore'
import { useNavigate } from 'react-router-dom'

export default function IntervieweeDashboard(){
  const navigate = useNavigate()
  const [parsedProfile, setParsedProfile] = useState(null)
  const [collectValues, setCollectValues] = useState({ name:'', email:'', phone:'' })

  const handleParsed = (parsed) => {
    // store parsed in local state and show missing-field collection if needed
    setParsedProfile(parsed || { name:'', email:'', phone:'' })
    setCollectValues({ name: parsed?.name || '', email: parsed?.email || '', phone: parsed?.phone || '' })
    // if parser returned all required fields, auto-save and start the interview
    const hasAll = parsed && parsed.name && parsed.email && parsed.phone
    if (hasAll) {
      const final = { ...(parsed || {}) }
      try { localStorage.setItem('last_profile', JSON.stringify(final)) } catch {}
      // auto-start interview inline
      startNew()
    }
  }

  const [sessionId, setSessionId] = useState(null)
  const [session, setSessionState] = useState(null)
  const [savingStatus, setSavingStatus] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)

  useEffect(() => {
    // when saving finished for a completed session, redirect to login
    if (completed && savingStatus === 'saved'){
      // small delay to allow UI update then navigate
      setTimeout(()=>{
        setCompleted(false)
        setSavingStatus(null)
        navigate('/login')
      }, 250)
    }
  }, [completed, savingStatus, navigate])

  useEffect(()=>{
    // on mount, check for unfinished session
    const s = getSession('current')
    if (s && !s.finished){
      setShowWelcomeBack(true)
      // keep session state but wait for user to resume
    }
  }, [])

  const startNew = () => {
    const id = Date.now().toString()
    const initial = { id, questions: null, index:0, answers: [], timeLeft: null, finished:false }
    createSession('current', initial)
    setSessionId('current')
    setSessionState(initial)
    setParsedProfile(null)
  }

  const handleFinish = async ({ finalScore, answers }) => {
    // Show completion prompt immediately
    setSavingStatus('saving')
    setCompleted(true)
    // determine profile from last_profile or collected fields
    let profile = null
    try { profile = JSON.parse(localStorage.getItem('last_profile')) } catch {}
    if (!profile) profile = collectValues || parsedProfile || { name:'', email:'', phone:'' }

    const payload = { profile, finalScore, answers }
    let savedId = null
    try {
      const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/api/candidates', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (json && json.ok) savedId = json.id
    } catch (err) {
      console.warn('Server save failed, falling back to local store', err)
    }

    if (!savedId) {
      const id = Date.now().toString()
      setCandidate(id, { profile, finalScore, summary: 'Auto-summary', answers })
    }

    // mark session finished
  updateSession('current', { ...(session || {}), finished: true, finalScore })
  // clear persisted session so Welcome Back doesn't re-appear
  try{ clearSession('current') }catch(e){}
    setSessionId(null)
    setSessionState(null)
    setSavingStatus('saved')
    // cleanup last_profile so user won't re-use it
    try { localStorage.removeItem('last_profile') } catch {}
  }

  const saveAndStart = () => {
    const final = { ...(parsedProfile || {}), ...collectValues }
    try { localStorage.setItem('last_profile', JSON.stringify(final)) } catch {}
    startNew()
  }

  return (
    <div style={{padding:20}}>
      <h2>Interviewee Dashboard</h2>
      <p>Upload your resume to pre-fill your profile and start the interview.</p>
      <div style={{maxWidth:640}}>
        {!parsedProfile ? (
          <ResumeUpload onParsed={handleParsed} />
        ) : (
          <div style={{padding:12, border:'1px solid rgba(255,255,255,0.04)', borderRadius:8}}>
            <h4>Confirm your details</h4>
            <label>Name</label>
            <input value={collectValues.name} onChange={e=>setCollectValues(c=>({...c, name: e.target.value}))} style={{width:'100%'}} />
            <label>Email</label>
            <input value={collectValues.email} onChange={e=>setCollectValues(c=>({...c, email: e.target.value}))} style={{width:'100%'}} />
            <label>Phone</label>
            <input value={collectValues.phone} onChange={e=>setCollectValues(c=>({...c, phone: e.target.value}))} style={{width:'100%'}} />
            <div style={{marginTop:8}}>
              <button className="btn primary" onClick={saveAndStart}>Save & Start Interview</button>
              <button className="btn" onClick={()=>setParsedProfile(null)} style={{marginLeft:8}}>Upload a different file</button>
            </div>
          </div>
        )}
      </div>

      <div style={{marginTop:20}}>
        {sessionId ? (
          <ChatBot sessionId={sessionId} initial={getSession(sessionId)} onFinish={(res)=>{
            handleFinish(res)
          }} />
        ) : (
          <div style={{color:'var(--muted)'}}>No active interview. Upload resume and press Save & Start to begin.</div>
        )}
      </div>

      {showWelcomeBack && (
        <div style={{position:'fixed', left:0, top:0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.6)'}}>
          <div style={{background:'#0b1220', padding:20, borderRadius:8, width:420, boxShadow:'0 6px 30px rgba(0,0,0,0.6)'}}>
            <h3>Welcome back</h3>
            <p>We found an unfinished interview. Would you like to resume where you left off or discard it and start a new one?</p>
            <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:12}}>
              <button className="btn" onClick={()=>{ setShowWelcomeBack(false); try{ clearSession('current') }catch(e){} }}>Discard</button>
              <button className="btn" onClick={()=>{ setShowWelcomeBack(false); /* Go back to dashboard view */ setSessionId(null) }}>Go back</button>
              <button className="btn primary" onClick={()=>{ setShowWelcomeBack(false); setSessionId('current'); setSessionState(getSession('current')) }}>Resume</button>
            </div>
          </div>
        </div>
      )}
      {completed && (
        <div style={{position:'fixed', left:0, top:0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.6)'}}>
          <div style={{background:'#0b1220', padding:20, borderRadius:8, width:420, boxShadow:'0 6px 30px rgba(0,0,0,0.6)'}}>
            <h3>Test completed</h3>
            <p>Please wait for the interviewer. Your answers are being saved.</p>
            <div style={{marginTop:12}}>
              {savingStatus === 'saving' ? (
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <div className="spinner" style={{width:16, height:16, border:'3px solid #333', borderTop:'3px solid #fff', borderRadius:8, animation:'spin 1s linear infinite'}} />
                  <span>Saving...</span>
                </div>
              ) : (
                <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
                  <button className="btn" onClick={()=>{ setCompleted(false); setSavingStatus(null); navigate('/login') }}>Go back</button>
                  <button className="btn primary" onClick={()=>{ setCompleted(false); setSavingStatus(null); navigate('/login') }}>Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
