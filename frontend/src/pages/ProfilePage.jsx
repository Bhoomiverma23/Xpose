import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = `${import.meta.env.VITE_API_URL}/api`
const getToken = () => localStorage.getItem('xpose_token')

/* ── tiny modal ───────────────────────────────────────── */
function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0d0d16',
          border: '1px solid rgba(129,140,248,0.25)',
          borderRadius: 20, padding: '28px 28px 24px',
          width: '100%', maxWidth: 420, margin: '0 16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 500, color: '#fff' }}>{title}</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

const closeBtn = {
  background: 'rgba(255,255,255,0.07)', border: 'none',
  color: 'rgba(255,255,255,0.5)', borderRadius: 8,
  width: 28, height: 28, cursor: 'pointer', fontSize: 13,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(129,140,248,0.2)', borderRadius: 10,
  padding: '10px 14px', color: '#fff', fontSize: 14,
  outline: 'none', boxSizing: 'border-box', marginTop: 6,
}
const labelStyle = { fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block' }
const saveBtn = {
  marginTop: 20, width: '100%', padding: '11px',
  background: 'linear-gradient(135deg,#6366f1,#a855f7)',
  border: 'none', borderRadius: 10, color: '#fff',
  fontSize: 14, fontWeight: 500, cursor: 'pointer',
}

/* ── helpers ──────────────────────────────────────────── */
const getInitials = name =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??'

const fmtDate = dateStr =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

const scoreColor = s => {
  if (s >= 75) return '#34d399'
  if (s >= 50) return '#fbbf24'
  return '#f87171'
}

/* ═══════════════════════════════════════════════════════ */
function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('history')

  /* modals */
  const [editOpen, setEditOpen] = useState(false)
  const [pwOpen, setPwOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const toast = msg => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${getToken()}` }
        const [userRes, reportsRes] = await Promise.all([
          axios.get(`${API}/auth/me`, { headers }),
          axios.get(`${API}/reports`, { headers }),
        ])
        setUser(userRes.data)
        setReports(reportsRes.data)
        setEditName(userRes.data.name || '')
        setEditEmail(userRes.data.email || '')
      } catch {
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('xpose_token')
    localStorage.removeItem('xpose_user')
    navigate('/login')
  }

  const handleEditSave = async () => {
    setEditSaving(true)
    try {
      const headers = { Authorization: `Bearer ${getToken()}` }
      const res = await axios.put(`${API}/auth/me`, { name: editName, email: editEmail }, { headers })
      setUser(res.data)
      toast('Profile updated!')
      setEditOpen(false)
    } catch {
      toast('Failed to update profile.')
    } finally {
      setEditSaving(false)
    }
  }

  const handlePwSave = async () => {
    if (pw.next !== pw.confirm) { toast('Passwords do not match.'); return }
    if (pw.next.length < 6) { toast('Password must be at least 6 characters.'); return }
    setPwSaving(true)
    try {
      const headers = { Authorization: `Bearer ${getToken()}` }
      await axios.put(`${API}/auth/password`, { currentPassword: pw.current, newPassword: pw.next }, { headers })
      toast('Password changed!')
      setPwOpen(false)
      setPw({ current: '', next: '', confirm: '' })
    } catch {
      toast('Failed to change password.')
    } finally {
      setPwSaving(false)
    }
  }

  const bestScore = reports.length ? Math.max(...reports.map(r => r.result?.score ?? 0)) : null
  const avgScore = reports.length
    ? Math.round(reports.reduce((a, r) => a + (r.result?.score ?? 0), 0) / reports.length)
    : null
  const latestScore = reports[0]?.result?.score ?? null

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#05050a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading…</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#05050a', color: '#fff', fontFamily: 'inherit' }}>

      {/* ── toast ── */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a2e', border: '1px solid rgba(129,140,248,0.35)',
          borderRadius: 10, padding: '10px 20px', fontSize: 13,
          color: '#a5b4fc', zIndex: 100, whiteSpace: 'nowrap',
        }}>
          {toastMsg}
        </div>
      )}

      {/* ── header ── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', fontSize: 20, fontWeight: 600, letterSpacing: '-0.5px' }}>
          <span style={{ color: '#fff' }}>X</span><span style={{ color: '#818cf8' }}>pose</span>
        </Link>
        <nav style={{ display: 'flex', gap: 20, fontSize: 13 }}>
          <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Dashboard</Link>
          <span style={{ color: '#818cf8' }}>Profile</span>
        </nav>
      </header>

      {/* ── body ── */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>

        {/* ════ LEFT SIDEBAR ════ */}
        <aside style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* avatar card */}
          <div style={{
            background: '#0d0d16', border: '1px solid rgba(129,140,248,0.18)',
            borderRadius: 20, padding: '28px 20px 24px', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* decorative ring */}
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 200, height: 200,
              borderRadius: '50%', border: '1px solid rgba(129,140,248,0.07)',
              pointerEvents: 'none',
            }} />

            {/* avatar */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 500, color: '#fff',
              }}>
                {getInitials(user?.name)}
              </div>
              <div style={{
                position: 'absolute', inset: -3, borderRadius: '50%',
                border: '1.5px solid rgba(129,140,248,0.45)',
              }} />
              {/* online dot */}
              <div style={{
                position: 'absolute', bottom: 2, right: 2,
                width: 12, height: 12, borderRadius: '50%',
                background: '#34d399', border: '2px solid #05050a',
              }} />
            </div>

            <h1 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 500 }}>{user?.name}</h1>
            <p style={{ margin: '0 0 12px', fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>{user?.email}</p>

            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11,
              padding: '4px 12px', borderRadius: 20,
              background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.22)',
              color: '#a5b4fc',
            }}>
              ✦ Free plan
            </span>

            <div style={{
              margin: '18px 0 0', paddingTop: 18,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              fontSize: 11, color: 'rgba(255,255,255,0.28)',
            }}>
              Member since {user?.createdAt ? fmtDate(user.createdAt) : '…'}
            </div>
          </div>

          {/* stats column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Total reports', val: reports.length, icon: '📄' },
              { label: 'Best score', val: bestScore ?? '--', icon: '🏆', color: bestScore ? scoreColor(bestScore) : undefined },
              { label: 'Average score', val: avgScore ?? '--', icon: '📊', color: avgScore ? scoreColor(avgScore) : undefined },
              { label: 'Latest score', val: latestScore ?? '--', icon: '⚡', color: latestScore ? scoreColor(latestScore) : undefined },
            ].map(s => (
              <div key={s.label} style={{
                background: '#0d0d16', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(129,140,248,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 500, color: s.color ?? '#c4b5fd' }}>{s.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* account actions */}
          <div style={{
            background: '#0d0d16', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18, overflow: 'hidden',
          }}>
            <p style={{
              margin: 0, padding: '14px 16px 10px',
              fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Account
            </p>
            {[
              { icon: '✏️', label: 'Edit profile', action: () => setEditOpen(true) },
              { icon: '🔒', label: 'Change password', action: () => setPwOpen(true) },
            ].map((item, i) => (
              <button key={i} onClick={item.action} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 16px', background: 'transparent',
                border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.75)', fontSize: 13, cursor: 'pointer',
                textAlign: 'left', transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>›</span>
              </button>
            ))}
            <button onClick={() => setLogoutOpen(true)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 16px', background: 'transparent',
              border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)',
              color: '#f87171', fontSize: 13, cursor: 'pointer',
              textAlign: 'left', transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 15 }}>🚪</span>
              <span style={{ flex: 1 }}>Log out</span>
            </button>
          </div>
        </aside>

        {/* ════ RIGHT PANEL ════ */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* tabs */}
          <div style={{
            display: 'flex', gap: 4,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: 4,
          }}>
            {[
              { key: 'history', label: 'Analysis history', count: reports.length },
              { key: 'insights', label: 'Insights' },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                flex: 1, padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                background: activeTab === t.key ? 'rgba(99,102,241,0.25)' : 'transparent',
                color: activeTab === t.key ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
              }}>
                {t.label}
                {t.count !== undefined && (
                  <span style={{
                    marginLeft: 6, fontSize: 11, padding: '1px 7px', borderRadius: 20,
                    background: activeTab === t.key ? 'rgba(129,140,248,0.25)' : 'rgba(255,255,255,0.08)',
                    color: activeTab === t.key ? '#c4b5fd' : 'rgba(255,255,255,0.35)',
                  }}>{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── HISTORY TAB ── */}
          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reports.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '60px 20px',
                  background: '#0d0d16', borderRadius: 18,
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.25)', fontSize: 14,
                }}>
                  No reports yet — run your first analysis!
                </div>
              ) : reports.map((r, idx) => (
                <div key={r._id} style={{
                  background: '#0d0d16', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(129,140,248,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                >
                  {/* rank */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 500,
                  }}>
                    {idx + 1}
                  </div>

                  {/* icon */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(129,140,248,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    📋
                  </div>

                  {/* meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#fff' }}>
                      {r.role} role analysis
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                      {fmtDate(r.createdAt)}
                    </p>
                  </div>

                  {/* score pill + bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <div style={{ width: 80, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 4,
                        width: `${r.result?.score ?? 0}%`,
                        background: `linear-gradient(90deg,#6366f1,${scoreColor(r.result?.score ?? 0)})`,
                        transition: 'width 0.4s',
                      }} />
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: 600, width: 32, textAlign: 'right',
                      color: scoreColor(r.result?.score ?? 0),
                    }}>
                      {r.result?.score ?? '--'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── INSIGHTS TAB ── */}
          {activeTab === 'insights' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reports.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '60px 20px',
                  background: '#0d0d16', borderRadius: 18,
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.25)', fontSize: 14,
                }}>
                  Run a few analyses to unlock insights.
                </div>
              ) : (
                <>
                  {/* score trend */}
                  <div style={{
                    background: '#0d0d16', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 18, padding: '18px 20px',
                  }}>
                    <p style={{ margin: '0 0 14px', fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Score trend
                    </p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
                      {[...reports].reverse().slice(0, 12).map((r, i) => {
                        const s = r.result?.score ?? 0
                        return (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div title={`${s}`} style={{
                              width: '100%', borderRadius: '4px 4px 0 0',
                              height: `${Math.max(4, s * 0.72)}px`,
                              background: `linear-gradient(180deg,${scoreColor(s)},${scoreColor(s)}88)`,
                            }} />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* top roles */}
                  <div style={{
                    background: '#0d0d16', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 18, padding: '18px 20px',
                  }}>
                    <p style={{ margin: '0 0 14px', fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Roles analysed
                    </p>
                    {Array.from(new Set(reports.map(r => r.role))).slice(0, 5).map(role => (
                      <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 13, flex: 1, color: 'rgba(255,255,255,0.7)' }}>{role}</span>
                        <span style={{
                          fontSize: 11, padding: '2px 10px', borderRadius: 20,
                          background: 'rgba(129,140,248,0.12)', color: '#a5b4fc',
                        }}>
                          {reports.filter(r => r.role === role).length}×
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ════ MODALS ════ */}

      {/* Edit profile */}
      {editOpen && (
        <Modal title="Edit profile" onClose={() => setEditOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={labelStyle}>
              Full name
              <input
                style={inputStyle} value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Your name"
              />
            </label>
            <label style={labelStyle}>
              Email address
              <input
                style={inputStyle} type="email" value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <button onClick={handleEditSave} disabled={editSaving} style={saveBtn}>
              {editSaving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </Modal>
      )}

      {/* Change password */}
      {pwOpen && (
        <Modal title="Change password" onClose={() => setPwOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['current', 'next', 'confirm'].map((key, i) => (
              <label key={key} style={labelStyle}>
                {['Current password', 'New password', 'Confirm new password'][i]}
                <input
                  style={inputStyle} type="password"
                  value={pw[key]}
                  onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))}
                  placeholder="••••••••"
                />
              </label>
            ))}
            <button onClick={handlePwSave} disabled={pwSaving} style={saveBtn}>
              {pwSaving ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </Modal>
      )}

      {/* Logout confirm */}
      {logoutOpen && (
        <Modal title="Log out?" onClose={() => setLogoutOpen(false)}>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
            You'll be signed out of your Xpose account on this device.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setLogoutOpen(false)} style={{
              flex: 1, padding: 10, borderRadius: 10, cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)', fontSize: 13,
            }}>
              Cancel
            </button>
            <button onClick={handleLogout} style={{
              flex: 1, padding: 10, borderRadius: 10, cursor: 'pointer',
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', fontSize: 13, fontWeight: 500,
            }}>
              Log out
            </button>
          </div>
        </Modal>
      )}

    </div>
  )
}

export default ProfilePage