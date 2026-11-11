import { useMemo, useRef, useState } from 'react'
import Confetti from 'react-confetti'
import {
  CalendarDays,
  Check,
  Clipboard,
  Clock3,
  Flower2,
  Heart,
  HeartHandshake,
  LockKeyhole,
  RotateCcw,
  Sparkles,
  Star,
} from 'lucide-react'
import { FaHeart } from 'react-icons/fa'
import { invitationConfig } from '../data/invitationConfig'
import {
  ArrowContinue,
  ContinueButton,
  PrimaryButton,
  ScreenEyebrow,
} from '../components/Shared'

function getToday() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(value) {
  if (!value) return ''
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(value) {
  if (!value) return ''
  return new Date(`1970-01-01T${value}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function InvitationScreen({ noAttempts, declined, onYes, onNoAttempt, onDecline, onRestart }) {
  const answerAreaRef = useRef(null)
  const [noPosition, setNoPosition] = useState(null)
  const [keyboardDeclineVisible, setKeyboardDeclineVisible] = useState(false)

  const dodgeNoButton = (event) => {
    const area = answerAreaRef.current
    if (!area) return

    const areaRect = area.getBoundingClientRect()
    const buttonRect = area.querySelector('.no-button').getBoundingClientRect()
    const yesRect = area.querySelector('.yes-button').getBoundingClientRect()
    const maxLeft = areaRect.width - buttonRect.width
    const maxTop = areaRect.height - buttonRect.height
    const pointerX = event.clientX - areaRect.left
    const pointerY = event.clientY - areaRect.top
    const buttonX = buttonRect.left - areaRect.left
    const buttonY = buttonRect.top - areaRect.top
    const pointerIsNear = Math.hypot(
      buttonX + buttonRect.width / 2 - pointerX,
      buttonY + buttonRect.height / 2 - pointerY,
    ) < 92

    if (!pointerIsNear) return

    const candidates = [0, maxLeft / 2, maxLeft].flatMap((left) =>
      [0, maxTop / 2, maxTop].map((top) => ({ left, top })),
    )
    const available = candidates.filter(({ left, top }) => {
      const overlapsYes = left < yesRect.right - areaRect.left + 8
        && left + buttonRect.width > yesRect.left - areaRect.left - 8
        && top < yesRect.bottom - areaRect.top + 8
        && top + buttonRect.height > yesRect.top - areaRect.top - 8
      const movedEnough = Math.hypot(left - buttonX, top - buttonY) > 40
      const awayFromPointer = Math.hypot(
        left + buttonRect.width / 2 - pointerX,
        top + buttonRect.height / 2 - pointerY,
      ) > 80
      return !overlapsYes && movedEnough && awayFromPointer
    })

    const nextPosition = available.sort((a, b) => {
      const distance = ({ left, top }) => Math.hypot(
        left + buttonRect.width / 2 - pointerX,
        top + buttonRect.height / 2 - pointerY,
      )
      return distance(b) - distance(a)
    })[0]

    if (nextPosition) {
      onNoAttempt()
      setNoPosition(nextPosition)
    }
  }

  return (
    <div className="invitation-card panel">
      <div className="portrait-wrap">
        <div className="portrait-frame">
          <img src={invitationConfig.dogImage} alt={invitationConfig.dogImageAlt} />
          <span className="portrait-sticker" aria-hidden="true"><FaHeart /></span>
        </div>
      </div>

      <div className="invitation-copy">
        <ScreenEyebrow icon={Flower2}>a very important question</ScreenEyebrow>
        <h1>Will you go on a <em>date</em> with me?</h1>
        <p className="intro-copy">I’ve been meaning to ask you something...</p>

        <div className="answer-area">
          {!declined ? (
            <>
              <div
                className="answer-buttons"
                ref={answerAreaRef}
                onPointerMove={dodgeNoButton}
                onPointerDown={(event) => {
                  if (event.target.closest('.no-button')) dodgeNoButton(event)
                }}
              >
                <ContinueButton onClick={onYes} className="yes-button">
                  Yes, absolutely
                </ContinueButton>
                <button
                  type="button"
                  className="button button-soft no-button"
                  onFocus={(event) => {
                    if (event.currentTarget.matches(':focus-visible')) {
                      setKeyboardDeclineVisible(true)
                    }
                  }}
                  onClick={(event) => event.preventDefault()}
                  style={noPosition ? { left: noPosition.left, top: noPosition.top } : undefined}
                  aria-describedby="no-message"
                  aria-label="No, moves away when approached"
                >
                  No <span aria-hidden="true">🙈</span>
                </button>
              </div>
              <p className="no-message" id="no-message" aria-live="polite">
                {noAttempts >= 3 ? 'Okay, okay — I hear you 🥺' : noAttempts > 0 ? 'Are you really sure? 🥺' : ' '}
              </p>
              {(noAttempts >= 3 || keyboardDeclineVisible) && (
                <button className="text-button decline-link" type="button" onClick={onDecline}>
                  I really mean no, thanks
                </button>
              )}
            </>
          ) : (
            <div className="declined-message" role="status">
              <span className="declined-icon"><Heart size={19} aria-hidden="true" /></span>
              <p>Totally understood. Thanks for being honest — no hard feelings. 💛</p>
              <PrimaryButton variant="outline" icon={RotateCcw} onClick={onRestart}>
                Start over
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>

      <span className="flower-doodle flower-one" aria-hidden="true">✿</span>
      <span className="flower-doodle flower-two" aria-hidden="true">✽</span>
      <span className="sparkle-doodle" aria-hidden="true">✧</span>
    </div>
  )
}

export function YesConfirmationScreen({ onContinue }) {
  return (
    <div className="centered-card panel confirmation-card">
      <div className="candy-illustration" aria-hidden="true">
        <span className="candy-sparkle sparkle-left">✧</span>
        <span className="candy-heart"><Heart size={55} fill="currentColor" strokeWidth={1.2} /></span>
        <span className="candy-sparkle sparkle-right">✦</span>
        <span className="candy-dot dot-left" />
        <span className="candy-dot dot-right" />
      </div>
      <ScreenEyebrow>well, look at that</ScreenEyebrow>
      <h1 className="compact-title">WAIT! YOU ACTUALLY<br className="desktop-break" /> SAID YES??</h1>
      <p className="body-copy">I was so ready for you to say no <span aria-label="laughing">😂</span></p>
      <ContinueButton onClick={onContinue}>Okay, let’s go!</ContinueButton>
      <p className="tiny-note">I’ll try to act normal. No promises.</p>
    </div>
  )
}

export function DateSelectionScreen({ appointment, onChange, onContinue }) {
  const valid = Boolean(appointment.date && appointment.time && appointment.date >= getToday())

  return (
    <div className="centered-card panel form-card">
      <div className="calendar-illustration" aria-hidden="true">
        <CalendarDays size={35} strokeWidth={1.6} />
        <span>♡</span>
      </div>
      <ScreenEyebrow>the fun part</ScreenEyebrow>
      <h1 className="compact-title">So... when are<br className="mobile-break" /> you free?</h1>
      <p className="body-copy">Pick a day and I’ll save the evening for us.</p>

      <form className="date-form" onSubmit={(event) => { event.preventDefault(); if (valid) onContinue() }}>
        <label className="field-label" htmlFor="date">
          <span className="field-icon"><CalendarDays size={16} aria-hidden="true" /></span>
          <span>Pick a day</span>
        </label>
        <input
          id="date"
          className="form-control"
          type="date"
          min={getToday()}
          value={appointment.date}
          onChange={(event) => onChange((current) => ({ ...current, date: event.target.value }))}
          required
        />

        <label className="field-label time-label" htmlFor="time">
          <span className="field-icon"><Clock3 size={16} aria-hidden="true" /></span>
          <span>What time?</span>
        </label>
        <select
          id="time"
          className="form-control"
          value={appointment.time}
          onChange={(event) => onChange((current) => ({ ...current, time: event.target.value }))}
          required
        >
          <option value="" disabled>Choose your perfect time</option>
          {invitationConfig.timeOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <ArrowContinue disabled={!valid} type="submit">Set the date!</ArrowContinue>
      </form>
      <p className="tiny-note">Only dates from today onwards — I’m not a time traveler.</p>
    </div>
  )
}

export function DateConfirmationScreen({ appointment, onContinue }) {
  return (
    <div className="centered-card panel plan-card">
      <div className="plan-decoration" aria-hidden="true">
        <div className="plan-icon"><HeartHandshake size={37} strokeWidth={1.5} /></div>
        <span>✦</span>
        <span>♡</span>
      </div>
      <ScreenEyebrow>it’s really happening</ScreenEyebrow>
      <h1 className="compact-title">Glad you didn’t<br />say no.</h1>
      <p className="plan-message">Be ready by {formatTime(appointment.time)}, I’m coming to get you <span aria-label="love">❤️</span></p>
      <div className="appointment-pill">
        <CalendarDays size={17} aria-hidden="true" />
        <span>{formatDate(appointment.date)}</span>
        <span className="pill-divider" aria-hidden="true">·</span>
        <span>{formatTime(appointment.time)}</span>
      </div>
      <p className="humor-note">P.S. Normal people don’t get to see this version of me.<br className="desktop-break" /> Enjoy the privilege 😂</p>
      <ContinueButton onClick={onContinue}>Okay, I accept!</ContinueButton>
      <div className="heart-confetti" aria-hidden="true">♡ &nbsp; ✦ &nbsp; ♡</div>
    </div>
  )
}

export function AgreementIntroductionScreen({ onContinue }) {
  return (
    <div className="centered-card panel agreement-intro-card">
      <div className="paper-illustration" aria-hidden="true">
        <div className="paper-top"><span /><span /><span /></div>
        <div className="paper-heart"><Heart size={31} fill="currentColor" /></div>
        <div className="paper-line long" />
        <div className="paper-line" />
        <div className="paper-line short" />
        <span className="paper-stamp">♡</span>
      </div>
      <ScreenEyebrow>just one tiny formality</ScreenEyebrow>
      <h1 className="compact-title">One small thing...</h1>
      <p className="body-copy agreement-intro-copy">
        Before we make it official, there’s a very serious (not serious at all) agreement to sign.
      </p>
      <div className="terms-preview">
        <span><Check size={15} aria-hidden="true" /> Good conversation is compulsory</span>
        <span><Check size={15} aria-hidden="true" /> Smiling is strongly encouraged</span>
        <span><Check size={15} aria-hidden="true" /> My jokes deserve a courtesy laugh</span>
        <span><Check size={15} aria-hidden="true" /> Cancelling requires a very good explanation</span>
      </div>
      <ContinueButton onClick={onContinue}>Proceed to the agreement</ContinueButton>
      <p className="tiny-note">The only thing due is your excellent company.</p>
    </div>
  )
}

export function AgreementScreen({ onContinue }) {
  return (
    <div className="centered-card panel agreement-card">
      <div className="agreement-topline"><span>OFFICIAL-ISH DOCUMENT</span><span>NO. 001 ♡</span></div>
      <div className="agreement-seal" aria-hidden="true"><Heart size={25} fill="currentColor" /></div>
      <ScreenEyebrow icon={LockKeyhole}>sealed with a pinky promise</ScreenEyebrow>
      <h1 className="agreement-title">Date<br />Agreement</h1>
      <div className="agreement-amount">
        <span>ONE (1) LOVELY DATE</span>
        <strong>{invitationConfig.agreementAmount}</strong>
        <span>payable exclusively in good vibes</span>
      </div>
      <p className="legal-copy">
        By proceeding, you agree to have a lovely time, enjoy good conversations and create a beautiful memory.
      </p>
      <div className="fictional-notice">
        <Sparkles size={14} aria-hidden="true" />
        <span>Completely fictional. No payment is collected.</span>
      </div>
      <PrimaryButton onClick={onContinue} icon={Heart}>Pay {invitationConfig.agreementAmount} &amp; Confirm</PrimaryButton>
      <p className="tiny-note">This agreement is legally binding only on my heart.</p>
    </div>
  )
}

export function CelebrationScreen({ appointment, onRestart, reduceMotion }) {
  const [copyState, setCopyState] = useState('idle')
  const details = useMemo(
    () => `It’s a date! ${formatDate(appointment.date)} at ${formatTime(appointment.time)} ❤️`,
    [appointment.date, appointment.time],
  )

  const copyDetails = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard access is unavailable in this browser.')
      }
      await navigator.clipboard.writeText(details)
      setCopyState('copied')
    } catch (error) {
      setCopyState('error')
      console.error('Unable to copy the date details:', error)
    }
  }

  return (
    <div className="centered-card panel celebration-card">
      {!reduceMotion && <Confetti recycle={false} numberOfPieces={280} gravity={0.19} />}
      <div className="celebration-emblem" aria-hidden="true">
        <div className="emblem-ring"><Heart size={46} fill="currentColor" strokeWidth={1.2} /></div>
        <span className="emblem-star star-one"><Star size={16} fill="currentColor" /></span>
        <span className="emblem-star star-two"><Sparkles size={18} /></span>
        <span className="emblem-star star-three">✧</span>
      </div>
      <ScreenEyebrow>the best answer ever</ScreenEyebrow>
      <h1 className="celebration-title">IT’S A DATE! <span>♥</span></h1>
      <p className="body-copy celebration-copy">I knew you’d say yes. I can’t wait to see you!</p>
      <div className="celebration-date">
        <span className="date-kicker">OUR LITTLE PLAN</span>
        <strong>{formatDate(appointment.date)}</strong>
        <span>{formatTime(appointment.time)}</span>
      </div>
      <div className="celebration-actions">
        <PrimaryButton variant="outline" onClick={copyDetails} icon={copyState === 'copied' ? Check : Clipboard}>
          {copyState === 'copied' ? 'Copied to clipboard!' : 'Copy date details'}
        </PrimaryButton>
        <button className="text-button restart-link" type="button" onClick={onRestart}>
          <RotateCcw size={15} aria-hidden="true" />
          Start the story again
        </button>
      </div>
      {copyState === 'error' && (
        <p className="copy-error" role="status">Couldn’t copy automatically. You can save the date details above.</p>
      )}
      <div className="celebration-footnote"><span>♡</span> here’s to a lovely little memory <span>♡</span></div>
    </div>
  )
}
