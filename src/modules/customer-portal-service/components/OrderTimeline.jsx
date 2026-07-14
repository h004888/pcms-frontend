import { Check, Clock } from 'lucide-react'

const ICONS = {
  completed: Check,
  current: Clock,
  pending: null,
}

export function OrderTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null

  return (
    <div className="timeline">
      {timeline.map((step, i) => {
        const Icon = ICONS[step.isCompleted ? 'completed' : step.isCurrent ? 'current' : 'pending']

        return (
          <div className="timeline-item" key={i}>
            <div className={`timeline-icon ${step.isCompleted ? 'completed' : step.isCurrent ? 'current' : 'pending'}`}>
              {Icon ? <Icon size={14} /> : <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ink-300)', display: 'block' }} />}
            </div>
            <div className="timeline-label">{step.label}</div>
            {step.timestamp && (
              <div className="timeline-time">
                {new Date(step.timestamp).toLocaleString('vi-VN')}
              </div>
            )}
            {step.note && <div className="timeline-note">{step.note}</div>}
          </div>
        )
      })}
    </div>
  )
}
