function delay(ms){ return new Promise(r=>setTimeout(r, ms)) }

export async function login(payload){
  await delay(600)
  if (!payload.email || !payload.password) return { ok:false, error: 'Missing credentials' }
  // fake token
  return { ok: true, token: 'fake-token-123', user: { email: payload.email, role: payload.role || 'interviewee' } }
}

export async function register(payload){
  await delay(800)
  if (!payload.email || !payload.password) return { ok:false, error: 'Missing data' }
  return { ok: true, token: 'fake-token-456', user: { email: payload.email, role: payload.role || 'interviewee' } }
}
