function Features() {
  return (
    <section className="px-12 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-medium text-white mb-3">
          What Xpose <em className="text-indigo-400 not-italic">exposes</em>
        </h2>
        <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
          No fluff, no generic tips — only the gaps between you and that job, for any role you're targeting
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-indigo-400">🛡️</span>
          </div>
          <h3 className="text-sm font-medium text-white mb-2">Resume vs reality mismatch</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Catches every skill you claimed but can't actually back up with real work or experience.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-indigo-400">🎯</span>
          </div>
          <h3 className="text-sm font-medium text-white mb-2">JD skill gap map</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Shows exactly which skills the job requires that are missing from your profile entirely.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-indigo-400">🗺️</span>
          </div>
          <h3 className="text-sm font-medium text-white mb-2">Personalized action roadmap</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Get a role-specific action plan — projects to build, skills to learn, profiles to strengthen.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-indigo-400">📈</span>
          </div>
          <h3 className="text-sm font-medium text-white mb-2">Progress tracking</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Re-analyze anytime. Watch your readiness score climb as you actually improve.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-indigo-400">🔗</span>
          </div>
          <h3 className="text-sm font-medium text-white mb-2">Multi-profile verification</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Connect GitHub, LinkedIn, LeetCode or a portfolio — Xpose uses whatever proof you have.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-indigo-400">💼</span>
          </div>
          <h3 className="text-sm font-medium text-white mb-2">Works for any role</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Software engineer, designer, data analyst, product manager — Xpose adapts to the role you want.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Features