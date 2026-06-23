import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupAPI } from '../api/auth'

function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await signupAPI(form)
      localStorage.setItem('xpose_token', data.token)
      localStorage.setItem('xpose_user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    console.log('Google signup clicked')
  }

  const getPasswordStrength = () => {
    const len = form.password.length
    if (len === 0) return null
    if (len < 4) return { label: 'Weak', color: '#ef4444', width: '25%' }
    if (len < 7) return { label: 'Fair', color: '#f59e0b', width: '60%' }
    return { label: 'Strong', color: '#10b981', width: '100%' }
  }

  const strength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">

      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0f]/80 border-b border-white/10">
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          <Link to="/" className="text-xl md:text-2xl font-semibold tracking-tight">
            <span className="text-white">X</span>
            <span className="text-indigo-400">pose</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/signup" className="text-sm text-white/50 hover:text-white px-4 py-2 transition">
              Sign Up
            </Link>
            <Link to="/login" className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-5 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/20">
              Log In
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Create your <span className="text-indigo-400">Xpose</span> account
            </h1>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              <div className="flex flex-col gap-2">
                <label className="text-xs text-white/40 uppercase tracking-widest font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-white/40 uppercase tracking-widest font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-white/40 uppercase tracking-widest font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    required
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition-all pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30 hover:text-white/60 transition"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                {strength && (
                  <div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: strength.width, background: strength.color }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: strength.color }}>
                      {strength.label} password
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs text-white/25 leading-relaxed">
                By creating an account you agree to our{' '}
                <span className="text-indigo-400 cursor-pointer hover:underline">Terms of Service</span>
                {' '}and{' '}
                <span className="text-indigo-400 cursor-pointer hover:underline">Privacy Policy</span>
              </p>

              {error && (
                <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] text-white font-semibold text-sm py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 mt-1"
              >
                {loading ? 'Creating account...' : 'Create Free Account →'}
              </button>

              
            </form>

            <p className="text-center text-white/30 text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
                Log in here
              </Link>
            </p>

          </div>
        </div>
      </div>

    </div>
  )
}

export default SignupPage