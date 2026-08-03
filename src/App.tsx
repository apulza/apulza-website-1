import { memo, useEffect, useState, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import './App.css'
import { catCafeSceneCss, catCafeSceneHtml } from './catCafeSnippet'
import MobileAppShowcase from './MobileAppShowcase'

type IconProps = {
  className?: string
  size?: number
}

type TextSize = 'small' | 'default' | 'large'

type AccessibilitySettings = {
  darkMode: boolean
  lowStimulation: boolean
  textSize: TextSize
  dyslexiaFriendly: boolean
  highContrast: boolean
  emphasizeLinks: boolean
}

const defaultAccessibilitySettings: AccessibilitySettings = {
  darkMode: false,
  lowStimulation: false,
  textSize: 'default',
  dyslexiaFriendly: false,
  highContrast: false,
  emphasizeLinks: false,
}

const accessibilityStorageKey = 'apulza-accessibility-preferences'

function loadAccessibilitySettings(): AccessibilitySettings {
  try {
    const stored = window.localStorage.getItem(accessibilityStorageKey)
    if (!stored) return defaultAccessibilitySettings

    const parsed = JSON.parse(stored) as Partial<AccessibilitySettings>
    const textSize: TextSize = ['small', 'default', 'large'].includes(parsed.textSize ?? '')
      ? (parsed.textSize as TextSize)
      : 'default'

    return {
      darkMode: Boolean(parsed.darkMode),
      lowStimulation: Boolean(parsed.lowStimulation),
      textSize,
      dyslexiaFriendly: Boolean(parsed.dyslexiaFriendly),
      highContrast: Boolean(parsed.highContrast),
      emphasizeLinks: Boolean(parsed.emphasizeLinks),
    }
  } catch {
    return defaultAccessibilitySettings
  }
}

const navItems = [
  { label: 'How it works', href: '#how' },
  { label: 'Inside Apulza', href: '#inside' },
  { label: 'Meet the team', href: '#team' },
  { label: 'Safety & privacy', href: '#privacy' },
  { label: 'For schools', href: '#schools' },
]

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/apulza/',
    handle: 'Apulza',
    icon: <IconLinkedIn />,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/apulza.ai/',
    handle: '@apulza.ai',
    icon: <IconInstagram />,
  },
]

const formEndpoint = (import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined)?.trim()

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error' | 'email'

async function submitInquiry(form: HTMLFormElement) {
  if (!formEndpoint) return false

  const response = await fetch(formEndpoint, {
    method: 'POST',
    body: new FormData(form),
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error('The form service could not accept this submission.')
  }

  return true
}

function openEmailFallback(subject: string, lines: string[]) {
  const emailSubject = encodeURIComponent(subject)
  const emailBody = encodeURIComponent(['Hi Apulza team,', '', ...lines].join('\n'))
  window.location.href = `mailto:apulzaai@outlook.com?subject=${emailSubject}&body=${emailBody}`
}

const trustPoints = [
  { label: 'No streaks to lose', icon: <IconHeart /> },
  { label: 'Picks up where you left off', icon: <IconBookmark /> },
  { label: 'Adapts to your day', icon: <IconSliders /> },
  { label: 'Private and calm', icon: <IconShield /> },
]

const steps = [
  {
    number: '1',
    title: 'Create your account',
    body: 'Choose the kind of support that feels useful. You can change it whenever you need.',
    demo: 'account',
  },
  {
    number: '2',
    title: 'Add your courses',
    body: 'A course name, syllabus, or assignment is enough for Apulza to understand the context.',
    demo: 'courses',
  },
  {
    number: '3',
    title: 'Get your study plan',
    body: 'Start with a course-specific plan broken into realistic strategies and manageable steps.',
    demo: 'plan',
  },
] as const

const showcasePoints = [
  'Opens on where you left off - scroll, notes and next step restored.',
  "Today's focus is short by design. Half of it still counts.",
  'Progress is reframed as encouragement, never a scoreboard.',
]

const schoolPoints = [
  'No streaks or leaderboards - nothing that shames a student who is struggling.',
  'Accessible by default: strong contrast, 44px touch targets, motion always optional.',
  'Private and calm - a companion between sessions, not a surveillance tool.',
  'Adapts to a wide range of needs, one student at a time.',
]

const clearPrinciples = [
  { letter: 'C', title: 'Cognitive load', body: 'Only what the step needs. One primary action.' },
  { letter: 'L', title: 'Low re-entry', body: 'Restore state and surface the likely next action.' },
  {
    letter: 'E',
    title: 'Emotional safety',
    body: 'Compassionate, never blaming. Celebrate partial progress.',
  },
  { letter: 'A', title: 'Adaptive', body: 'Density, theme, and input controls for every brain.' },
  {
    letter: 'R',
    title: 'Reliable memory',
    body: 'Externalize time and autosave. Assume nothing is remembered.',
  },
]

const teamMembers = [
  {
    name: 'Team member 01',
    role: 'Founder & product',
    focus: 'Shaping the vision and keeping every product decision grounded in student needs.',
    accent: 'lilac',
  },
  {
    name: 'Team member 02',
    role: 'Learning experience',
    focus: 'Turning evidence-informed ideas into support that feels practical, gentle, and clear.',
    accent: 'rose',
  },
  {
    name: 'Team member 03',
    role: 'Engineering',
    focus: 'Building a reliable, accessible experience that stays calm on every kind of day.',
    accent: 'sky',
  },
  {
    name: 'Team member 04',
    role: 'Community & partnerships',
    focus: 'Listening to students, educators, and counselors—and bringing those voices into the work.',
    accent: 'sage',
  },
] as const

const trustEvidence = [
  {
    title: 'Sensitive by default',
    body: 'Course, study, and mental-health preferences are treated as sensitive information and used to personalize support.',
    icon: <IconShield />,
  },
  {
    title: 'Support without surveillance',
    body: 'Apulza is built as a student companion—not a leaderboard, behavior score, or tool for comparing students.',
    icon: <IconHeart />,
  },
  {
    title: 'Clear care boundaries',
    body: 'Grounding tools and library resources are educational support, clearly labeled as not medical advice or clinical care.',
    icon: <IconBookmark />,
  },
]

const faqs = [
  {
    question: 'Is Apulza free?',
    answer:
      'Yes - it is free to start, with no card required. You can use the core study companion for as long as you like.',
  },
  {
    question: 'Is it only for students with ADHD?',
    answer:
      'No. It is designed around ADHD, anxiety, and low-energy days, but any student can use it when study feels heavy.',
  },
  {
    question: 'Will it nag me?',
    answer:
      'Never. Notifications are gentle, opt-in, and framed as ready when you are. You are always in control.',
  },
  {
    question: 'Is my data private?',
    answer:
      'Your study data is yours. Apulza is built as a calm companion, not a tracking or reporting tool.',
  },
  {
    question: 'Can my school use it?',
    answer:
      'Yes. Schools and counselors can bring Apulza to students as a shame-free support between sessions.',
  },
  {
    question: 'What if I fall behind?',
    answer:
      'There is no behind in Apulza. Streaks do not exist, plans reset quietly, and you simply pick up wherever you actually are.',
  },
]

function handleTilePointerMove(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const tile = event.currentTarget
  const bounds = tile.getBoundingClientRect()
  const x = (event.clientX - bounds.left) / bounds.width
  const y = (event.clientY - bounds.top) / bounds.height

  tile.style.setProperty('--tilt-x', `${(0.5 - y) * 7}deg`)
  tile.style.setProperty('--tilt-y', `${(x - 0.5) * 7}deg`)
  tile.style.setProperty('--cursor-x', `${x * 100}%`)
  tile.style.setProperty('--cursor-y', `${y * 100}%`)
}

function resetTileTilt(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty('--tilt-x', '0deg')
  event.currentTarget.style.setProperty('--tilt-y', '0deg')
}

function handleHeroCardPointerMove(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const card = event.currentTarget
  const bounds = card.getBoundingClientRect()
  const x = (event.clientX - bounds.left) / bounds.width
  const y = (event.clientY - bounds.top) / bounds.height
  const strength = Number(card.dataset.hoverStrength ?? '1')

  card.style.setProperty('--hero-shift-x', `${(x - 0.5) * 12 * strength}px`)
  card.style.setProperty('--hero-shift-y', `${((y - 0.5) * 8 - 2) * strength}px`)
}

function resetHeroCardPosition(event: ReactPointerEvent<HTMLElement>) {
  const nextTarget = event.relatedTarget
  if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
    return
  }

  event.currentTarget.style.setProperty('--hero-shift-x', '0px')
  event.currentTarget.style.setProperty('--hero-shift-y', '0px')
}

