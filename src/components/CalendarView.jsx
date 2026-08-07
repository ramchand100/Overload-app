import { useState } from 'react'

export const CalendarView = ({ sessionLog }) => {
  const [offset, setOffset] = useState(0)
  const [selDate, setSelDate] = useState(null)
  const ref = new Date()
  ref.setMonth(ref.getMonth() + offset)
  const yr = ref.getFullYear(),
    mo = ref.getMonth()
  const firstDay = new Date(yr, mo, 1)
  const lastDay = new Date(yr, mo + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7
  const sessMap = {}
  sessionLog.forEach((s) => {
    const d = new Date(s.date)
    if (d.getFullYear() === yr && d.getMonth() === mo) {
      const k = d.getDate()
      if (!sessMap[k]) sessMap[k] = []
      sessMap[k].push(s)
    }
  })
  const cells = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d)
  const monthLabel = ref.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const selSessions = selDate ? sessMap[selDate] || [] : []
  const cellsData = cells.map((d, i) => {
    if (!d) return { d: null, i }
    const sessions = sessMap[d] || []
    const hasFull = sessions.some((s) => !s.partial)
    const isToday =
      new Date().getDate() === d && new Date().getMonth() === mo && new Date().getFullYear() === yr
    const isSel = selDate === d
    return { d, i, sessions, hasFull, isToday, isSel }
  })
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <button
          onClick={() => setOffset((o) => o - 1)}
          style={{
            background: 'var(--surface)',
            border: 'none',
            width: 30,
            height: 30,
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: 14,
            color: 'var(--ch)',
          }}
        >
          ‹
        </button>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ch)' }}>{monthLabel}</div>
        <button
          onClick={() => setOffset((o) => Math.min(o + 1, 0))}
          style={{
            background: 'var(--surface)',
            border: 'none',
            width: 30,
            height: 30,
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: 14,
            color: 'var(--ch)',
            opacity: offset === 0 ? 0.3 : 1,
          }}
        >
          ›
        </button>
      </div>
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}
      >
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--ink3)',
              padding: '2px 0',
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
        {cellsData.map((c) =>
          !c.d ? (
            <div key={c.i} />
          ) : (
            <div
              key={c.i}
              onClick={() => setSelDate(c.isSel ? null : c.d)}
              style={{
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                cursor: c.sessions.length > 0 ? 'pointer' : 'default',
                background: c.isSel ? 'var(--ch)' : c.isToday ? 'var(--orange-l)' : 'transparent',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: c.isToday ? 800 : 500,
                  color: c.isSel ? 'white' : c.isToday ? 'var(--orange)' : 'var(--ink2)',
                }}
              >
                {c.d}
              </span>
              {c.sessions.length > 0 && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: c.isSel ? 'white' : c.hasFull ? 'var(--green)' : 'var(--orange)',
                    marginTop: 1,
                  }}
                />
              )}
            </div>
          ),
        )}
      </div>
      {selDate && selSessions.length > 0 && (
        <div style={{ marginTop: 12, background: 'var(--surface)', borderRadius: 12, padding: 12 }}>
          {selSessions.map((s) => (
            <div key={s.id} style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ch)' }}>
                {s.dayName}
                {s.partial ? (
                  <span style={{ color: 'var(--orange)', fontSize: 11 }}> · Partial</span>
                ) : (
                  ''
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>
                {s.exercises.map((e) => e.name).join(' · ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
