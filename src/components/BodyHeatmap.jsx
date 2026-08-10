const FRONT_SHAPES = [
  { region: null, type: 'circle', cx: 100, cy: 26, r: 15 },
  { region: null, type: 'rect', x: 93, y: 39, width: 14, height: 10, rx: 3 },
  { region: 'Shoulders', type: 'ellipse', cx: 56, cy: 58, rx: 15, ry: 12 },
  { region: 'Shoulders', type: 'ellipse', cx: 144, cy: 58, rx: 15, ry: 12 },
  { region: 'Chest', type: 'rect', x: 64, y: 50, width: 72, height: 38, rx: 14 },
  { region: 'Abs', type: 'rect', x: 74, y: 90, width: 52, height: 42, rx: 10 },
  { region: null, type: 'rect', x: 62, y: 132, width: 76, height: 18, rx: 9 },
  { region: 'Biceps', type: 'rect', x: 34, y: 56, width: 17, height: 38, rx: 8 },
  { region: 'Biceps', type: 'rect', x: 149, y: 56, width: 17, height: 38, rx: 8 },
  { region: null, type: 'rect', x: 32, y: 94, width: 15, height: 42, rx: 7 },
  { region: null, type: 'rect', x: 153, y: 94, width: 15, height: 42, rx: 7 },
  { region: 'Quads', type: 'rect', x: 64, y: 150, width: 30, height: 66, rx: 14 },
  { region: 'Quads', type: 'rect', x: 106, y: 150, width: 30, height: 66, rx: 14 },
  { region: null, type: 'rect', x: 66, y: 216, width: 26, height: 54, rx: 12 },
  { region: null, type: 'rect', x: 108, y: 216, width: 26, height: 54, rx: 12 },
]

const BACK_SHAPES = [
  { region: null, type: 'circle', cx: 100, cy: 26, r: 15 },
  { region: null, type: 'rect', x: 93, y: 39, width: 14, height: 10, rx: 3 },
  { region: 'Traps', type: 'polygon', points: '86,40 114,40 140,64 100,76 60,64' },
  { region: 'Rear Delts', type: 'ellipse', cx: 56, cy: 62, rx: 14, ry: 11 },
  { region: 'Rear Delts', type: 'ellipse', cx: 144, cy: 62, rx: 14, ry: 11 },
  { region: 'Back', type: 'rect', x: 68, y: 72, width: 64, height: 62, rx: 16 },
  { region: 'Glutes', type: 'rect', x: 66, y: 134, width: 68, height: 26, rx: 14 },
  { region: 'Triceps', type: 'rect', x: 34, y: 56, width: 17, height: 38, rx: 8 },
  { region: 'Triceps', type: 'rect', x: 149, y: 56, width: 17, height: 38, rx: 8 },
  { region: null, type: 'rect', x: 32, y: 94, width: 15, height: 42, rx: 7 },
  { region: null, type: 'rect', x: 153, y: 94, width: 15, height: 42, rx: 7 },
  { region: 'Hamstrings', type: 'rect', x: 64, y: 160, width: 30, height: 56, rx: 14 },
  { region: 'Hamstrings', type: 'rect', x: 106, y: 160, width: 30, height: 56, rx: 14 },
  { region: 'Calves', type: 'rect', x: 66, y: 216, width: 26, height: 54, rx: 12 },
  { region: 'Calves', type: 'rect', x: 108, y: 216, width: 26, height: 54, rx: 12 },
]

const renderShape = (s, key, fillProps) => {
  if (s.type === 'circle') return <circle key={key} cx={s.cx} cy={s.cy} r={s.r} {...fillProps} />
  if (s.type === 'ellipse')
    return <ellipse key={key} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} {...fillProps} />
  if (s.type === 'rect')
    return (
      <rect
        key={key}
        x={s.x}
        y={s.y}
        width={s.width}
        height={s.height}
        rx={s.rx}
        {...fillProps}
      />
    )
  if (s.type === 'polygon') return <polygon key={key} points={s.points} {...fillProps} />
  return null
}

export const BodyHeatmap = ({ view, opacityFor }) => {
  const shapes = view === 'back' ? BACK_SHAPES : FRONT_SHAPES
  return (
    <svg
      width="100%"
      viewBox="0 0 200 280"
      style={{ maxWidth: 200, display: 'block', margin: '0 auto' }}
    >
      {shapes.map((s, i) => {
        const op = s.region ? opacityFor(s.region) : 0
        const trained = s.region && op > 0
        return renderShape(s, i, {
          fill: trained ? 'var(--ch)' : 'var(--surface)',
          fillOpacity: trained ? op : 1,
          stroke: 'var(--border)',
          strokeWidth: 1.5,
        })
      })}
    </svg>
  )
}