function resetUnhoveredHeroCards(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return

  const hoveredCard = event.target instanceof Element ? event.target.closest('.hero-hover-card') : null
  event.currentTarget.querySelectorAll<HTMLElement>('.hero-hover-card').forEach((card) => {
    if (card === hoveredCard) return
    card.style.setProperty('--hero-shift-x', '0px')
    card.style.setProperty('--hero-shift-y', '0px')
  })
}

function IconCheck({ className, size = 15 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.4"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconLinkedIn({ className, size = 22 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M5.4 7.75H2.2V21h3.2V7.75ZM3.8 2.5a1.86 1.86 0 1 0 0 3.72 1.86 1.86 0 0 0 0-3.72ZM12.67 7.75H9.6V21h3.2v-6.56c0-1.73.33-3.4 2.47-3.4 2.1 0 2.13 1.97 2.13 3.51V21h3.2v-7.27c0-3.57-.77-6.32-4.95-6.32-2.01 0-3.35 1.1-3.9 2.14h-.04V7.75Z" />
    </svg>
  )
}

function IconInstagram({ className, size = 22 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.7" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconClock({ className, size = 15 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  )
}

function IconHeart({ className, size = 17 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
    >
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  )
}

function IconPlay({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  )
}

function IconArrow({ className, size = 16 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
    >
      <line x1="5" x2="19" y1="12" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  )
}

function IconMenu({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2.2"
    >
      <line x1="4" x2="20" y1="7" y2="7" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="17" y2="17" />
    </svg>
  )
}

function IconAccessibility({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <circle cx="12" cy="4.5" r="2" />
      <path d="M5 8.5c2.2 1 4.5 1.5 7 1.5s4.8-.5 7-1.5" />
      <path d="m9.5 10-.8 4.3L6 20" />
      <path d="m14.5 10 .8 4.3L18 20" />
      <path d="M12 10v10" />
    </svg>
  )
}

function IconTheme({ className, dark, size = 18 }: IconProps & { dark: boolean }) {
  return dark ? (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </svg>
  ) : (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M20.6 15.2A8.5 8.5 0 0 1 8.8 3.4 8.5 8.5 0 1 0 20.6 15.2Z" />
    </svg>
  )
}

function IconClose({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2.2"
    >
      <line x1="6" x2="18" y1="6" y2="18" />
      <line x1="18" x2="6" y1="6" y2="18" />
    </svg>
  )
}

function IconBookmark({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  )
}

function IconSliders({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
    >
      <line x1="4" x2="20" y1="8" y2="8" />
      <circle cx="9" cy="8" r="2.6" fill="var(--bg)" />
      <line x1="4" x2="20" y1="16" y2="16" />
      <circle cx="15" cy="16" r="2.6" fill="var(--bg)" />
    </svg>
  )
}

function IconSpark({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5 9 9M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" />
    </svg>
  )
}

function IconShield({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
    >
      <path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" />
    </svg>
  )
}

function IconChevron({ className, open }: { className?: string; open: boolean }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.4"
      data-open={open}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Apulza home">
      <img className="brand-logo" src="/assets/logo_transparent.png" alt="" aria-hidden="true" />
      <span>Apulza</span>
    </a>
  )
}

function ButtonLink({
  children,
  href,
  variant = 'primary',
}: {
  children: ReactNode
  href: string
  variant?: 'primary' | 'secondary'
}) {
  return (
    <a className={`button ${variant === 'secondary' ? 'button-secondary' : ''}`} href={href}>
      {children}
    </a>
  )
}

function PulseLine({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 28" aria-hidden="true">
      <polyline points="0,14 50,14 64,14 74,4 86,24 96,8 106,17 118,14 160,14" />
    </svg>
  )
}

function StepDemo({ kind }: { kind: (typeof steps)[number]['demo'] }) {
  if (kind === 'account') {
    return (
      <div className="step-demo step-demo-input">
        <span>Support preferences saved</span>
        <IconCheck size={12} />
      </div>
    )
  }

  if (kind === 'courses') {
    return (
      <div className="step-demo step-demo-task">
        <span className="course-demo-icon" aria-hidden="true">CP</span>
        <strong>Cognitive Psychology</strong>
        <em>Added</em>
      </div>
    )
  }

  return (
    <div className="step-demo step-demo-resume">
      <span>Your plan is ready</span>
      <strong>5 manageable steps · Start whenever you are ready</strong>
    </div>
  )
}

