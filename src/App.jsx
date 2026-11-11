import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  AgreementScreen,
  CelebrationScreen,
  DateConfirmationScreen,
  DateSelectionScreen,
  InvitationScreen,
  YesConfirmationScreen,
  AgreementIntroductionScreen,
} from './pages/InvitationFlow'
import { FloatingHearts, ProgressIndicator } from './components/Shared'
import { invitationConfig } from './data/invitationConfig'

const initialAppointment = { date: '', time: '' }

function App() {
  const [step, setStep] = useState(0)
  const [appointment, setAppointment] = useState(initialAppointment)
  const [noAttempts, setNoAttempts] = useState(0)
  const [declined, setDeclined] = useState(false)
  const reduceMotion = useReducedMotion()

  const restart = () => {
    setStep(0)
    setAppointment(initialAppointment)
    setNoAttempts(0)
    setDeclined(false)
  }

  const screens = [
    <InvitationScreen
      key="invitation"
      noAttempts={noAttempts}
      declined={declined}
      onYes={() => setStep(1)}
      onNoAttempt={() => setNoAttempts((attempts) => attempts + 1)}
      onDecline={() => setDeclined(true)}
      onRestart={restart}
    />,
    <YesConfirmationScreen key="yes" onContinue={() => setStep(2)} />,
    <DateSelectionScreen
      key="date"
      appointment={appointment}
      onChange={setAppointment}
      onContinue={() => setStep(3)}
    />,
    <DateConfirmationScreen
      key="confirmation"
      appointment={appointment}
      onContinue={() => setStep(4)}
    />,
    <AgreementIntroductionScreen key="intro" onContinue={() => setStep(5)} />,
    <AgreementScreen key="agreement" onContinue={() => setStep(6)} />,
    <CelebrationScreen
      key="celebration"
      appointment={appointment}
      onRestart={restart}
      reduceMotion={reduceMotion}
    />,
  ]

  return (
    <main className="app-shell">
      <FloatingHearts />
      <div className="story-layout">
        <header className="site-header">
          <div className="wordmark" aria-label="Little love note">
            <span className="wordmark-heart" aria-hidden="true">♥</span>
            <span>little love note</span>
          </div>
          {step > 0 && <ProgressIndicator step={step} total={screens.length} />}
          <span className="header-caption">an invitation, just for you</span>
        </header>

        <motion.section
          key={step}
          className="screen"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduceMotion ? 0.12 : 0.38, ease: [0.22, 1, 0.36, 1] }}
          aria-live="polite"
        >
          {screens[step]}
        </motion.section>

        <footer className="site-footer">
          <span>made with a little courage</span>
          <span className="footer-heart" aria-hidden="true">♡</span>
          <span>{invitationConfig.footerNote}</span>
        </footer>
      </div>
    </main>
  )
}

export default App
