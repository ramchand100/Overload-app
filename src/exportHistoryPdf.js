import { jsPDF } from 'jspdf'

const fmtSessionDate = (dt) =>
  new Date(dt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

// Writes a plain, readable PDF log of the given sessions (already range-filtered by the caller).
export const exportHistoryPdf = (sessions, units) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginX = 40
  const marginBottom = 50
  let y = 50

  const ensureSpace = (needed) => {
    if (y + needed > pageHeight - marginBottom) {
      doc.addPage()
      y = 50
    }
  }

  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.text('Workout History', marginX, y)
  y += 28

  const sorted = [...sessions].sort((a, b) => b.date - a.date)

  sorted.forEach((sess) => {
    ensureSpace(40)
    doc.setFontSize(13)
    doc.setFont(undefined, 'bold')
    doc.text(`${sess.dayName}${sess.partial ? ' (Partial)' : ''}`, marginX, y)
    y += 16
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(fmtSessionDate(sess.date), marginX, y)
    y += 18

    sess.exercises.forEach((ex) => {
      ensureSpace(16)
      doc.setFontSize(11)
      doc.setFont(undefined, 'bold')
      doc.text(ex.name, marginX + 10, y)
      y += 14
      doc.setFont(undefined, 'normal')
      doc.setFontSize(10)
      ex.sets.forEach((s, i) => {
        ensureSpace(14)
        const val = s.w || s.done ? `${s.w} ${units} x ${s.r} reps` : '—'
        doc.text(`Set ${i + 1}: ${val}`, marginX + 20, y)
        y += 14
      })
    })

    y += 12
  })

  if (sorted.length === 0) {
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    doc.text('No sessions in this range.', marginX, y)
  }

  doc.save('workout-history.pdf')
}