function EditorialHero() {
  return (
    <section
      className="hero hero-editorial"
      id="top"
      onPointerMove={resetUnhoveredHeroCards}
    >
      <img
        className="hero-background"
        src="/assets/hero-landscape.png"
        alt=""
        aria-hidden="true"
      />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-aurora hero-aurora-two" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-kicker"><span /> A calmer way forward</p>
          <h1>
            Make space
            <br />
            for your <em>next</em>
            <br />
            small step.
          </h1>
          <p className="hero-lede">
            Apulza turns courses, assignments, and heavy days into a calmer way forward—with no
            streaks to lose and no pressure to perform.
          </p>
          <div className="hero-actions hero-actions-left">
            <ButtonLink href="#try">
              Try a small step
              <IconArrow />
            </ButtonLink>
            <ButtonLink href="#inside" variant="secondary">
              <IconPlay />
              Explore Apulza
            </ButtonLink>
          </div>
          <div className="hero-proof" aria-label="Apulza product qualities">
            <span><IconCheck /> Free to start</span>
            <span><IconCheck /> No card needed</span>
            <span><IconCheck /> Motion optional</span>
          </div>
        </div>

        <div className="hero-scenic-visual">
          <div className="hero-orbit hero-orbit-one" aria-hidden="true"><i /></div>
          <div className="hero-orbit hero-orbit-two" aria-hidden="true"><i /></div>
          <div
            className="hero-rhythm-card hero-hover-card"
            data-hover-strength="1.1"
            aria-hidden="true"
            onPointerMove={handleHeroCardPointerMove}
            onPointerLeave={resetHeroCardPosition}
            onPointerOut={resetHeroCardPosition}
          >
            <div className="hero-rhythm-head">
              <span><IconSpark size={14} /> Today&apos;s rhythm</span>
              <i>Flexible</i>
            </div>
            <div className="hero-rhythm-step is-complete">
              <span><IconCheck size={12} /></span>
              <p><strong>Open your notes</strong><small>2 min · a soft start</small></p>
            </div>
            <div className="hero-rhythm-step is-current">
              <span>2</span>
              <p><strong>Choose one passage</strong><small>Your next small step</small></p>
              <em>Now</em>
            </div>
            <div className="hero-rhythm-rest">
              <IconHeart size={13} /> Pause whenever you need.
            </div>
          </div>
          <article
            className="hero-focus-card hero-hover-card"
            data-hover-strength="0.75"
            aria-label="A glimpse inside Apulza"
            onPointerMove={handleHeroCardPointerMove}
            onPointerLeave={resetHeroCardPosition}
            onPointerOut={resetHeroCardPosition}
          >
            <div className="hero-focus-head">
              <span><IconHeart size={15} /> Ready when you are</span>
              <i>Today</i>
            </div>
            <h2>Rhetorical analysis</h2>
            <p>One small step is enough.</p>
            <div className="hero-task-row">
              <span className="hero-task-check"><IconCheck size={13} /></span>
              <span><strong>Choose one passage</strong><small>About 8 minutes</small></span>
              <button type="button" aria-label="Start this small step"><IconArrow size={14} /></button>
            </div>
            <div className="hero-progress"><span /></div>
            <small className="hero-progress-note">1 of 3 gentle steps · Half still counts</small>
          </article>
          <div className="hero-float-chip hero-float-chip-bottom">
            <span><IconSpark size={16} /></span>
            <p><small>Plan adjusted</small><strong>For a lower-energy day</strong></p>
          </div>
        </div>
      </div>
      <div className="hero-bottom-line">
        <span>Built for the day you're actually having.</span>
        <a href="#promises">Scroll to explore <IconChevron open /></a>
      </div>
    </section>
  )
}

function DashboardPreview() {
  const courses = [
    { code: 'OC', name: 'Organic Chemistry', status: 'Plan ready', tone: 'violet' },
    { code: 'UH', name: 'U.S. History', status: 'Plan ready', tone: 'blue' },
    { code: 'CI', name: 'Calculus II', status: 'Set up plan', tone: 'amber' },
  ]

  return (
    <aside
      className="dashboard-preview interactive-tile motion-reveal"
      aria-label="Dashboard preview"
      onPointerMove={handleTilePointerMove}
      onPointerLeave={resetTileTilt}
    >
      <div className="browser-bar">
        <span />
        <span />
        <span />
        <strong>Good afternoon, Maya</strong>
      </div>
      <div className="dashboard-body dashboard-snippet-body">
        <div className="dash-assignment-card">
          <div className="small-label">
            <IconHeart />
            Ready when you are
          </div>
          <h3>Rhetorical Analysis Essay</h3>
          <p>English 201 · Due in 2 days</p>
          <div className="dash-assignment-actions">
            <a href="#try"><IconPlay /> Open</a>
            <span><IconClock size={13} /> Essay</span>
          </div>
        </div>

        <div className="dash-stat-grid">
          <div className="dash-stat-card dash-minutes-card">
            <span className="dash-card-label"><IconClock size={14} /> Study time this month</span>
            <strong>140 <small>min</small></strong>
            <p>That is real progress, and it is still climbing.</p>
            <div className="dash-chart" aria-hidden="true"><i /><i /></div>
          </div>
          <div className="dash-stat-card dash-completed-card">
            <div><span className="dash-card-label">Completed this month</span><strong>4</strong></div>
            <div className="dash-complete-tally">
              {[0, 1, 2, 3].map((item) => <span key={item}><IconCheck size={13} /></span>)}
            </div>
            <p>4 assignments done—nice work.</p>
          </div>
        </div>

        <div className="dash-courses-card">
          <div className="dash-courses-head">
            <h3>Your courses</h3>
            <p>3 of 4 have a study plan ready.</p>
          </div>
          {courses.map((course) => (
            <div className="dash-course-row" key={course.code}>
              <span className="dash-course-code" data-tone={course.tone}>{course.code}</span>
              <strong>{course.name}</strong>
              <em data-ready={course.status === 'Plan ready'}>{course.status}</em>
            </div>
          ))}
          <button className="dash-add-course" type="button"><span>+</span> Add a course</button>
        </div>

        <a className="dash-continue-row" href="#try">
          <span className="dash-continue-icon"><IconBookmark size={16} /></span>
          <span>
            <small>Continue where you left off</small>
            <strong>Problem Set 4</strong>
            <em>You are on step 2 of 5 · Calculus II</em>
          </span>
          <b>Continue <IconArrow size={13} /></b>
        </a>
      </div>
    </aside>
  )
}

const cafePetTargets = [
  { id: 'midnight', name: 'Midnight', style: { left: '67%', top: '57.69%', width: '8.5%', height: '14.23%' } },
  { id: 'cloud', name: 'Cloud', style: { left: '29%', top: '45.38%', width: '8.5%', height: '14.23%' } },
  { id: 'truffle', name: 'Truffle', style: { left: '53%', top: '76.15%', width: '8.16%', height: '13.66%' } },
  { id: 'ember', name: 'Ember', style: { left: '11.5%', top: '82.31%', width: '8.5%', height: '14.23%' } },
  { id: 'feather', name: 'Feather', style: { left: '53.5%', top: '57.69%', width: '8.5%', height: '14.23%' } },
] as const

type CafeCatId = (typeof cafePetTargets)[number]['id']
type CatDiscoveryHandler = (cat: CafeCatId, name: string, message: string) => void

const cafeCatNames = Object.fromEntries(
  cafePetTargets.map((cat) => [cat.id, cat.name]),
) as Record<CafeCatId, string>

function extractCafeCatSvg(name: string) {
  const catStart = catCafeSceneHtml.indexOf(`title="${name}"`)
  const svgStart = catCafeSceneHtml.indexOf('<svg viewBox="0 0 72 78">', catStart)
  const svgEnd = catCafeSceneHtml.indexOf('</svg>', svgStart)

  return catStart >= 0 && svgStart >= 0 && svgEnd >= 0
    ? catCafeSceneHtml.slice(svgStart, svgEnd + 6)
    : ''
}

const cafeCatSvgAssets = Object.fromEntries(
  cafePetTargets.map((cat) => [cat.id, extractCafeCatSvg(cat.name)]),
) as Record<CafeCatId, string>

