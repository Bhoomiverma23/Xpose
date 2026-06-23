import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import PDFParser from 'pdf2json'
import Groq from 'groq-sdk'
import authMiddleware from '../middleware/authMiddleware.js'
import Report from '../models/Report.js'

const router = express.Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `resume_${Date.now()}${path.extname(file.originalname)}`)
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('Only PDF files allowed'), false)
  },
  limits: { fileSize: 5 * 1024 * 1024 }
})

const extractTextFromPDF = (filePath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()
    pdfParser.on('pdfParser_dataReady', (data) => {
      const text = data.Pages.map(page =>
        page.Texts.map(t => {
          try {
            return decodeURIComponent(t.R.map(r => r.T).join(''))
          } catch {
            return t.R.map(r => r.T).join('')
          }
        }).join(' ')
      ).join('\n')
      resolve(text)
    })
    pdfParser.on('pdfParser_dataError', reject)
    pdfParser.loadPDF(filePath)
  })
}

router.post('/analyze', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription, role, primaryLink, secondaryLink, extraLinks } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Resume PDF is required' })
    }
    if (!jobDescription || !role) {
      return res.status(400).json({ message: 'Job description and role are required' })
    }

    const resumeText = await extractTextFromPDF(req.file.path)
    fs.unlinkSync(req.file.path)

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: 'Could not extract text from PDF. Please upload a text-based PDF.'
      })
    }

    const extras = extraLinks ? JSON.parse(extraLinks) : []

    const prompt = `You are Xpose, a brutally honest AI career gap analyzer.

A ${role} job seeker has provided:

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

PROOF OF WORK:
Primary: ${primaryLink || 'Not provided'}
Secondary: ${secondaryLink || 'Not provided'}
Extra links: ${extras.join(', ') || 'None'}

Analyze this person's profile against the job description. Be specific, honest, and actionable.

Return your response as a valid JSON object with this exact structure:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence honest summary of their readiness>",
  "gaps": [
    { "title": "<gap name>", "detail": "<specific detail>", "severity": "<high|medium|low>" }
  ],
  "skills_matched": ["<skill>", "<skill>"],
  "skills_missing": ["<skill>", "<skill>"],
  "action_items": [
    { "title": "<what to do>", "reason": "<why this matters>" }
  ]
}

Return ONLY the JSON object, no other text.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024
    })

    const aiResponse = completion.choices[0].message.content

    let result
    try {
      const cleaned = aiResponse.replace(/```json|```/g, '').trim()
      result = JSON.parse(cleaned)
    } catch {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : null
    }

    if (!result) {
      return res.status(500).json({ message: 'AI response could not be parsed' })
    }

    const report = await Report.create({
      user: req.user.id,
      resumeText,
      jobDescription,
      role,
      proofLinks: {
        primary: primaryLink || '',
        secondary: secondaryLink || '',
        extras
      },
      result
    })

    res.status(201).json({
      reportId: report._id,
      result
    })

  } catch (err) {
    console.error('Analysis error:', err)
    res.status(500).json({ message: 'Analysis failed', error: err.message })
  }
})

router.get('/reports', authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id })
      .select('role result.score createdAt jobDescription')
      .sort({ createdAt: -1 })
    res.json(reports)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/reports/:id', authMiddleware, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user.id
    })
    if (!report) return res.status(404).json({ message: 'Report not found' })
    res.json(report)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router