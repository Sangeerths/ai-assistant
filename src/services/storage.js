// Simple localStorage-backed storage for candidates and sessions
const KEY = 'ai_assistant_v1'

export function readState(){
  try{
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { candidates: [], sessions: {} }
  }catch(e){
    return { candidates: [], sessions: {} }
  }
}

export function writeState(state){
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function saveCandidate(candidate){
  const s = readState()
  const idx = s.candidates.findIndex(c=>c.id===candidate.id)
  if (idx>=0) s.candidates[idx] = candidate
  else s.candidates.push(candidate)
  writeState(s)
}

export function getCandidates(){
  return readState().candidates
}

export function saveSession(sessionId, session){
  const s = readState()
  s.sessions[sessionId] = session
  writeState(s)
}

export function getSession(sessionId){
  return readState().sessions[sessionId]
}