function CafeCatAsset({ cat }: { cat: CafeCatId }) {
  return (
    <span
      className={`cafe-cat-asset cafe-cat-asset-${cat}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: cafeCatSvgAssets[cat] }}
    />
  )
}

function CatEasterEgg({
  cat,
  className,
  found,
  message,
  onDiscover,
}: {
  cat: CafeCatId
  className: string
  found: boolean
  message: string
  onDiscover: CatDiscoveryHandler
}) {
  const name = cafeCatNames[cat]

  return (
    <button
      className={`cat-easter-egg ${className}`}
      type="button"
      aria-label={`Say hello to ${name}, a hidden Cat Cafe cat`}
      aria-pressed={found}
      data-found={found}
      title={`Say hello to ${name}`}
      onClick={() => onDiscover(cat, name, message)}
    >
      <CafeCatAsset cat={cat} />
      <span className="cat-egg-whisper">{found ? `${name} found!` : 'psst…'}</span>
    </button>
  )
}

function CatTrailToast({
  cat,
  count,
  message,
  onDismiss,
}: {
  cat: CafeCatId
  count: number
  message: string
  onDismiss: () => void
}) {
  return (
    <aside className="cat-trail-toast" role="status" aria-live="polite">
      <CafeCatAsset cat={cat} />
      <span>
        <strong>{message}</strong>
        <small>{count === cafePetTargets.length ? 'The whole cafe crew is here!' : `${count} of ${cafePetTargets.length} cafe cats found`}</small>
      </span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss cat message">
        <IconClose size={15} />
      </button>
    </aside>
  )
}

const StaticCatCafeScene = memo(function StaticCatCafeScene() {
  return (
    <>
      <style>{catCafeSceneCss}</style>
      <div dangerouslySetInnerHTML={{ __html: catCafeSceneHtml }} />
    </>
  )
})

function CatCafeSnippet() {
  const [petCounts, setPetCounts] = useState<Record<string, number>>({})
  const [lastPetted, setLastPetted] = useState('')

  const petCat = (id: string, name: string) => {
    setPetCounts((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }))
    setLastPetted(`${name} loved that!`)
  }

  return (
    <div className="product-snippet cafe-snippet" aria-label="My Cat Cafe focus space preview">
      <div className="cafe-head">
        <div>
          <h3>My Cat Cafe</h3>
          <p>Quiet company for this focus session</p>
        </div>
        <div className="cafe-pills" aria-label="Café status">
          <span className="coin-pill">♡ Optional space</span>
          <span className="clawset-pill">▣ Clawset</span>
          <span><i className="time-dot" /> Morning · 3:38 PM</span>
        </div>
      </div>
      <div className="cafe-room-bar">
        <span className="cafe-room-pill"><i /> Lounge <em>5</em></span>
        <span className="pet-hint">Click a cat to give them a pet</span>
      </div>
      <div className="cafe-scene-shell">
        <StaticCatCafeScene />
        <div className="cafe-pet-targets">
          {cafePetTargets.map((cat) => {
            const count = petCounts[cat.id]
            return (
              <span
                className={`cafe-pet-target-motion pet-${cat.id}`}
                style={cat.style}
                key={cat.id}
              >
                <button
                  className="cafe-pet-target"
                  type="button"
                  aria-label={`Pet ${cat.name}`}
                  onClick={() => petCat(cat.id, cat.name)}
                >
                  {count ? (
                    <span className="pet-hearts" key={count} aria-hidden="true">
                      <span>♥</span><span>♥</span><span>♥</span>
                    </span>
                  ) : null}
                </button>
              </span>
            )
          })}
        </div>
      </div>
      <div className="cafe-footer">
        <span><i /> Studying</span>
        <span className="pet-response" aria-live="polite">{lastPetted}</span>
      </div>
    </div>
  )
}

function StudyPlanSnippet() {
  return (
    <div className="product-snippet plan-snippet" aria-label="Personalized study plan preview">
      <div className="plan-summary">
        <span>Your plan</span>
        <p>
          A steady, low-pressure approach built around short focus blocks and spaced review—paced
          for how you actually study.
        </p>
        <small>Generated for Cognitive Psychology</small>
      </div>
      <div className="snippet-card strategy-card">
        <div className="snippet-card-head">
          <span aria-hidden="true">●</span>
          <h3>Study strategies</h3>
        </div>
        <div className="strategy-row">
          <strong>Break sessions into 25-minute focus blocks</strong>
          <p>Clear stopping points make it easier to begin and easier to come back.</p>
        </div>
        <div className="strategy-row">
          <strong>Review notes within 24 hours</strong>
          <p>A quick ten-minute pass helps the material stay available for longer.</p>
        </div>
      </div>
      <div className="snippet-card session-card">
        <div className="snippet-card-head">
          <span aria-hidden="true">●</span>
          <h3>Study session structure</h3>
          <em>70 min total</em>
        </div>
        <div className="session-blocks">
          {[
            ['Warm-up', '5 min'],
            ['Focus block', '25 min'],
            ['Reset', '5 min'],
            ['Focus block', '25 min'],
            ['Wrap-up', '10 min'],
          ].map(([label, time], index) => (
            <div className="session-block" data-break={index === 2} key={label + index}>
              <span>{label}</span>
              <strong>{time}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ApulzaBotSnippet() {
  return (
    <div className="product-snippet bot-snippet" aria-label="ApulzaBot assignment support preview">
      <div className="bot-head">
        <span className="bot-avatar"><IconSpark size={17} /></span>
        <div>
          <h3>ApulzaBot</h3>
          <p>Working with Rhetorical Analysis Essay</p>
        </div>
        <em>Course context on</em>
      </div>
      <div className="bot-context">
        <span>English 201</span>
        <span>Due in 2 days</span>
        <span>Step 2 of 5</span>
      </div>
      <div className="bot-thread">
        <div className="bot-message bot-message-assistant">
          <span>ApulzaBot</span>
          <p>You already chose your article. Want to find one passage that supports your main idea?</p>
        </div>
        <div className="bot-message bot-message-user">
          <p>I know what I want to say, but I cannot figure out how to start.</p>
        </div>
        <div className="bot-message bot-message-assistant">
          <span>ApulzaBot</span>
          <p>Let’s make the opening smaller. Write one rough sentence beginning with “The author wants the reader to…”</p>
        </div>
      </div>
      <div className="bot-actions" aria-label="Suggested ApulzaBot actions">
        <span>Give me an example</span>
        <span>Make this step smaller</span>
        <span>Help me begin</span>
      </div>
    </div>
  )
}

function ProductSnippets({
  foundCats,
  onDiscoverCat,
}: {
  foundCats: CafeCatId[]
  onDiscoverCat: CatDiscoveryHandler
}) {
  return (
    <section className="inside-section" id="inside" aria-labelledby="inside-title">
      <div className="section inside-inner">
        <CatEasterEgg
          cat="ember"
          className="inside-cat-egg"
          found={foundCats.includes('ember')}
          message="Ember is taking one tiny lap through the study loop."
          onDiscover={onDiscoverCat}
        />
        <div className="section-intro centered motion-reveal">
          <p className="eyebrow">Inside Apulza</p>
          <h2 id="inside-title">One calm place for the whole study loop.</h2>
          <p className="section-lede">
            Once your courses are in, Apulza helps you orient, work, regulate, and return without
            asking you to maintain a perfect routine.
          </p>
        </div>
        <article className="snippet-feature snippet-feature-dashboard">
          <div className="snippet-copy motion-reveal">
            <span className="snippet-number">01</span>
            <p className="eyebrow">Orient</p>
            <h3>Open Apulza and know where to begin.</h3>
            <p>
              The dashboard is a calm home base: where you left off, one useful next action, and
              month-scoped progress framed as encouragement instead of comparison.
            </p>
            <ul className="snippet-benefits">
              {showcasePoints.map((point) => <li key={point}><IconCheck /> {point}</li>)}
            </ul>
          </div>
          <div className="snippet-frame dashboard-snippet-frame motion-reveal"><DashboardPreview /></div>
        </article>
        <article className="snippet-feature snippet-feature-plan snippet-feature-reverse">
          <div className="snippet-copy motion-reveal">
            <span className="snippet-number">02</span>
            <p className="eyebrow">AI study plans</p>
            <h3>Structure that bends around the student.</h3>
            <p>
              Apulza turns each course into practical strategies, realistic focus blocks, and a
              manageable rhythm. Every suggestion stays connected to the actual course.
            </p>
            <ul className="snippet-benefits">
              <li><IconCheck /> Generated for the course—not a generic checklist</li>
              <li><IconCheck /> Clear stopping points and built-in resets</li>
              <li><IconCheck /> Easy to adjust when capacity or deadlines change</li>
            </ul>
          </div>
          <div className="snippet-frame motion-reveal"><StudyPlanSnippet /></div>
        </article>
        <article className="snippet-feature snippet-feature-bot">
          <div className="snippet-copy motion-reveal">
            <span className="snippet-number">03</span>
            <p className="eyebrow">Work through it</p>
            <h3>Help that already knows the assignment.</h3>
            <p>
              ApulzaBot understands the course, assignment, and current study-plan step. It helps
              a student decide, begin, understand, and continue—not simply produce an answer.
            </p>
            <ul className="snippet-benefits">
              <li><IconCheck /> Keeps the course and assignment in context</li>
              <li><IconCheck /> Breaks a difficult moment into a smaller action</li>
              <li><IconCheck /> Supports the work without taking it over</li>
            </ul>
          </div>
          <div className="snippet-frame motion-reveal"><ApulzaBotSnippet /></div>
        </article>
        <article className="snippet-feature snippet-feature-cafe snippet-feature-reverse">
          <div className="snippet-copy motion-reveal">
            <span className="snippet-number">04</span>
            <p className="eyebrow">Focus and return</p>
            <h3>A companion when quiet company helps.</h3>
            <p>
              My Cat Cafe offers optional ambient body-doubling during focus sessions. Students can
              spend time with a cat companion and make the space their own—or skip it entirely.
            </p>
            <ul className="snippet-benefits">
              <li><IconCheck /> Entirely optional, with no penalty for taking a break</li>
              <li><IconCheck /> My Clawset lets students customize their cats without a grind loop</li>
              <li><IconCheck /> No leaderboard, streak, or competitive pressure</li>
            </ul>
          </div>
          <div className="snippet-frame motion-reveal"><CatCafeSnippet /></div>
        </article>
        <div className="support-tools motion-reveal" aria-labelledby="support-tools-title">
          <div className="support-tools-intro">
            <p className="eyebrow">Support for the moment</p>
            <h3 id="support-tools-title">Useful when you need it. Quiet when you do not.</h3>
            <p>These tools stay close without becoming another routine to maintain.</p>
          </div>
          <div className="support-tool-grid">
            <article>
              <span className="support-tool-icon"><IconHeart /></span>
              <p className="eyebrow">Breathing & grounding</p>
              <h4>A short reset for overwhelmed moments.</h4>
              <p>Quick regulation exercises can come before a task, between steps, or not at all.</p>
              <div className="breathing-preview"><i /> Breathe in <em>4 seconds</em></div>
            </article>
            <article>
              <span className="support-tool-icon"><IconSliders /></span>
              <p className="eyebrow">My Clawset</p>
              <h4>Customize your cats without pressure.</h4>
              <p>Choose simple looks for your cats. Nothing expires when you step away.</p>
              <div className="clawset-preview"><i /><i /><i /><span>Make your cats your own</span></div>
            </article>
            <article>
              <span className="support-tool-icon"><IconBookmark /></span>
              <p className="eyebrow">Resources library</p>
              <h4>Understand your brain, not just the workload.</h4>
              <p>Evidence-based ADHD strategies, medication education, and harm-reduction content.</p>
              <div className="resource-preview"><span>ADHD strategies</span><span>Medication education</span><span>Harm reduction</span></div>
              <small>Educational information—not medical advice.</small>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

function TinyDemo({
  foundCats,
  onDiscoverCat,
}: {
  foundCats: CafeCatId[]
  onDiscoverCat: CatDiscoveryHandler
}) {
  const [task, setTask] = useState('')
  const [nextStep, setNextStep] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = task.trim().toLowerCase()

    if (normalized.includes('read') || normalized.includes('chapter')) {
      setNextStep('Open it and read the first three pages. Stop there if that is enough for today.')
    } else if (normalized.includes('essay') || normalized.includes('write')) {
      setNextStep('Write three rough bullet points. They do not need to be complete sentences.')
    } else if (normalized.includes('practice') || normalized.includes('problem')) {
      setNextStep('Try the first two questions, then take a short pause.')
    } else {
      setNextStep('Work on it for ten gentle minutes. You can decide what comes next after that.')
    }
  }

  return (
    <section className="tiny-demo" id="try" aria-labelledby="tiny-demo-title">
      <div className="tiny-demo-copy">
        <p className="eyebrow">Try it now</p>
        <h2 id="tiny-demo-title">Turn something heavy into one small step.</h2>
        <p>No account and no setup. Type one thing that is on your mind.</p>
      </div>
      <form
        className="tiny-demo-card interactive-tile motion-reveal"
        onSubmit={handleSubmit}
        onPointerMove={handleTilePointerMove}
        onPointerLeave={resetTileTilt}
      >
        <CatEasterEgg
          cat="truffle"
          className="tiny-demo-cat-egg"
          found={foundCats.includes('truffle')}
          message="Truffle approves this very manageable step."
          onDiscover={onDiscoverCat}
        />
        <label htmlFor="tiny-task">What do you need to do?</label>
        <div className="tiny-demo-input-row">
          <input
            id="tiny-task"
            type="text"
            value={task}
            onChange={(event) => {
              setTask(event.target.value)
              setNextStep('')
            }}
            placeholder="Read chapter 4"
            required
          />
          <button className="button" type="submit">Show my next step</button>
        </div>
        <div className="tiny-demo-result" aria-live="polite" data-visible={Boolean(nextStep)}>
          {nextStep ? (
            <>
              <span><IconSpark size={16} /> Your next small step</span>
              <strong>{nextStep}</strong>
            </>
          ) : (
            <span>Your suggestion will appear here.</span>
          )}
        </div>
      </form>
    </section>
  )
}

function DemoRequestForm() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const name = String(form.get('name') || '')
    const email = String(form.get('email') || '')
    const role = String(form.get('role') || '')

    setSubmissionState('submitting')

    try {
      const collected = await submitInquiry(formElement)

      if (collected) {
        formElement.reset()
        setSubmissionState('success')
        return
      }

      openEmailFallback(`Apulza walkthrough request from ${name}`, [
        "I'd like to request an Apulza walkthrough.",
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `I am a: ${role}`,
      ])
      setSubmissionState('email')
    } catch {
      setSubmissionState('error')
    }
  }

  return (
    <form className="demo-form" onSubmit={handleSubmit}>
      <input type="hidden" name="form_type" value="Demo request" />
      <input type="hidden" name="_subject" value="New Apulza demo request" />
      <input
        className="form-honeypot"
        name="_gotcha"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="field-row">
        <label>
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" placeholder="Alex Morgan" required />
        </label>
        <label>
          <span>Email address</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alex@school.edu"
            required
          />
        </label>
      </div>
      <label>
        <span>I am a...</span>
        <select name="role" defaultValue="" required>
          <option value="" disabled>Select your role</option>
          <option>Parent or guardian</option>
          <option>Teacher or counselor</option>
          <option>School leader</option>
          <option>Other</option>
        </select>
      </label>
      <button
        className="button demo-submit"
        type="submit"
        disabled={submissionState === 'submitting'}
      >
        {submissionState === 'submitting' ? 'Sending request…' : 'Request a walkthrough'}
        <IconArrow />
      </button>
      <p className="form-note">
        No commitment. We’ll only use these details to respond to your request.
      </p>
      <FormStatus state={submissionState} successMessage="Thanks—your walkthrough request is in. We’ll be in touch soon." />
    </form>
  )
}

function FormStatus({ state, successMessage }: { state: SubmissionState; successMessage: string }) {
  if (state === 'idle' || state === 'submitting') return null

  const messages: Record<Exclude<SubmissionState, 'idle' | 'submitting'>, string> = {
    success: successMessage,
    error: 'Something went wrong. Please try again or email apulzaai@outlook.com.',
    email: "Your message is ready in your email app. Send it when you're ready.",
  }

  return (
    <p className="form-status" data-state={state} role="status">
      {messages[state]}
    </p>
  )
}

function ContactForm() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const name = String(form.get('name') || '')
    const email = String(form.get('email') || '')
    const inquiryType = String(form.get('inquiry_type') || '')
    const organization = String(form.get('organization') || '')
    const message = String(form.get('message') || '')

    setSubmissionState('submitting')

    try {
      const collected = await submitInquiry(formElement)

      if (collected) {
        formElement.reset()
        setSubmissionState('success')
        return
      }

      openEmailFallback(`${inquiryType || 'Website'} inquiry from ${name}`, [
        `Name: ${name}`,
        `Email: ${email}`,
        `Inquiry: ${inquiryType}`,
        `Organization: ${organization || 'Not provided'}`,
        '',
        message,
      ])
      setSubmissionState('email')
    } catch {
      setSubmissionState('error')
    }
  }

  return (
    <form className="demo-form contact-form" onSubmit={handleSubmit}>
      <input type="hidden" name="form_type" value="Contact inquiry" />
      <input type="hidden" name="_subject" value="New Apulza contact inquiry" />
      <input
        className="form-honeypot"
        name="_gotcha"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="field-row">
        <label>
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" placeholder="Alex Morgan" required />
        </label>
        <label>
          <span>Email address</span>
          <input name="email" type="email" autoComplete="email" placeholder="alex@example.com" required />
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>What can we help with?</span>
          <select name="inquiry_type" defaultValue="" required>
            <option value="" disabled>Select a topic</option>
            <option>General question</option>
            <option>Jobs & collaboration</option>
            <option>Partnership</option>
            <option>Press or media</option>
            <option>Something else</option>
          </select>
        </label>
        <label>
          <span>Organization <em>(optional)</em></span>
          <input name="organization" type="text" autoComplete="organization" placeholder="School, company, or group" />
        </label>
      </div>
      <label>
        <span>Your message</span>
        <textarea
          name="message"
          placeholder="Tell us what you have in mind. For job inquiries, you can include a LinkedIn or portfolio link."
          required
        />
      </label>
      <button
        className="button demo-submit"
        type="submit"
        disabled={submissionState === 'submitting'}
      >
        {submissionState === 'submitting' ? 'Sending message…' : 'Send message'}
        <IconArrow />
      </button>
      <p className="form-note">
        Please don’t include private health or student information. We’ll use your details only to reply.
      </p>
      <FormStatus state={submissionState} successMessage="Thanks—your message has been sent. We’ll get back to you soon." />
    </form>
  )
}

type AccessibilityMenuProps = {
  isOpen: boolean
  onToggle: () => void
  settings: AccessibilitySettings
  onChange: (next: AccessibilitySettings) => void
}

function AccessibilityMenu({ isOpen, onToggle, settings, onChange }: AccessibilityMenuProps) {
  const updateSetting = <Key extends keyof AccessibilitySettings>(
    key: Key,
    value: AccessibilitySettings[Key],
  ) => onChange({ ...settings, [key]: value })

  const activeCount = [
    settings.darkMode,
    settings.lowStimulation,
    settings.textSize !== 'default',
    settings.dyslexiaFriendly,
    settings.highContrast,
    settings.emphasizeLinks,
  ].filter(Boolean).length

  const toggleRows = [
    {
      key: 'darkMode' as const,
      label: 'Dark mode',
      description: 'Use a softer low-light palette across the site.',
    },
    {
      key: 'lowStimulation' as const,
      label: 'Low stimulation',
      description: 'Reduce motion, effects, and decorative imagery.',
    },
    {
      key: 'dyslexiaFriendly' as const,
      label: 'Dyslexia-friendly font',
      description: 'Use Lexend with roomier letter and line spacing.',
    },
    {
      key: 'highContrast' as const,
      label: 'Higher contrast',
      description: 'Strengthen text, borders, and focus indicators.',
    },
    {
      key: 'emphasizeLinks' as const,
      label: 'Emphasize links',
      description: 'Underline links so they are easier to identify.',
    },
  ]

  return (
    <div className="accessibility-menu-shell">
      <button
        className="accessibility-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="accessibility-menu"
        aria-haspopup="dialog"
        onClick={onToggle}
      >
        <IconAccessibility size={17} />
        <span>Accessibility</span>
        {activeCount > 0 ? <b aria-label={`${activeCount} settings active`}>{activeCount}</b> : null}
      </button>

      {isOpen ? (
        <section
          className="accessibility-menu"
          id="accessibility-menu"
          role="dialog"
          aria-labelledby="accessibility-title"
        >
          <div className="accessibility-menu-head">
            <div>
              <span className="accessibility-kicker">Make this space yours</span>
              <h2 id="accessibility-title">Accessibility</h2>
            </div>
            <button className="accessibility-close" type="button" onClick={onToggle} aria-label="Close accessibility menu">
              <IconClose size={18} />
            </button>
          </div>

          <div className="accessibility-text-control">
            <div>
              <strong>Text size</strong>
              <span>Adjust text across the whole site.</span>
            </div>
            <div className="text-size-options" role="group" aria-label="Text size">
              {([
                ['small', 'A', 'Small'],
                ['default', 'A', 'Default'],
                ['large', 'A', 'Large'],
              ] as const).map(([value, label, accessibleLabel]) => (
                <button
                  type="button"
                  className={`text-size-${value}`}
                  aria-label={`${accessibleLabel} text`}
                  aria-pressed={settings.textSize === value}
                  onClick={() => updateSetting('textSize', value)}
                  key={value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="accessibility-options">
            {toggleRows.map((row) => (
              <button
                className="accessibility-option"
                type="button"
                role="switch"
                aria-checked={settings[row.key]}
                onClick={() => updateSetting(row.key, !settings[row.key])}
                key={row.key}
              >
                <span>
                  <strong>{row.label}</strong>
                  <small>{row.description}</small>
                </span>
                <i aria-hidden="true"><b /></i>
              </button>
            ))}
          </div>

          <div className="accessibility-menu-foot">
            <span>Preferences are saved on this device.</span>
            <button type="button" onClick={() => onChange(defaultAccessibilitySettings)} disabled={activeCount === 0}>
              Reset all
            </button>
          </div>
        </section>
      ) : null}
    </div>
  )
}

function App() {
  const [openFaq, setOpenFaq] = useState(0)
  const [accessibilitySettings, setAccessibilitySettings] = useState(loadAccessibilitySettings)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [foundCats, setFoundCats] = useState<CafeCatId[]>([])
  const [lastFoundCat, setLastFoundCat] = useState<CafeCatId | null>(null)
  const [catTrailMessage, setCatTrailMessage] = useState('')
  const [catTrailOpen, setCatTrailOpen] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(accessibilityStorageKey, JSON.stringify(accessibilitySettings))
  }, [accessibilitySettings])

  useEffect(() => {
    document.documentElement.dataset.apulzaTextSize = accessibilitySettings.textSize

    return () => {
      delete document.documentElement.dataset.apulzaTextSize
    }
  }, [accessibilitySettings.textSize])

  useEffect(() => {
    document.documentElement.style.colorScheme = accessibilitySettings.darkMode ? 'dark' : 'light'

    return () => {
      document.documentElement.style.removeProperty('color-scheme')
    }
  }, [accessibilitySettings.darkMode])

  useEffect(() => {
    const progress = document.querySelector<HTMLElement>('.scroll-progress')
    let animationFrame = 0

    const updateHeader = () => {
      setHeaderScrolled(window.scrollY > 24)
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
        progress?.style.setProperty('--scroll-progress', String(ratio))
      })
    }

    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', updateHeader)
    }
  }, [])

  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.motion-reveal'))

    if (
      accessibilitySettings.lowStimulation ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      reveals.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -9% 0px', threshold: 0.12 },
    )

    reveals.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [accessibilitySettings.lowStimulation])

  useEffect(() => {
    if (!mobileMenuOpen && !accessibilityOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
        setAccessibilityOpen(false)
      }
    }

    const closeOutsideHeader = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Node && !document.querySelector('.site-header')?.contains(target)) {
        setMobileMenuOpen(false)
        setAccessibilityOpen(false)
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOutsideHeader)

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOutsideHeader)
    }
  }, [mobileMenuOpen, accessibilityOpen])

  const accessibilityClasses = [
    accessibilitySettings.darkMode && 'theme-dark',
    accessibilitySettings.lowStimulation && 'is-low-stim',
    `accessibility-text-${accessibilitySettings.textSize}`,
    accessibilitySettings.dyslexiaFriendly && 'accessibility-lexend',
    accessibilitySettings.highContrast && 'accessibility-high-contrast',
    accessibilitySettings.emphasizeLinks && 'accessibility-emphasize-links',
  ].filter(Boolean).join(' ')

  const discoverCat: CatDiscoveryHandler = (cat, name, message) => {
    setFoundCats((current) => current.includes(cat) ? current : [...current, cat])
    setLastFoundCat(cat)
    setCatTrailMessage(foundCats.includes(cat) ? `${name} is always happy to see you again.` : message)
    setCatTrailOpen(true)
  }

  return (
    <main className={`app ${accessibilityClasses}`}>
      <div className="scroll-progress" aria-hidden="true" />
      <header className={`site-header${headerScrolled ? ' is-scrolled' : ''}`}>
        <Brand />
        <nav
          className={`nav${mobileMenuOpen ? ' is-open' : ''}`}
          id="mobile-navigation"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <a href={item.href} key={item.href} onClick={() => {
              setMobileMenuOpen(false)
              setAccessibilityOpen(false)
            }}>
              {item.label}
            </a>
          ))}
          <button
            className="theme-toggle"
            type="button"
            aria-pressed={accessibilitySettings.darkMode}
            aria-label={accessibilitySettings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={accessibilitySettings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setAccessibilitySettings((current) => ({
              ...current,
              darkMode: !current.darkMode,
            }))}
          >
            <IconTheme dark={accessibilitySettings.darkMode} />
          </button>
          <AccessibilityMenu
            isOpen={accessibilityOpen}
            onToggle={() => setAccessibilityOpen((current) => !current)}
            settings={accessibilitySettings}
            onChange={setAccessibilitySettings}
          />
          <a className="nav-cta" href="#try" onClick={() => setMobileMenuOpen(false)}>
            Try it now
          </a>
        </nav>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => {
            setAccessibilityOpen(false)
            setMobileMenuOpen((current) => !current)
          }}
        >
          {mobileMenuOpen ? <IconClose /> : <IconMenu />}
        </button>
      </header>

      <EditorialHero />

      <section className="trust-strip" id="promises" aria-label="Product promises">
        {trustPoints.map((point) => (
          <span key={point.label}>
            {point.icon}
            <b>{point.label}</b>
          </span>
        ))}
      </section>

      <section className="section-band" id="how">
        <div className="section centered">
          <CatEasterEgg
            cat="midnight"
            className="how-cat-egg"
            found={foundCats.includes('midnight')}
            message="Midnight found a quiet place to watch the first small step."
            onDiscover={discoverCat}
          />
          <p className="eyebrow motion-reveal">How it works</p>
          <h2 className="motion-reveal">Three small steps to get started.</h2>
          <p className="section-lede motion-reveal">
            No setup marathon and no productivity system to learn. Apulza introduces what you need
            just in time.
          </p>
          <div className="step-grid">
            {steps.map((step) => (
              <article
                className="step-card interactive-tile motion-reveal"
                key={step.title}
                onPointerMove={handleTilePointerMove}
                onPointerLeave={resetTileTilt}
              >
                <div className="step-card-heading">
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                </div>
                <p>{step.body}</p>
                <StepDemo kind={step.demo} />
              </article>
            ))}
          </div>
          <a className="how-bridge motion-reveal" href="#inside">
            <span>
              <small>Once your plan is ready</small>
              <strong>Apulza stays with you through the work.</strong>
            </span>
            <IconArrow />
          </a>
        </div>
      </section>

      <ProductSnippets foundCats={foundCats} onDiscoverCat={discoverCat} />

      <MobileAppShowcase />

      <TinyDemo foundCats={foundCats} onDiscoverCat={discoverCat} />

      <section className="clear-band" id="clear">
        <div className="section clear-inner">
          <section
            className="trust-proof motion-reveal"
            id="privacy"
            aria-labelledby="privacy-title"
          >
            <div className="trust-proof-intro">
              <p className="eyebrow">Safety & privacy</p>
              <h2 id="privacy-title">Sensitive support deserves clear boundaries.</h2>
              <p>
                Apulza handles course context and personal preferences as sensitive information.
                The product is designed to support a student—not score, compare, or watch them.
              </p>
            </div>
            <div className="evidence-grid" aria-label="Safety and privacy commitments">
              {trustEvidence.map((item) => (
                <article key={item.title}>
                  <span>{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
            <p className="evidence-note">
              Apulza is a study support tool, not medical care or a replacement for a counselor.
            </p>
          </section>
          <div className="section-intro motion-reveal">
            <p className="eyebrow">Our foundation</p>
            <h2>Everything is built on CLEAR.</h2>
            <p className="section-lede">
              Five principles act as the acceptance test for every screen. A feature isn't finished
              until it satisfies all five.
            </p>
          </div>
          <div className="clear-grid" aria-label="CLEAR principles">
            {clearPrinciples.map((principle) => (
              <article
                className="clear-card interactive-tile motion-reveal"
                key={principle.letter}
                onPointerMove={handleTilePointerMove}
                onPointerLeave={resetTileTilt}
              >
                <span>{principle.letter}</span>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="team-band" id="team" aria-labelledby="team-title">
        <div className="section team-section">
          <div className="team-intro motion-reveal">
            <div>
              <p className="eyebrow">Meet the team</p>
              <h2 id="team-title">The people behind the calmer way to study.</h2>
            </div>
            <p>
              Apulza is shaped by a small, thoughtful team bringing together product, learning,
              technology, and community care. We’ll introduce everyone properly soon.
            </p>
          </div>
          <div className="team-grid" aria-label="Apulza team profiles">
            {teamMembers.map((member, index) => (
              <article className="team-card motion-reveal" key={member.name}>
                <div
                  className="team-portrait"
                  data-accent={member.accent}
                  role="img"
                  aria-label={`Profile photo placeholder for ${member.name}`}
                >
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <small>Photo coming soon</small>
                </div>
                <div className="team-card-copy">
                  <p>{member.role}</p>
                  <h3>{member.name}</h3>
                  <span>{member.focus}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section school-section" id="schools">
        <CatEasterEgg
          cat="cloud"
          className="school-cat-egg"
          found={foundCats.includes('cloud')}
          message="Cloud says calm support belongs in every study space."
          onDiscover={discoverCat}
        />
        <div className="school-card motion-reveal">
          <div className="school-copy">
            <p className="eyebrow">For schools and counselors</p>
            <h2>Support that works alongside you.</h2>
            <p>
              Apulza gives students a steady place to keep going between sessions - built on
              evidence-informed, shame-free principles you can stand behind.
            </p>
            <ul className="check-list">
              {schoolPoints.map((point) => (
                <li key={point}>
                  <IconCheck />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href="#demo">Request a school demo</ButtonLink>
          </div>
          <div className="school-image">
            <img
              src="/assets/school-study-room.png"
              alt="A calm, sunlit study space with students working quietly."
            />
          </div>
        </div>
      </section>

      <section className="section-band faq-band" id="faq">
        <div className="section faq-section">
          <div className="section-intro centered">
            <p className="eyebrow">Questions</p>
            <h2>The things people ask first.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index

              return (
                <div className="faq-item motion-reveal" data-open={isOpen} key={faq.question}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  >
                    <span>{faq.question}</span>
                    <IconChevron open={isOpen} />
                  </button>
                  <div id={`faq-answer-${index}`} hidden={!isOpen}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="closing" id="demo">
        <div className="closing-inner">
          <div className="demo-copy motion-reveal">
            <PulseLine />
            <p className="eyebrow">A closer look</p>
            <h2>Bring calmer study support to your students.</h2>
            <p>
              Schools, counselors, and families can request a calm, personal walkthrough. Students
              can try the small-step experience above without filling out a form.
            </p>
            <ul className="demo-promises">
              <li>
                <IconCheck /> A calm, personal walkthrough
              </li>
              <li>
                <IconCheck /> Time for your questions
              </li>
              <li>
                <IconCheck /> No pressure or commitment
              </li>
            </ul>
          </div>
          <div className="motion-reveal">
            <DemoRequestForm />
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-inner">
          <div className="contact-copy motion-reveal">
            <p className="eyebrow">Contact us</p>
            <h2 id="contact-title">Have something else in mind?</h2>
            <p>
              Demo requests have their own path above. For questions, job inquiries, collaborations,
              partnerships, or press, send us a note here.
            </p>
            <div className="contact-paths" aria-label="Types of contact inquiries">
              <article>
                <span><IconHeart /></span>
                <div>
                  <h3>General questions</h3>
                  <p>Ask about Apulza, accessibility, or anything we have not covered.</p>
                </div>
              </article>
              <article>
                <span><IconSpark /></span>
                <div>
                  <h3>Jobs & collaboration</h3>
                  <p>Introduce yourself and share a portfolio or LinkedIn link if you have one.</p>
                </div>
              </article>
              <article>
                <span><IconBookmark /></span>
                <div>
                  <h3>Partnerships & press</h3>
                  <p>Tell us about your organization, audience, or idea.</p>
                </div>
              </article>
            </div>
          </div>
          <div className="motion-reveal">
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className="footer">
        <CatEasterEgg
          cat="feather"
          className="footer-cat-egg"
          found={foundCats.includes('feather')}
          message="Feather waited here in case you needed quiet company."
          onDiscover={discoverCat}
        />
        <div className="footer-inner">
          <div className="footer-brand">
            <Brand />
            <p>
              A supportive study buddy. Built to reduce load, protect feeling, and always show the
              next small step.
            </p>
            <nav className="footer-links" aria-label="Footer navigation">
              <a href="#privacy">Safety & privacy</a>
              <a href="#demo">Request a demo</a>
              <a href="#contact">Contact us</a>
            </nav>
            <div className="footer-socials" aria-label="Follow Apulza">
              <span>Follow along</span>
              <div>
                {socialLinks.map((social) => (
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Follow Apulza on ${social.label} (opens in a new tab)`}
                    key={social.label}
                  >
                    <span className="footer-social-icon">{social.icon}</span>
                    <span>
                      <strong>{social.label}</strong>
                      <small>{social.handle}</small>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Apulza - Built on CLEAR</span>
          <span>Made for the day you're actually having.</span>
        </div>
      </footer>

      {catTrailOpen && lastFoundCat ? (
        <CatTrailToast
          cat={lastFoundCat}
          count={foundCats.length}
          message={catTrailMessage}
          onDismiss={() => setCatTrailOpen(false)}
        />
      ) : null}

    </main>
  )
}

export default App
