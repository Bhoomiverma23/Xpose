import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  proofLinks: {
    primary: { type: String, default: '' },
    secondary: { type: String, default: '' },
    extras: [{ type: String }]
  },
  result: {
    score: { type: Number },
    summary: { type: String },
    gaps: [{ title: String, detail: String, severity: String }],
    skills_matched: [{ type: String }],
    skills_missing: [{ type: String }],
    action_items: [{ title: String, reason: String }]
  }
}, { timestamps: true })

export default mongoose.model('Report', reportSchema)