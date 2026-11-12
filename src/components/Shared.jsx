import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Heart, Sparkles } from 'lucide-react'

export function FloatingHearts() {
  const reduceMotion = useReducedMotion()
  const hearts = [
    { left: '7%', top: '21%', size: 16, delay: 0, duration: 8 },
    { left: '15%', top: '78%', size: 11, delay: 1.2, duration: 9 },
    { left: '88%', top: '25%', size: 14, delay: 0.8, duration: 7 },
    { left: '80%', top: '76%', size: 19, delay: 1.8, duration: 10 },
    { left: '50%', top: '7%', size: 10, delay: 2.4, duration: 8 },
  ]

  return (
    <div className="ambient-hearts" aria-hidden="true">
      {hearts.map((heart, index) => (
        <motion.span
          key={index}
          className="ambient-heart"
          style={{ left: heart.left, top: heart.top, fontSize: heart.size }}
          animate={reduceMotion ? undefined : { y: [0, -13, 0], rotate: [0, 7, -5, 0], opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: heart.duration, delay: heart.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {index % 2 === 0 ? '♥' : '✿'}
        </motion.span>
      ))}
    </div>
  )
}

export function ProgressIndicator({ step, total }) {
  const labels = ['The question', 'A little surprise', 'Pick a day', 'Pick your vibe', 'The plan', 'One small thing', 'The agreement', 'It’s a date']

  return (
    <div className="progress-wrap" aria-label={`Step ${step + 1} of ${total}`}>
      <span className="progress-label">{labels[step] || 'A little love note'}</span>
      <div className="progress-track" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        <motion.span
          className="progress-fill"
          initial={false}
          animate={{ width: `${((step + 1) / total) * 100}%` }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export function PrimaryButton({ children, variant = 'primary', icon: Icon, className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`button button-${variant} ${className}`.trim()}
      {...props}
    >
      <span>{children}</span>
      {Icon && <Icon aria-hidden="true" size={18} strokeWidth={2.2} />}
    </button>
  )
}

export function ScreenEyebrow({ children, icon: Icon = Sparkles }) {
  return (
    <div className="eyebrow">
      <Icon aria-hidden="true" size={14} strokeWidth={2} />
      <span>{children}</span>
    </div>
  )
}

export function ContinueButton({ children, onClick, disabled = false, ...props }) {
  return (
    <PrimaryButton onClick={onClick} disabled={disabled} icon={Heart} {...props}>
      {children}
    </PrimaryButton>
  )
}

export function ArrowContinue({ children, onClick, disabled = false, type = 'button' }) {
  return (
    <PrimaryButton onClick={onClick} disabled={disabled} icon={ArrowRight} type={type}>
      {children}
    </PrimaryButton>
  )
}
