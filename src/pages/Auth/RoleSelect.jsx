import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RoleSelect(){
  const [role, setRole] = useState('interviewee')
  const nav = useNavigate()

  const submit = () => {
    // set role in app context / backend then navigate
    nav('/')
  }

  return (
    <div style={{padding: 20}}>
      <h2>Select your role</h2>
      <div>
        <label><input type="radio" name="role" value="interviewer" checked={role==='interviewer'} onChange={()=>setRole('interviewer')}/> Interviewer</label>
        <label style={{marginLeft:12}}><input type="radio" name="role" value="interviewee" checked={role==='interviewee'} onChange={()=>setRole('interviewee')}/> Interviewee</label>
      </div>
      <button onClick={submit} style={{marginTop:12}}>Continue</button>
    </div>
  )
}
