import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const API = `${import.meta.env.VITE_API_URL}/api`
const getToken = () => localStorage.getItem('xpose_token')

function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [resumeFile, setResumeFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [revealedChips, setRevealedChips] = useState(0)
  const [checklistStage, setChecklistStage] = useState(0)
  const [jobDescription, setJobDescription] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [githubUsername, setGithubUsername] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [extraLinks, setExtraLinks] = useState([])
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisError, setAnalysisError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [user, setUser] = useState(null)
  const fileInputRef = useRef(null)
  const reportRef = useRef(null)

  const extractedChips = ['React', 'Node.js', '3 projects found', '2 yrs experience']
  const checklistItems = [
    { id: 1, label: 'Extracting skills & tools', icon: 'ti-tags' },
    { id: 2, label: 'Listing experience & projects', icon: 'ti-briefcase' },
    { id: 3, label: 'Detecting target role', icon: 'ti-target-arrow' },
    { id: 4, label: 'Flagging claims to verify', icon: 'ti-shield-check' },
  ]

  const roles = [
    { id: 'webdev', label: 'Web Development', icon: 'ti-code', blurb: 'Frontend, backend or full stack' },
    { id: 'backend', label: 'Backend Engineering', icon: 'ti-server-2', blurb: 'APIs, databases, systems' },
    { id: 'frontend', label: 'Frontend Engineering', icon: 'ti-layout', blurb: 'UI, interactivity, performance' },
    { id: 'mobile', label: 'Mobile Development', icon: 'ti-device-mobile', blurb: 'iOS, Android, cross-platform' },
    { id: 'data', label: 'Data / ML', icon: 'ti-chart-dots', blurb: 'Analysis, models, pipelines' },
    { id: 'devops', label: 'DevOps / Cloud', icon: 'ti-cloud', blurb: 'Infra, CI/CD, reliability' },
    { id: 'qa', label: 'QA / SDET', icon: 'ti-bug', blurb: 'Testing, automation, quality' },
    { id: 'pm', label: 'Product Manager', icon: 'ti-clipboard-list', blurb: 'Tech product & strategy' },
    { id: 'design', label: 'UI/UX Design', icon: 'ti-pencil', blurb: 'Tech product design' },
  ]

  const roleFieldConfig = {
    webdev: { fields: [{ key: 'github', label: 'GitHub username', placeholder: 'e.g. torvalds', icon: 'ti-brand-github' }, { key: 'project', label: 'Live project URL', placeholder: 'https://your-project.com', icon: 'ti-link' }]},
    backend: { fields: [{ key: 'github', label: 'GitHub username', placeholder: 'e.g. torvalds', icon: 'ti-brand-github' }, { key: 'project', label: 'Live project / API URL', placeholder: 'https://your-api.com', icon: 'ti-link' }]},
    frontend: { fields: [{ key: 'github', label: 'GitHub username', placeholder: 'e.g. torvalds', icon: 'ti-brand-github' }, { key: 'project', label: 'Live project URL', placeholder: 'https://your-project.com', icon: 'ti-link' }]},
    mobile: { fields: [{ key: 'github', label: 'GitHub username', placeholder: 'e.g. torvalds', icon: 'ti-brand-github' }, { key: 'project', label: 'App store link or demo URL', placeholder: 'https://...', icon: 'ti-link' }]},
    data: { fields: [{ key: 'github', label: 'GitHub username', placeholder: 'e.g. torvalds', icon: 'ti-brand-github' }, { key: 'project', label: 'Kaggle or portfolio URL', placeholder: 'https://kaggle.com/you', icon: 'ti-link' }]},
    devops: { fields: [{ key: 'github', label: 'GitHub username', placeholder: 'e.g. torvalds', icon: 'ti-brand-github' }, { key: 'project', label: 'Infra repo or project URL', placeholder: 'https://...', icon: 'ti-link' }]},
    qa: { fields: [{ key: 'github', label: 'GitHub username', placeholder: 'e.g. torvalds', icon: 'ti-brand-github' }, { key: 'project', label: 'Test framework / project URL', placeholder: 'https://...', icon: 'ti-link' }]},
    pm: { fields: [{ key: 'github', label: 'Portfolio URL', placeholder: 'https://your-portfolio.com', icon: 'ti-world' }, { key: 'project', label: 'LinkedIn profile', placeholder: 'https://linkedin.com/in/you', icon: 'ti-brand-linkedin' }]},
    design: { fields: [{ key: 'github', label: 'Portfolio URL', placeholder: 'https://your-portfolio.com', icon: 'ti-world' }, { key: 'project', label: 'LinkedIn profile', placeholder: 'https://linkedin.com/in/you', icon: 'ti-brand-linkedin' }]},
  }

  const addOnTypes = [
    { id: 'linkedin', label: 'LinkedIn', icon: 'ti-brand-linkedin' },
    { id: 'leetcode', label: 'LeetCode', icon: 'ti-code' },
    { id: 'portfolio', label: 'Portfolio', icon: 'ti-world' },
    { id: 'other', label: 'Other link', icon: 'ti-link' },
  ]

  const sidebarSteps = [
    { id: 1, label: 'Upload Resume', desc: 'PDF parsed and skills extracted', icon: 'ti-file-text' },
    { id: 2, label: 'Job Description', desc: 'Paste the role you are targeting', icon: 'ti-briefcase' },
    { id: 3, label: 'Proof of Work', desc: 'Role + profiles that verify your claims', icon: 'ti-shield-check' },
    { id: 4, label: 'Generate Report', desc: 'AI analysis running', icon: 'ti-sparkles' },
    { id: 5, label: 'Your Report', desc: 'Score + gaps + action roadmap', icon: 'ti-bolt' },
  ]

  useEffect(() => {
    const stored = localStorage.getItem('xpose_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  const startUploadSimulation = (file) => {
    setResumeFile(file)
    setUploadProgress(0)
    setRevealedChips(0)
    setChecklistStage(0)
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress === 20) setChecklistStage(1)
      if (progress === 45) setChecklistStage(2)
      if (progress === 70) setChecklistStage(3)
      if (progress === 95) setChecklistStage(4)
      if (progress >= 100) { clearInterval(interval); setChecklistStage(5) }
    }, 140)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    startUploadSimulation(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    startUploadSimulation(file)
  }

  useEffect(() => {
    if (checklistStage === 5) {
      let i = 0
      const t = setInterval(() => {
        i += 1
        setRevealedChips(i)
        if (i >= extractedChips.length) clearInterval(t)
      }, 220)
      return () => clearInterval(t)
    }
  }, [checklistStage])

  const handleGenerateReport = async () => {
    setIsAnalyzing(true)
    setAnalysisError('')
    setCurrentStep(4)
    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('jobDescription', jobDescription)
      formData.append('role', selectedRole || 'webdev')
      formData.append('primaryLink', githubUsername || '')
      formData.append('secondaryLink', projectUrl || '')
      formData.append('extraLinks', JSON.stringify(extraLinks.map(l => l.value).filter(Boolean)))
      const { data } = await axios.post(`${API}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${getToken()}` }
      })
      setAnalysisResult(data.result)
      setCurrentStep(5)
    } catch (err) {
      setAnalysisError(err.response?.data?.message || 'Analysis failed. Try again.')
      setCurrentStep(3)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return
    setIsDownloading(true)
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#05050a', scale: 2, useCORS: true
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      let heightLeft = pdfHeight
      let position = 0
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
      heightLeft -= pdf.internal.pageSize.getHeight()
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
        heightLeft -= pdf.internal.pageSize.getHeight()
      }
      pdf.save(`xpose-report-${Date.now()}.pdf`)
    } catch (err) {
      console.error('PDF error:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  const addExtraLink = () => setExtraLinks((prev) => [...prev, { id: Date.now(), type: 'linkedin', value: '' }])
  const updateExtraLink = (id, key, val) => setExtraLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: val } : l)))
  const removeExtraLink = (id) => setExtraLinks((prev) => prev.filter((l) => l.id !== id))

  const activeFieldConfig = selectedRole ? roleFieldConfig[selectedRole] : null
  const proofRequiredFilled = activeFieldConfig ? githubUsername.trim() && projectUrl.trim() : false
  const progressPct = ((currentStep - 1) / 4) * 100

  const resetAll = () => {
    setCurrentStep(1); setResumeFile(null); setUploadProgress(0)
    setJobDescription(''); setSelectedRole(null); setGithubUsername('')
    setProjectUrl(''); setExtraLinks([]); setChecklistStage(0)
    setRevealedChips(0); setAnalysisResult(null); setAnalysisError('')
  }

  const getScoreColor = (score) => score >= 75 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171'
  const getScoreLabel = (score) => score >= 75 ? 'Strong' : score >= 50 ? 'Getting there' : 'Needs work'

  const skillsPieData = analysisResult ? [
    { name: 'Matched', value: analysisResult.skills_matched?.length || 0, color: '#4ade80' },
    { name: 'Missing', value: analysisResult.skills_missing?.length || 0, color: '#f87171' },
  ] : []

  const gapsBarData = analysisResult?.gaps?.map(g => ({
    name: g.title.length > 15 ? g.title.slice(0, 15) + '...' : g.title,
    value: g.severity === 'high' ? 3 : g.severity === 'medium' ? 2 : 1,
    fill: g.severity === 'high' ? '#f87171' : g.severity === 'medium' ? '#fbbf24' : '#a5b4fc'
  })) || []

  return (
    <div className="min-h-screen bg-[#05050a] text-white relative overflow-hidden flex flex-col">
      <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)' }} />
      <div className="absolute -bottom-24 left-24 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.14), transparent 70%)' }} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5 flex-shrink-0">
        <div className="text-xl font-semibold tracking-tight">
          <span className="text-white">X</span><span className="text-indigo-400">pose</span>
        </div>
        <Link to="/profile" className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
            style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)' }}>{getInitials(user?.name)}</div>
          <span className="text-sm">{user?.name?.split(' ')[0] || 'Profile'}</span>
          <i className="ti ti-chevron-down text-white/40 text-xs" />
        </Link>
      </div>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 flex-shrink-0 border-r border-white/5 px-4 py-8 gap-2">
          <p className="text-[10px] text-white/25 uppercase tracking-[2px] font-medium px-3 mb-3">Analysis Journey</p>
          {sidebarSteps.map((step, idx) => {
            const isDone = currentStep > step.id
            const isActive = currentStep === step.id
            const isLocked = currentStep < step.id
            return (
              <div key={step.id} className="relative">
                <div className="flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200"
                  style={{ background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent', border: isActive ? '1px solid rgba(129,140,248,0.25)' : '1px solid transparent', opacity: isLocked ? 0.35 : 1 }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5"
                    style={{ background: isDone ? 'rgba(34,197,94,0.18)' : isActive ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'rgba(255,255,255,0.05)', border: isLocked ? '1px solid rgba(255,255,255,0.1)' : 'none', boxShadow: isActive ? '0 0 14px rgba(99,102,241,0.45)' : 'none', color: isDone ? '#4ade80' : isActive ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                    {isDone ? <i className="ti ti-check text-xs" /> : <i className={`ti ${step.icon} text-xs`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: isActive ? '#e0e7ff' : isDone ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)' }}>{step.label}</p>
                    <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: isActive ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)' }}>{step.desc}</p>
                    {isActive && <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>In progress</span>}
                    {isDone && <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>Done</span>}
                  </div>
                </div>
                {idx < sidebarSteps.length - 1 && (
                  <div className="absolute left-7 ml-px w-px" style={{ top: '52px', height: '18px', background: isDone ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.07)' }} />
                )}
              </div>
            )
          })}
          <div className="mt-auto mx-2 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(129,140,248,0.15)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-white/40">Overall progress</p>
              <p className="text-[11px] text-indigo-300 font-medium">{Math.round(progressPct)}%</p>
            </div>
            <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#6366f1,#a855f7)' }} />
            </div>
            <p className="text-[11px] text-white/30 mt-2">Step {currentStep} of 5</p>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto px-4 md:px-10 py-8">
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-xs text-indigo-300 bg-indigo-400/10 border border-indigo-400/20 px-3 py-1 rounded-full mb-3">
                <i className={`ti ${sidebarSteps[currentStep - 1]?.icon} text-xs`} />Step {currentStep} of 5
              </span>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {currentStep === 1 && <>Drop your resume in.<br /><span className="text-indigo-400">We'll do the reading.</span></>}
                {currentStep === 2 && <>Paste the job description.<br /><span className="text-indigo-400">We'll map every requirement.</span></>}
                {currentStep === 3 && <>Pick your role.<br /><span className="text-indigo-400">Back it up with proof.</span></>}
                {currentStep === 4 && <>AI is analyzing<br /><span className="text-indigo-400">your entire profile.</span></>}
                {currentStep === 5 && <>Your readiness report<br /><span className="text-indigo-400">is ready.</span></>}
              </h1>
              <p className="text-white/40 text-sm mt-2">
                {currentStep === 1 && "PDF parsed instantly — every skill, project and claim extracted by AI"}
                {currentStep === 2 && "AI detects the role type and maps every requirement against your profile"}
                {currentStep === 3 && "Pick what you're targeting — we'll show you what proof actually matters"}
                {currentStep === 4 && "Sit tight, this takes 15-30 seconds"}
                {currentStep === 5 && "Visual breakdown of your readiness — download as PDF"}
              </p>
            </div>

            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-4">
                <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
                  <label onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
                    className="block border-[1.5px] border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200"
                    style={{ borderColor: isDragging ? 'rgba(168,85,247,0.6)' : 'rgba(129,140,248,0.3)', background: isDragging ? 'rgba(168,85,247,0.07)' : 'rgba(129,140,248,0.03)' }}>
                    <div className="relative w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                      <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: 'rgba(129,140,248,0.3)', animationDuration: '2.5s' }} />
                      <i className="ti ti-cloud-upload text-3xl relative" style={{ color: '#a5b4fc' }} />
                    </div>
                    <p className="text-sm text-white/80 mb-1">Drag your resume here or <span className="text-indigo-300 font-medium">browse files</span></p>
                    <p className="text-xs text-white/30 mb-5">PDF only · Max 5MB · Parsed in seconds</p>
                    <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                  {resumeFile && (
                    <div className="mt-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                          <i className="ti ti-file-type-pdf text-lg text-red-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium mb-1.5 truncate">{resumeFile.name}</p>
                          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%`, background: 'linear-gradient(90deg,#6366f1,#a855f7)' }} />
                          </div>
                        </div>
                        <span className="text-xs font-medium text-indigo-300 flex-shrink-0">{uploadProgress}%</span>
                      </div>
                      <div className="mt-5 flex flex-col gap-2.5">
                        {checklistItems.map((item) => {
                          const isDone = checklistStage > item.id || checklistStage === 5
                          const isActive = checklistStage === item.id
                          return (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                                style={{ background: isDone ? 'rgba(34,197,94,0.15)' : isActive ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'rgba(255,255,255,0.04)', border: !isDone && !isActive ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
                                {isDone ? <i className="ti ti-check text-[10px]" style={{ color: '#4ade80' }} /> : <i className={`ti ${item.icon} text-[10px]`} style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.25)' }} />}
                              </div>
                              <span className="text-xs" style={{ color: isDone ? 'rgba(255,255,255,0.6)' : isActive ? '#e0e7ff' : 'rgba(255,255,255,0.25)' }}>{item.label}</span>
                            </div>
                          )
                        })}
                      </div>
                      {checklistStage === 5 && revealedChips > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {extractedChips.slice(0, revealedChips).map((chip) => (
                            <span key={chip} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium"
                              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(129,140,248,0.3)', color: '#c4b5fd' }}>
                              <i className="ti ti-check text-[11px]" style={{ color: '#4ade80' }} />{chip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={() => setCurrentStep(2)} disabled={!resumeFile || uploadProgress < 100}
                  className="w-full rounded-xl py-3.5 text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 0 24px rgba(99,102,241,0.35)' }}>
                  Continue to job description <i className="ti ti-arrow-right text-base" />
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <i className="ti ti-circle-check text-base flex-shrink-0" style={{ color: '#4ade80' }} />
                  <p className="text-sm flex-1 truncate text-white/70">{resumeFile?.name}</p>
                  <button onClick={() => setCurrentStep(1)} className="text-xs text-indigo-300 hover:text-indigo-200 flex-shrink-0">Replace</button>
                </div>
                <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
                  <label className="text-xs text-white/40 uppercase tracking-widest font-medium block mb-2">Paste the full job description</label>
                  <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the entire job listing here..." rows={9}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/60 transition-all resize-none" />
                </div>
                <button onClick={() => setCurrentStep(3)} disabled={!jobDescription.trim()}
                  className="w-full rounded-xl py-3.5 text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 0 24px rgba(99,102,241,0.35)' }}>
                  Continue to proof of work <i className="ti ti-arrow-right text-base" />
                </button>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.18)' }}>
                    <i className="ti ti-circle-check text-sm flex-shrink-0" style={{ color: '#4ade80' }} />
                    <p className="text-xs text-white/60 truncate">{resumeFile?.name}</p>
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.18)' }}>
                    <i className="ti ti-circle-check text-sm flex-shrink-0" style={{ color: '#4ade80' }} />
                    <p className="text-xs text-white/60 truncate">Job description added</p>
                  </div>
                </div>
                {analysisError && (
                  <div className="px-4 py-3 rounded-xl text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>{analysisError}</div>
                )}
                <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
                  <p className="text-sm font-medium mb-1">What role are you targeting?</p>
                  <p className="text-xs text-white/35 mb-5">Select one — we'll show what proof actually matters</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {roles.map((role) => {
                      const isSelected = selectedRole === role.id
                      return (
                        <button key={role.id} onClick={() => setSelectedRole(role.id)}
                          className="relative flex flex-col items-center gap-2 py-4 px-2 rounded-xl text-center transition-all duration-200"
                          style={{ background: isSelected ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)', border: isSelected ? '1.5px solid rgba(129,140,248,0.55)' : '1px solid rgba(255,255,255,0.07)', boxShadow: isSelected ? '0 0 18px rgba(99,102,241,0.3)' : 'none', transform: isSelected ? 'translateY(-2px)' : 'translateY(0)' }}>
                          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: isSelected ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'rgba(255,255,255,0.05)' }}>
                            <i className={`ti ${role.icon} text-base`} style={{ color: isSelected ? '#fff' : '#a5b4fc' }} />
                          </div>
                          <span className="text-[11px] font-medium leading-tight" style={{ color: isSelected ? '#e0e7ff' : 'rgba(255,255,255,0.65)' }}>{role.label}</span>
                          <span className="text-[10px] leading-tight" style={{ color: isSelected ? '#c4b5fd' : 'rgba(255,255,255,0.25)' }}>{role.blurb}</span>
                          {isSelected && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#4ade80' }}><i className="ti ti-check text-[9px] text-black" /></span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
                {selectedRole && (
                  <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 flex flex-col gap-4">
                    <div>
                      <p className="text-sm font-medium mb-0.5">Back it up</p>
                      <p className="text-xs text-white/35">Key proof for {roles.find(r => r.id === selectedRole)?.label}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {[0, 1].map(i => (
                        <div key={i} className="flex flex-col gap-1.5">
                          <label className="text-xs text-white/40 uppercase tracking-widest font-medium flex items-center gap-1.5">
                            <i className={`ti ${activeFieldConfig.fields[i].icon} text-sm`} />{activeFieldConfig.fields[i].label}
                          </label>
                          <input type="text" value={i === 0 ? githubUsername : projectUrl}
                            onChange={(e) => i === 0 ? setGithubUsername(e.target.value) : setProjectUrl(e.target.value)}
                            placeholder={activeFieldConfig.fields[i].placeholder}
                            className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/60 transition-all" />
                        </div>
                      ))}
                    </div>
                    {extraLinks.length > 0 && (
                      <div className="flex flex-col gap-2.5">
                        {extraLinks.map((link) => (
                          <div key={link.id} className="flex items-center gap-2">
                            <select value={link.type} onChange={(e) => updateExtraLink(link.id, 'type', e.target.value)}
                              className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-3 text-xs text-white outline-none">
                              {addOnTypes.map((t) => <option key={t.id} value={t.id} className="bg-[#0a0a12]">{t.label}</option>)}
                            </select>
                            <input type="text" value={link.value} onChange={(e) => updateExtraLink(link.id, 'value', e.target.value)}
                              placeholder="Paste link..."
                              className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/60 transition-all" />
                            <button onClick={() => removeExtraLink(link.id)}
                              className="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                              <i className="ti ti-x text-sm" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={addExtraLink}
                      className="w-full rounded-xl py-2.5 text-xs font-medium border border-dashed flex items-center justify-center gap-1.5 transition-all hover:bg-white/[0.03]"
                      style={{ borderColor: 'rgba(129,140,248,0.3)', color: '#a5b4fc' }}>
                      <i className="ti ti-plus text-sm" /> Add another proof link
                    </button>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={handleGenerateReport}
                    className="flex-1 rounded-xl py-3 text-sm font-medium border border-white/8 text-white/40 hover:bg-white/[0.03] transition-all">
                    Skip — analyze without proof
                  </button>
                  <button onClick={handleGenerateReport} disabled={!proofRequiredFilled}
                    className="flex-[2] rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 0 24px rgba(99,102,241,0.35)' }}>
                    <i className="ti ti-sparkles text-sm" /> Generate report
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className="flex flex-col gap-4">
                <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-10 flex flex-col items-center gap-6 text-center">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', animationDuration: '1.5s' }} />
                    <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 0 30px rgba(99,102,241,0.5)' }}>
                      <i className="ti ti-sparkles text-3xl text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-medium mb-2">{isAnalyzing ? 'Analyzing your profile...' : 'Analysis complete!'}</h2>
                    <p className="text-sm text-white/40">{isAnalyzing ? 'AI is cross-checking your resume against the job description' : 'Your report is ready to view'}</p>
                  </div>
                  <div className="w-full flex flex-col gap-2.5">
                    {['Reading resume claims', 'Auditing proof of work', 'Mapping job requirements', 'Calculating readiness score', 'Building action roadmap'].map((item) => (
                      <div key={item} className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(129,140,248,0.15)' }}>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: isAnalyzing ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
                          {isAnalyzing ? <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse" /> : <i className="ti ti-check text-[10px] text-white" />}
                        </div>
                        <span className="text-xs text-white/60 text-left">{item}</span>
                      </div>
                    ))}
                  </div>
                  {!isAnalyzing && (
                    <button onClick={() => setCurrentStep(5)} className="w-full rounded-xl py-3.5 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 0 24px rgba(99,102,241,0.35)' }}>
                      View my report <i className="ti ti-arrow-right text-base" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5 — Visual Report */}
            {currentStep === 5 && analysisResult && (
              <div className="flex flex-col gap-4">

                {/* Download button */}
                <div className="flex justify-end">
                  <button onClick={handleDownloadPDF} disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 0 16px rgba(99,102,241,0.3)' }}>
                    <i className="ti ti-file-download text-base" />
                    {isDownloading ? 'Generating PDF...' : 'Download PDF Report'}
                  </button>
                </div>

                {/* Report content to capture */}
                <div ref={reportRef} className="flex flex-col gap-4" style={{ background: '#05050a', padding: '8px', borderRadius: '16px' }}>

                  {/* Header card */}
                  <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))', border: '1px solid rgba(129,140,248,0.25)' }}>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Xpose Career Analysis</p>
                    <h2 className="text-xl font-semibold">{user?.name || 'Your'} Readiness Report</h2>
                    <p className="text-xs text-white/30 mt-1">Role: {roles.find(r => r.id === selectedRole)?.label || selectedRole} · {new Date().toLocaleDateString()}</p>
                  </div>

                  {/* Score + Pie Chart row */}
                  <div className="grid grid-cols-2 gap-4">

                    {/* Circular Score */}
                    <div className="rounded-2xl p-6 flex flex-col items-center justify-center gap-3"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-xs text-white/40 uppercase tracking-widest">Readiness Score</p>
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                          <circle cx="50" cy="50" r="40" fill="none" stroke={getScoreColor(analysisResult.score)} strokeWidth="8"
                            strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysisResult.score / 100)}`}
                            style={{ transition: 'stroke-dashoffset 1s ease' }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold" style={{ color: getScoreColor(analysisResult.score) }}>{analysisResult.score}</span>
                          <span className="text-[10px] text-white/40">/100</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ background: `${getScoreColor(analysisResult.score)}20`, color: getScoreColor(analysisResult.score) }}>
                        {getScoreLabel(analysisResult.score)}
                      </span>
                    </div>

                    {/* Skills Pie Chart */}
                    <div className="rounded-2xl p-6 flex flex-col items-center gap-3"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-xs text-white/40 uppercase tracking-widest">Skills Breakdown</p>
                      <PieChart width={130} height={130}>
                        <Pie data={skillsPieData} cx={60} cy={60} innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                          {skillsPieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} contentStyle={{ background: '#0d0d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                      </PieChart>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#4ade80' }} />
                          <span className="text-[11px] text-white/60">Matched ({analysisResult.skills_matched?.length || 0})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#f87171' }} />
                          <span className="text-[11px] text-white/60">Missing ({analysisResult.skills_missing?.length || 0})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="rounded-2xl p-5" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(129,140,248,0.2)' }}>
                    <p className="text-xs text-indigo-300 uppercase tracking-widest font-medium mb-2">AI Summary</p>
                    <p className="text-sm text-white/70 leading-relaxed">{analysisResult.summary}</p>
                  </div>

                  {/* Gaps Bar Chart */}
                  {gapsBarData.length > 0 && (
                    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-4">Gap Severity</p>
                      <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={gapsBarData} barSize={24}>
                          <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis hide />
                          <Tooltip contentStyle={{ background: '#0d0d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                            formatter={(val) => [val === 3 ? 'High' : val === 2 ? 'Medium' : 'Low', 'Severity']} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {gapsBarData.map((entry, index) => (
                              <Cell key={index} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Skills matched */}
                  {analysisResult.skills_matched?.length > 0 && (
                    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-3">✅ Skills Matched</p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.skills_matched.map((skill) => (
                          <span key={skill} className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills missing */}
                  {analysisResult.skills_missing?.length > 0 && (
                    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-3">❌ Skills Missing</p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.skills_missing.map((skill) => (
                          <span key={skill} className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gaps detail */}
                  {analysisResult.gaps?.length > 0 && (
                    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Gaps Found</p>
                      {analysisResult.gaps.map((gap, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <span className="text-xs px-2 py-0.5 rounded-full h-fit flex-shrink-0 font-medium"
                            style={{ background: gap.severity === 'high' ? 'rgba(239,68,68,0.12)' : gap.severity === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(99,102,241,0.12)', color: gap.severity === 'high' ? '#f87171' : gap.severity === 'medium' ? '#fbbf24' : '#a5b4fc' }}>
                            {gap.severity}
                          </span>
                          <div>
                            <p className="text-xs font-medium text-white/80">{gap.title}</p>
                            <p className="text-xs text-white/40 mt-0.5">{gap.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action roadmap */}
                  {analysisResult.action_items?.length > 0 && (
                    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(129,140,248,0.15)' }}>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-medium">🗺️ Action Roadmap</p>
                      {analysisResult.action_items.map((item, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(129,140,248,0.12)' }}>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', color: '#fff', minWidth: '24px' }}>{i + 1}</div>
                          <div>
                            <p className="text-xs font-medium text-white/80">{item.title}</p>
                            <p className="text-xs text-white/40 mt-0.5">{item.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="text-center py-3">
                    <p className="text-[10px] text-white/20">Generated by <span className="text-indigo-400">Xpose</span> · AI Career Gap Analyzer</p>
                  </div>
                </div>

                <button onClick={resetAll}
                  className="w-full rounded-xl py-3 text-sm font-medium border border-white/10 hover:bg-white/[0.04] transition-all">
                  Run a new analysis
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default DashboardPage