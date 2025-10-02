const QUESTIONS = {
  easy: [
    'Explain the virtual DOM in React in simple terms.',
    'What is the difference between let and var in JavaScript?'
  ],
  medium: [
    'How would you optimize performance for a React application? Describe two strategies.',
    'Explain event delegation and why it is useful in the browser.'
  ],
  hard: [
    'Design the backend architecture to support a realtime collaborative editor.',
    'Explain how you would handle database migrations for a zero-downtime deployment.'
  ]
}

export function generateQuestions(){
  // Return 6 questions: 2 easy, 2 medium, 2 hard
  return [
    { level: 'easy', text: QUESTIONS.easy[0], time: 20 },
    { level: 'easy', text: QUESTIONS.easy[1], time: 20 },
    { level: 'medium', text: QUESTIONS.medium[0], time: 60 },
    { level: 'medium', text: QUESTIONS.medium[1], time: 60 },
    { level: 'hard', text: QUESTIONS.hard[0], time: 120 },
    { level: 'hard', text: QUESTIONS.hard[1], time: 120 }
  ]
}

export function scoreAnswer(question, answer){
  // Mock scoring: score by length and presence of keywords
  if (!answer || answer.trim().length === 0) return { score: 0, reason: 'No answer' }
  const len = answer.trim().length
  let base = Math.min(10, Math.floor(len / 20))
  // bonus for relevant keywords (very fuzzy)
  const keywords = ['react','node','database','performance','api','architecture']
  const found = keywords.reduce((n, k) => n + (answer.toLowerCase().includes(k) ? 1 : 0), 0)
  base += Math.min(5, found)
  const score = Math.min(100, base * 8)
  return { score, reason: 'Mock evaluation based on length & keywords' }
}
