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

const trustPoints = [
  { label: 'Plans built around your course', icon: <IconBookmark /> },
  { label: 'Hints instead of homework answers', icon: <IconSpark /> },
  { label: 'No streaks to lose', icon: <IconHeart /> },
]

const steps = [
  {
    number: '1',
    title: 'Bring in a course',
    body: 'Add a course by hand or connect Canvas, then keep its assignments and context in one place.',
    demo: 'account',
  },
  {
    number: '2',
    title: 'Get a plan that fits',
    body: 'Turn that course into practical strategies, focus blocks, breaks, and a rhythm you can adjust.',
    demo: 'courses',
  },
  {
    number: '3',
    title: 'Learn with guided hints',
    body: 'Ask about an assignment. MyTutor starts with a question and adds guidance when you need it.',
    demo: 'plan',
  },
] as const

const showcasePoints = [
  'Resume the course, notes, and next step you left open.',
  'Move, resize, or hide dashboard widgets and save your layout.',
  'See study minutes and completed work for this month, with context.',
]

const schoolPoints = [
  'Course-aware tutoring stays within academic-integrity boundaries.',
  'Each support score explains the contribution of attendance, grades, assignments, LMS activity, and missed deadlines.',
  'Support profiles can change factor weights—for example, attendance when a student has an accommodation.',
  'Counselors work from their assigned caseload with trends, notes, and follow-ups.',
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

const trustEvidence = [
  {
    title: 'Sensitive by default',
    body: 'Course, study, and mental-health preferences are treated as sensitive information and used to personalize support.',
    icon: <IconShield />,
  },
  {
    title: 'Clear counselor access',
    body: 'Partner-school counselors see explainable support signals for students in their assigned caseload.',
    icon: <IconHeart />,
  },
  {
    title: 'Crisis support comes first',
    body: 'When Apulza detects a crisis message, reviewed support resources appear before tutoring or usage limits.',
    icon: <IconBookmark />,
  },
]

const faqs = [
  {
    question: 'Is Apulza free?',
    answer: 'Apulza is free to start, with no card required.',
  },
  {
    question: 'Is it only for students with ADHD?',
    answer:
      'No. It is designed around ADHD, anxiety, and low-energy days, but any student can use it when study feels heavy.',
  },
  {
    question: 'Will it nag me?',
    answer:
      'You control how often reminders arrive. Apulza avoids duplicate nudges and uses invitations like “Ready when you are.”',
  },
  {
    question: 'Is my data private?',
    answer:
      'Your study and support information is sensitive. At partner schools, authorized counselors can see explainable support signals for students in their assigned caseload; the student experience does not use public rankings or leaderboards.',
  },
  {
    question: 'Can my school use it?',
    answer:
      'Yes. Apulza pairs course-aware student support with an early-warning workspace that helps counselors see who may need a check-in and why.',
  },
  {
    question: 'Will MyTutor write my assignment?',
    answer:
      'No. MyTutor answers straightforward factual questions, then uses guided hints when you ask it to do assignment work. It helps you reach your own answer.',
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
  if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return

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

function StepDemo({ kind }: { kind: (typeof steps)[number]['demo'] }) {
  if (kind === 'account') {
    return (
      <div className="step-demo step-demo-input">
        <span>English 201 connected</span>
        <IconCheck size={12} />
      </div>
    )
  }

  if (kind === 'courses') {
    return (
      <div className="step-demo step-demo-task">
        <span className="course-demo-icon" aria-hidden="true">CP</span>
        <strong>Cognitive Psychology</strong>
        <em>Plan ready</em>
      </div>
    )
  }

  return (
    <div className="step-demo step-demo-resume">
      <span>MyTutor · guided hint</span>
      <strong>What makes this passage support your main idea?</strong>
    </div>
  )
}

function EditorialHero() {
  return (
    <section className="hero hero-editorial" id="top" onPointerMove={resetUnhoveredHeroCards}>
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
          <h1>
            When studying gets hard, <em>start here.</em>
          </h1>
          <p className="hero-lede">
            Built for students managing ADHD, anxiety, or depression. Add courses or connect Canvas,
            get a plan for each one, and use MyTutor hints that help you do your own work.
          </p>
          <div className="hero-actions hero-actions-left">
            <ButtonLink href="#tutor">
              See how MyTutor works
              <IconArrow />
            </ButtonLink>
            <ButtonLink href="#beta" variant="secondary">
              Join the beta
            </ButtonLink>
          </div>
          <div className="hero-proof" aria-label="Apulza product qualities">
            <span><IconCheck /> Free to start</span>
            <span><IconCheck /> No card needed</span>
            <span><IconCheck /> Canvas course import</span>
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
              <span><IconSpark size={14} /> English 201 plan</span>
              <i>Move anytime</i>
            </div>
            <div className="hero-rhythm-step is-complete">
              <span><IconCheck size={12} /></span>
              <p><strong>Review the prompt</strong><small>2 min · completed</small></p>
            </div>
            <div className="hero-rhythm-step is-current">
              <span>2</span>
              <p><strong>Choose one passage</strong><small>Your next small step</small></p>
              <em>Now</em>
            </div>
            <div className="hero-rhythm-rest">
              <IconHeart size={13} /> Move or skip a session without penalty.
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
              <span><IconSpark size={15} /> MyTutor · English 201</span>
              <i>Guided hint</i>
            </div>
            <h2>Rhetorical analysis</h2>
            <p>Work through the assignment without handing over the answer.</p>
            <div className="hero-task-row">
              <span className="hero-task-check"><IconSpark size={13} /></span>
              <span><strong>What makes this passage support your point?</strong><small>Start with your own words</small></span>
              <a href="#tutor" aria-label="See how MyTutor works"><IconArrow size={14} /></a>
            </div>
            <div className="hero-progress"><span /></div>
            <small className="hero-progress-note">Hints build as you need more help.</small>
          </article>
          <div className="hero-float-chip hero-float-chip-bottom">
            <span><IconSpark size={16} /></span>
            <p><small>Plan adjusted</small><strong>For a lower-energy day</strong></p>
          </div>
        </div>
      </div>
      <div className="hero-bottom-line">
        <span>Course-aware support for students. Earlier signals for counselors.</span>
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

function MyTutorSnippet() {
  return (
    <div className="product-snippet bot-snippet" aria-label="MyTutor guided learning preview">
      <div className="bot-head">
        <span className="bot-avatar"><IconSpark size={17} /></span>
        <div>
          <h3>MyTutor</h3>
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
          <span>MyTutor</span>
          <p>You chose your article. Which passage feels closest to your main idea?</p>
        </div>
        <div className="bot-message bot-message-user">
          <p>I found a passage, but I cannot explain why it matters.</p>
        </div>
        <div className="bot-message bot-message-assistant">
          <span>MyTutor</span>
          <p>What does the author want the reader to believe after reading it? Start with your own words.</p>
        </div>
      </div>
      <div className="bot-actions" aria-label="Suggested MyTutor actions">
        <span>Give me another hint</span>
        <span>Explain the concept</span>
        <span>Review my thinking</span>
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
          <h2 id="inside-title">Courses, plans, and tutoring in one place.</h2>
          <p className="section-lede">
            Assignments feed the dashboard, course-specific plans turn into movable sessions, and
            MyTutor uses the same course context when you ask for help.
          </p>
        </div>
        <article className="snippet-feature snippet-feature-dashboard">
          <div className="snippet-copy motion-reveal">
            <span className="snippet-number">01</span>
            <p className="eyebrow">Orient</p>
            <h3>See what is due and pick up where you left off.</h3>
            <p>
              Put your assignments, next action, and study progress on one dashboard. Arrange the
              widgets around what helps you focus; your layout is saved for next time.
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
            <h3>A study plan built for your course and your needs.</h3>
            <p>
              Each course gets strategies with a reason, timed focus blocks with breaks, and a
              weekly template shaped by the support needs you choose. Move or skip a session without penalty.
            </p>
            <ul className="snippet-benefits">
              <li><IconCheck /> Course-specific strategies and accommodations to consider</li>
              <li><IconCheck /> Focus blocks, breaks, and sessions you control</li>
            </ul>
          </div>
          <div className="snippet-frame motion-reveal"><StudyPlanSnippet /></div>
        </article>
        <article className="snippet-feature snippet-feature-bot" id="tutor">
          <div className="snippet-copy motion-reveal">
            <span className="snippet-number">03</span>
            <p className="eyebrow">MyTutor · guided learning</p>
            <h3>A tutor that teaches, one hint at a time.</h3>
            <p>
              MyTutor can use your syllabus and assignment context. It answers factual questions
              directly; for assignment work, it asks a question first and builds toward stronger hints.
            </p>
            <ul className="snippet-benefits">
              <li><IconCheck /> Guided help without writing the assignment for you</li>
              <li><IconCheck /> Remembers how much help each concept needed</li>
            </ul>
          </div>
          <div className="snippet-frame motion-reveal"><MyTutorSnippet /></div>
        </article>
        <article className="snippet-feature snippet-feature-cafe snippet-feature-reverse">
          <div className="snippet-copy motion-reveal">
            <span className="snippet-number">04</span>
            <p className="eyebrow">Focus and return</p>
            <h3>Make focused time feel a little less lonely.</h3>
            <p>
              The Cat Café offers optional company while you study. Focused minutes earn currency
              for cats and décor, and what you earn never disappears after a hard week.
            </p>
            <ul className="snippet-benefits">
              <li><IconCheck /> A focus companion you can always skip</li>
              <li><IconCheck /> No streaks, expiring rewards, or leaderboard</li>
            </ul>
          </div>
          <div className="snippet-frame motion-reveal"><CatCafeSnippet /></div>
        </article>
        <div className="support-tools motion-reveal" aria-labelledby="support-tools-title">
          <div className="support-tools-intro">
            <p className="eyebrow">Support for the moment</p>
            <h3 id="support-tools-title">Breathing, café rewards, and practical resources.</h3>
            <p>Choose a breathing pace, customize your café cats, or open practical ADHD resources from the same place you study.</p>
          </div>
          <div className="support-tool-grid">
            <article>
              <span className="support-tool-icon"><IconHeart /></span>
              <p className="eyebrow">Breathing & grounding</p>
              <h4>A short reset for overwhelmed moments.</h4>
              <p>Choose the pace and length of a guided reset before a task or between steps.</p>
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
        <p className="eyebrow">A quick preview</p>
        <h2 id="tiny-demo-title">Turn something heavy into one small step.</h2>
        <p>Type one task to see a sample next step. MyTutor in Apulza uses your course and assignment context.</p>
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
          <button className="button" type="submit">Show a sample step</button>
        </div>
        <div className="tiny-demo-result" aria-live="polite" data-visible={Boolean(nextStep)}>
          {nextStep ? (
            <>
              <span><IconSpark size={16} /> A sample next step</span>
              <strong>{nextStep}</strong>
            </>
          ) : (
            <span>Your sample step will appear here.</span>
          )}
        </div>
      </form>
    </section>
  )
}

type BetaSignupState = 'idle' | 'submitting' | 'success' | 'duplicate' | 'error'

const supportNeedOptions = [
  { value: 'focus', label: 'I sometimes find it hard to focus' },
  { value: 'time', label: 'I sometimes find it hard to manage my time' },
  { value: 'deadlines', label: 'I sometimes find it hard to stay on top of deadlines' },
  { value: 'starting', label: 'I sometimes find it hard to get started on tasks' },
]

function BetaSignupForm() {
  const [submissionState, setSubmissionState] = useState<BetaSignupState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [feedbackPref, setFeedbackPref] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formElement = event.currentTarget
    setSubmissionState('submitting')

    try {
      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        body: new FormData(formElement),
        headers: { Accept: 'application/json' },
      })

      if (response.ok) {
        formElement.reset()
        setFeedbackPref('')
        setSubmissionState('success')
        return
      }

      if (response.status === 409) {
        setSubmissionState('duplicate')
        return
      }

      const body = (await response.json().catch(() => null)) as { error?: string } | null
      setErrorMessage(body?.error ?? '')
      setSubmissionState('error')
    } catch {
      setErrorMessage('')
      setSubmissionState('error')
    }
  }

  const statusMessages: Record<Exclude<BetaSignupState, 'idle' | 'submitting'>, string> = {
    success: "Thanks—you're on the beta list. We'll email you when your invite is ready.",
    duplicate: "You're already on the beta list with that email. To change your details, write to our team at apulzaai@outlook.com.",
    error: `${errorMessage || "We couldn't save your sign-up."} Please try again. If it keeps happening, let our team know at apulzaai@outlook.com.`,
  }

  return (
    <form className="demo-form beta-form" onSubmit={handleSubmit}>
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
          <span>Name (or preferred name)</span>
          <input name="name" type="text" autoComplete="name" placeholder="Alex" maxLength={100} required />
        </label>
        <label>
          <span>Email you'll sign up with</span>
          <input name="email" type="email" autoComplete="email" placeholder="alex@example.com" maxLength={254} required />
        </label>
      </div>

      {/* Round 1 of the beta is students only. The Worker and database still accept
          "counselor", so a role choice can come back for a later round. */}
      <input type="hidden" name="role" value="student" />

      <details className="beta-optional">
        <summary>
          A few optional questions <em>(help us invite a varied group)</em>
        </summary>
        <div className="beta-optional-body">
          <div className="field-row">
            <label>
              <span>School <em>(optional)</em></span>
              <input name="school" type="text" placeholder="e.g. community college" maxLength={150} />
            </label>
            <label>
              <span>Year or level <em>(optional)</em></span>
              <input name="year_level" type="text" placeholder="e.g. 2nd year" maxLength={80} />
            </label>
          </div>

          <fieldset className="form-choices">
            <legend>How would you like to give feedback? <em>(optional)</em></legend>
            <div className="choice-row">
              {[
                { value: 'survey', label: 'Short survey' },
                { value: 'call', label: 'Quick call' },
                { value: 'in_app', label: 'In the app only' },
              ].map((option) => (
                <label className="choice" key={option.value}>
                  <input
                    type="radio"
                    name="feedback_pref"
                    value={option.value}
                    checked={feedbackPref === option.value}
                    onChange={() => setFeedbackPref(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {feedbackPref === 'call' ? (
            <label>
              <span>Phone number <em>(optional—leave blank and we'll email to set up a video call)</em></span>
              <input name="phone" type="tel" autoComplete="tel" maxLength={30} />
            </label>
          ) : null}

          <fieldset className="form-choices">
            <legend>Anything you'd like the app to help with? <em>(optional, skip anytime)</em></legend>
            <p className="choice-hint">
              We ask so we can include people with different study needs. This isn't a diagnosis,
              and you never have to answer.
            </p>
            <div className="choice-stack">
              {supportNeedOptions.map((option) => (
                <label className="choice" key={option.value}>
                  <input type="checkbox" name="support_needs" value={option.value} />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </details>

      <div className="choice-stack">
        <label className="choice">
          <input type="checkbox" name="confirm_18_plus" value="yes" required />
          <span>I'm 18 or older.</span>
        </label>
        <label className="choice">
          <input type="checkbox" name="accept_terms" value="yes" required />
          <span>
            I've read and agree to the{' '}
            <a href="/beta-terms.html" target="_blank" rel="noopener">beta terms</a>.
          </span>
        </label>
      </div>

      <button
        className="button demo-submit"
        type="submit"
        disabled={submissionState === 'submitting'}
      >
        {submissionState === 'submitting' ? 'Signing you up…' : 'Join the beta'}
        <IconArrow />
      </button>
      <p className="form-note">
        Please don't share diagnoses, medical details, student ID numbers, or school passwords.
      </p>
      {submissionState !== 'idle' && submissionState !== 'submitting' ? (
        <p
          className="form-status"
          data-state={submissionState === 'success' ? 'success' : 'error'}
          role="status"
        >
          {statusMessages[submissionState]}
        </p>
      ) : null}
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
    // The browser looks for a #section before React has rendered it, so links like
    // apulza-ai.com/#beta (and the /beta QR redirect) would otherwise land at the top.
    const id = decodeURIComponent(window.location.hash.slice(1))
    const target = id ? document.getElementById(id) : null
    if (!target) return

    // 'instant', not 'auto': the page sets scroll-behavior: smooth, and a long smooth
    // scroll on load gets interrupted before it arrives.
    const jump = () => target.scrollIntoView({ behavior: 'instant', block: 'start' })
    jump()
    if (document.readyState === 'complete') return

    // Images above the section can push it down while they load; jump again once
    // they're done, unless the visitor has already started scrolling.
    const stop = () => {
      window.removeEventListener('load', jump)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('keydown', stop)
    }
    window.addEventListener('load', jump, { once: true })
    window.addEventListener('wheel', stop, { once: true, passive: true })
    window.addEventListener('touchstart', stop, { once: true, passive: true })
    window.addEventListener('keydown', stop, { once: true })
    return stop
  }, [])

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
          <a className="nav-cta" href="#beta" onClick={() => setMobileMenuOpen(false)}>
            Join the beta
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
            Add a course manually or connect Canvas. Apulza carries its assignments and syllabus
            into your plan and the help you get from MyTutor.
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
              <small>Beyond the first session</small>
              <strong>Return to your next step without starting over.</strong>
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
              <h2 id="privacy-title">Support works better when its boundaries are clear.</h2>
              <p>
                Apulza uses course and support context to help students learn. At partner schools,
                authorized counselors can also see explainable signals for students on their caseload,
                so they can reach out earlier.
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
              Every screen has one primary action, restores your place when you return, and gives
              progress in context without streaks or blame.
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
            <h2>See who needs a check-in before the transcript does.</h2>
            <p>
              Students get course-specific plans and guided tutoring. Counselors get a nightly,
              explainable early-warning view and a place to record check-ins and follow-ups.
            </p>
            <ul className="check-list">
              {schoolPoints.map((point) => (
                <li key={point}>
                  <IconCheck />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href="mailto:apulzaai@outlook.com?subject=Apulza%20school%20demo">Request a school demo</ButtonLink>
          </div>
          <div className="school-image">
            <img
              src="/assets/school-study-room.png"
              alt="A calm, sunlit study space with students working quietly."
            />
          </div>
        </div>
      </section>

      <section className="contact-section beta-section" id="beta" aria-labelledby="beta-title">
        <div className="contact-inner">
          <div className="contact-copy motion-reveal">
            <p className="eyebrow">Beta testers</p>
            <h2 id="beta-title">Try Apulza with your courses.</h2>
            <p>
              We're inviting a small group of students to test course plans, MyTutor hints, and
              the dashboard. Tell us what helps and what gets in the way. Signing up takes about a minute.
            </p>
            <div className="contact-paths" aria-label="What beta testing involves">
              <article>
                <span><IconSpark /></span>
                <div>
                  <h3>It's a test version</h3>
                  <p>Things may break, and beta data may be reset as we improve the app.</p>
                </div>
              </article>
              <article>
                <span><IconHeart /></span>
                <div>
                  <h3>Feedback about the app, not you</h3>
                  <p>Short check-ins asking what was confusing or helpful, never how productive you were.</p>
                </div>
              </article>
              <article>
                <span><IconShield /></span>
                <div>
                  <h3>Leave anytime</h3>
                  <p>Stop whenever you like, and ask us to delete your data. Read the <a href="/beta-terms.html" target="_blank" rel="noopener">beta terms</a>.</p>
                </div>
              </article>
            </div>
          </div>
          <div className="motion-reveal">
            <BetaSignupForm />
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

      <section className="contact-section contact-section-simple" id="contact" aria-labelledby="contact-title">
        <div className="contact-inner motion-reveal">
          <div className="contact-copy">
            <p className="eyebrow">Contact us</p>
            <h2 id="contact-title">Let’s talk.</h2>
            <p>
              For school demos, questions, collaborations, and press, email our team directly.
            </p>
          </div>
          <a className="button contact-email" href="mailto:apulzaai@outlook.com?subject=Apulza%20inquiry">
            apulzaai@outlook.com <IconArrow />
          </a>
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
              Course-specific plans, guided tutoring, and a dashboard that remembers where you left off.
              Partner schools also get explainable signals for earlier support.
            </p>
            <nav className="footer-links" aria-label="Footer navigation">
              <a href="#privacy">Safety & privacy</a>
              <a href="#beta">Join the beta</a>
              <a href="#contact">Contact us</a>
            </nav>
            <p className="footer-contact">Email us at <a href="mailto:apulzaai@outlook.com">apulzaai@outlook.com</a></p>
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
          <span>Course-aware plans. Guided hints. Earlier support.</span>
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
