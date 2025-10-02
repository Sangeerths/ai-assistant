// Minimal store using localStorage. For larger projects use Zustand/Redux.
const KEY = 'ai_assistant_store_v1'

function load(){
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : { candidates: {}, sessions: {} } } catch { return { candidates: {}, sessions: {} } }
}

function save(state){
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
}

let store = load()

export function getState(){ return store }

export function setCandidate(id, data){
  store.candidates[id] = { ...(store.candidates[id] || {}), ...data }
  save(store)
}

export function getCandidate(id){ return store.candidates[id] }

export function listCandidates(){ return Object.entries(store.candidates).map(([id, d]) => ({ id, ...d })) }

export function createSession(id, session){
  store.sessions[id] = session
  save(store)
}

export function getSession(id){ return store.sessions[id] }

export function updateSession(id, session){
  store.sessions[id] = session
  save(store)
}
