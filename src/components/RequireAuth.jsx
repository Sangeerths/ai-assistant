import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

// allowedRole may be a string or an array of strings. If provided, user must have one of these roles.
export default function RequireAuth({ children, allowedRole }){
  const { user } = useAuth()
  const loc = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />

  if (allowedRole) {
    const allowed = Array.isArray(allowedRole) ? allowedRole : [allowedRole]
    if (!allowed.includes(user.role)) {
      // redirect to their own dashboard if role mismatch
      if (user.role === 'interviewer') return <Navigate to="/interviewer/dashboard" replace />
      return <Navigate to="/interviewee/dashboard" replace />
    }
  }

  return children
}
