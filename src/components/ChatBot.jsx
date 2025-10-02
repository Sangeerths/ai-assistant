import React, { useEffect, useState, useRef } from 'react'
import { generateQuestions, scoreAnswer } from '../services/ai'
import { updateSession, getSession } from '../store/useInterviewStore'

export default function ChatBot({ sessionId, onFinish, initial }){
  // initial may contain existing session state
  const stored = initial || getSession(sessionId)
  const [questions] = useState(() => stored?.questions || generateQuestions())
  const [index, setIndex] = useState(stored?.index || 0)
  const [answers, setAnswers] = useState(stored?.answers || [])
  const [timeLeft, setTimeLeft] = useState(() => stored?.timeLeft ?? (questions[0]?.time || 20))
  const [input, setInput] = useState('')
  const [running, setRunning] = useState(stored?.running ?? true)
  const timerRef = useRef(null)

  useEffect(()=>{
    if (!running) return
    timerRef.current = setInterval(()=>{
      setTimeLeft(t => {
        if (t <= 1){
          handleSubmit('')
          return 0
        }
        return t-1
      })
    }, 1000)
    return ()=> clearInterval(timerRef.current)
  }, [index, running])

  useEffect(()=>{
    // persist session periodically
    updateSession(sessionId, { questions, index, answers, timeLeft, running })
  }, [index, answers, timeLeft, running, sessionId])

  const handleSubmit = (forcedAnswer) => {
    const ans = forcedAnswer !== undefined ? forcedAnswer : input
    const q = questions[index]
    const res = scoreAnswer(q, ans)
    const record = { question: q.text, level: q.level, time: q.time, answer: ans, score: res.score, reason: res.reason }
    const newAnswers = [...answers, record]
    setAnswers(newAnswers)
    setInput('')
    clearInterval(timerRef.current)
    if (index + 1 >= questions.length){
      // finish
      setRunning(false)
      const finalScore = Math.round(newAnswers.reduce((s,a)=>s+a.score,0) / newAnswers.length)
      updateSession(sessionId, { questions, index: index+1, answers: newAnswers, finalScore, finished:true })
      if (onFinish) onFinish({ finalScore, answers: newAnswers })
      return
    }
    // move to next
    const nextIdx = index + 1
    setIndex(nextIdx)
    setTimeLeft(questions[nextIdx].time)
  }

  const toggleRunning = () => {
    setRunning(r=>!r)
  }

  const q = questions[index]

  return (
    <div>
      <div style={{marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <strong>Question {index+1}/{questions.length} ({q.level})</strong>
        <div>
          <button className="btn link" onClick={toggleRunning}>{running ? 'Pause' : 'Resume'}</button>
        </div>
      </div>
      <div style={{padding:12, background:'#041026', borderRadius:8, marginBottom:8}}>{q.text}</div>
      <div style={{marginBottom:8}}>Time left: {timeLeft}s</div>
      <textarea value={input} onChange={e=>setInput(e.target.value)} rows={6} style={{width:'100%', boxSizing:'border-box'}} />
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={()=>handleSubmit()} className="btn primary">Submit Answer</button>
        <button onClick={()=>handleSubmit('')} className="btn link">Skip / Submit empty</button>
      </div>
    </div>
  )
}
