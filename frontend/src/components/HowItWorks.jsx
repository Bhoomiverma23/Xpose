import { useState } from "react"

const steps = [
  {
    num: "01",
    icon: "📄",
    title: "Upload your resume",
    desc: "PDF parsed and every skill, experience and claim extracted by AI",
    side: "left",
    detail: [
      { color: "text-indigo-400", text: "Skills & tools extracted from PDF" },
      { color: "text-indigo-400", text: "Experience and projects listed" },
      { color: "text-indigo-400", text: "All claims ready to be verified" },
    ],
    placeholder: "Your resume tells a story. Xpose finds out if it holds up.",
  },
  {
    num: "02",
    icon: "💼",
    title: "Paste the job description",
    desc: "AI detects the role type and maps every requirement against your profile",
    side: "right",
    detail: [
      { color: "text-green-400",  text: "Role type detected automatically" },
      { color: "text-yellow-400", text: "Required skills identified from JD" },
      { color: "text-red-400",    text: "Missing experience flagged instantly" },
    ],
    placeholder: "What does this role actually need vs what you actually have?",
  },
  {
    num: "03",
    icon: "🔗",
    title: "Add your proof of work",
    desc: "Optional but powerful — add whatever is relevant to your role",
    side: "left",
    detail: [
      { color: "text-indigo-400", text: "GitHub — for developers" },
      { color: "text-indigo-400", text: "LinkedIn — for any role" },
      { color: "text-indigo-400", text: "Portfolio / LeetCode — for designers & SWE" },
    ],
    placeholder: "Not on GitHub? No problem. Add what you have — LinkedIn, portfolio, LeetCode.",
  },
  {
    num: "04",
    icon: "⚡",
    title: "Get your Xpose report",
    desc: "Readiness score + every gap exposed + exactly what to do next",
    side: "right",
    detail: [
      { color: "text-indigo-400", text: "Readiness score: 62 / 100" },
      { color: "text-red-400",    text: "2 critical gaps found" },
      { color: "text-yellow-400", text: "3 action items to close the gaps" },
    ],
    placeholder: "No more guessing. A score, gap list, and action roadmap in one report.",
  },
]

const skills = [
  { label: "Resume vs JD match",      pct: 78, color: "bg-green-500",  textColor: "text-green-400" },
  { label: "Missing skills",          pct: 12, color: "bg-red-500",    textColor: "text-red-400" },
  { label: "Proof of work verified",  pct: 55, color: "bg-yellow-500", textColor: "text-yellow-400" },
  { label: "Experience level match",  pct: 61, color: "bg-indigo-500", textColor: "text-indigo-400" },
]


function HowItWorks() {
  const [active, setActive] = useState(0)

  return (
    <section id="how-it-works" className="px-8 py-16 bg-[#0a0a0f]">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-3xl font-medium text-white mb-3">
          How <em className="text-indigo-400 not-italic">Xpose</em> works
        </h2>
        <p className="text-white/35 text-sm max-w-xs mx-auto leading-relaxed">
        Resume + job description + your proof of work — one brutal honest report before a recruiter sees you
        </p>
      </div>

      {/* Timeline */}
      <div className="max-w-2xl mx-auto relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.07] -translate-x-1/2" />

        {steps.map((step, i) => {
          const isActive = active === i
          const isDone   = active > i
          const isLeft   = step.side === "left"

          const Card = (
            <div
              onClick={() => setActive(i)}
              className={`rounded-xl p-4 border cursor-pointer transition-all duration-300
                ${isActive ? "border-indigo-500/40 bg-indigo-500/[0.05]"
                  : isDone  ? "border-green-500/20 bg-white/[0.02]"
                  : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14]"}`}
            >
              <p className={`text-[10px] font-semibold tracking-[1.5px] uppercase mb-2
                ${isActive ? "text-indigo-400/70" : isDone ? "text-green-400/70" : "text-white/20"}`}>
                Step {step.num}
              </p>
              <h3 className="text-sm font-medium text-white/90 mb-1">{step.title}</h3>
              <p className="text-xs text-white/30 leading-relaxed">{step.desc}</p>

              {(isActive || isDone) && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-col gap-1.5">
                  {step.detail.map((d, di) => (
                    <div key={di} className="flex items-center gap-2 text-[11px] text-white/40">
                      <span className={`text-xs ${d.color}`}>•</span>
                      {d.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )

          const Placeholder = (
            <p className="text-xs text-white/[0.12] leading-relaxed pt-2 px-1">
              {step.placeholder}
            </p>
          )

          return (
            <div key={i} className="grid grid-cols-[1fr_60px_1fr] items-start mb-0">
              {/* Left column */}
              <div className="pr-6 pb-12">
                {isLeft ? Card : Placeholder}
              </div>

              {/* Center node */}
              <div className="flex flex-col items-center pt-1 z-10">
                <button
                  onClick={() => setActive(i)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300
                    ${isActive ? "border-indigo-500 bg-indigo-500/10"
                      : isDone  ? "border-green-500/60 bg-green-500/[0.07]"
                      : "border-white/10 bg-[#0a0a0f]"}`}
                >
                  <span className={`text-lg transition-all duration-300
                    ${isActive ? "opacity-100" : isDone ? "opacity-70" : "opacity-20"}`}>
                    {step.icon}
                  </span>
                </button>
                <span className={`text-[9px] font-bold tracking-[2px] mt-1.5 transition-colors duration-300
                  ${isActive ? "text-indigo-500" : isDone ? "text-green-500" : "text-white/15"}`}>
                  {step.num}
                </span>
                {i < steps.length - 1 && (
                  <div className={`w-px flex-1 min-h-[52px] mt-1 transition-colors duration-300
                    ${isDone ? "bg-green-500/40" : "bg-white/[0.07]"}`} />
                )}
              </div>

              {/* Right column */}
              <div className="pl-6 pb-12">
                {!isLeft ? Card : Placeholder}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default HowItWorks