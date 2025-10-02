require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_assistant'
const PORT = process.env.PORT || 4000

mongoose.connect(MONGODB_URI)
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err))

const candidateSchema = new mongoose.Schema({
  profile: Object,
  answers: Array,
  finalScore: Number,
  resumeUrl: String,
  createdAt: { type: Date, default: Date.now }
})

const Candidate = mongoose.model('Candidate', candidateSchema)

app.post('/api/candidates', async (req, res) => {
  try {
    const { profile, answers, finalScore, resumeUrl } = req.body
    const c = new Candidate({ profile, answers, finalScore, resumeUrl })
    await c.save()
    res.json({ ok: true, id: c._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: err.message })
  }
})

app.get('/api/candidates', async (req, res) => {
  try {
    const list = await Candidate.find().sort({ createdAt: -1 }).lean()
    res.json({ ok: true, candidates: list })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

app.get('/api/candidates/:id', async (req, res) => {
  try {
    const c = await Candidate.findById(req.params.id).lean()
    if (!c) return res.status(404).json({ ok: false, error: 'Not found' })
    res.json({ ok: true, candidate: c })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`))
