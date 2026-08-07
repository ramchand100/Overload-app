import { useRef, useEffect } from 'react'

export const WheelPicker = ({
  options,
  value,
  onChange,
  labelFn = (v) => `${v}`,
  itemHeight = 40,
  visibleCount = 5,
  width = 90,
}) => {
  const scrollRef = useRef(null)
  const settleTimer = useRef(null)
  const padCount = Math.floor(visibleCount / 2)
  const containerHeight = itemHeight * visibleCount

  useEffect(() => {
    const idx = options.indexOf(value)
    if (scrollRef.current && idx >= 0) {
      scrollRef.current.scrollTop = idx * itemHeight
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleScroll = () => {
    if (settleTimer.current) clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(() => {
      const el = scrollRef.current
      if (!el) return
      const idx = Math.max(0, Math.min(options.length - 1, Math.round(el.scrollTop / itemHeight)))
      el.scrollTo({ top: idx * itemHeight, behavior: 'smooth' })
      const newVal = options[idx]
      if (newVal !== value) onChange(newVal)
    }, 120)
  }

  return (
    <div style={{ position: 'relative', width, height: containerHeight }}>
      <style>{`.wheel-picker-scroll::-webkit-scrollbar{display:none}`}</style>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="wheel-picker-scroll"
        style={{
          height: containerHeight,
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
          maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
        }}
      >
        <div style={{ height: itemHeight * padCount }} />
        {options.map((opt, i) => (
          <div
            key={i}
            style={{
              height: itemHeight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              scrollSnapAlign: 'center',
              fontSize: opt === value ? 17 : 15,
              fontWeight: opt === value ? 700 : 500,
              color: opt === value ? 'var(--ch)' : 'var(--ink3)',
              transition: 'color .15s, font-size .15s',
              fontFamily: 'Inter,sans-serif',
            }}
          >
            {labelFn(opt)}
          </div>
        ))}
        <div style={{ height: itemHeight * padCount }} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: itemHeight,
          marginTop: -itemHeight / 2,
          borderTop: '1.5px solid var(--border2)',
          borderBottom: '1.5px solid var(--border2)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
