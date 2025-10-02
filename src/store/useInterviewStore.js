import create from 'zustand'
import { persist } from 'zustand/middleware'

// migrate from old localStorage key if present
const LEGACY_KEY = 'ai_assistant_store_v1'
const STORAGE_KEY = 'ai_assistant_zustand_v1'

function migrateLegacy(){
  try{
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // optional simple migration: keep candidates and sessions
    return { candidates: parsed.candidates || {}, sessions: parsed.sessions || {} }
  }catch(e){ return null }
}

export const useInterviewStore = create(persist((set, get) => ({
  candidates: {},
  sessions: {},
  setCandidate: (id, data) => set(state => ({ candidates: { ...state.candidates, [id]: { ...(state.candidates[id]||{}), ...data } } })),
  getCandidate: (id) => get().candidates[id],
  listCandidates: () => Object.entries(get().candidates).map(([id,d]) => ({ id, ...d })),
  createSession: (id, session) => set(state => ({ sessions: { ...state.sessions, [id]: session } })),
  getSession: (id) => get().sessions[id],
  updateSession: (id, session) => set(state => ({ sessions: { ...state.sessions, [id]: session } })),
  clearSession: (id) => set(state => { const s = { ...get().sessions }; delete s[id]; return { sessions: s } })
}), {
  name: STORAGE_KEY,
  getStorage: () => localStorage,
  partialize: (state) => ({ candidates: state.candidates, sessions: state.sessions }),
  migrate: (persistedState, version) => {
    if (persistedState) return persistedState
    const legacy = migrateLegacy()
    return legacy || { candidates: {}, sessions: {} }
  }
}))

// compatibility helper functions for existing imports
export function setCandidate(id, data){ useInterviewStore.getState().setCandidate(id, data) }
export function getCandidate(id){ return useInterviewStore.getState().getCandidate(id) }
export function listCandidates(){ return useInterviewStore.getState().listCandidates() }
export function createSession(id, session){ useInterviewStore.getState().createSession(id, session) }
export function getSession(id){ return useInterviewStore.getState().getSession(id) }
export function updateSession(id, session){ useInterviewStore.getState().updateSession(id, session) }
export function clearSession(id){ useInterviewStore.getState().clearSession(id) }
