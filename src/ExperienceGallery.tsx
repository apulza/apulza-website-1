import { useEffect, useState } from 'react'
import './ExperienceGallery.css'

type GalleryView = 'coursework' | 'breathing' | 'account' | 'clawset' | 'mobile' | 'counselor'

const galleryViews: { id: GalleryView; label: string; eyebrow: string }[] = [
  { id: 'coursework', label: 'Coursework', eyebrow: 'Courses & assignments' },
  { id: 'breathing', label: 'Breathing', eyebrow: 'Guided regulation' },
  { id: 'account', label: 'Account', eyebrow: 'Profile, support & access' },
  { id: 'clawset', label: 'Clawset', eyebrow: 'Calm customization' },
  { id: 'mobile', label: 'Mobile', eyebrow: 'The companion on the go' },
  { id: 'counselor', label: 'Counselors', eyebrow: 'Care-team view' },
]

const courses = [
  ['CP', 'Cognitive Psychology', 'PSY 220', 'Plan ready', 'violet'],
  ['AC', 'Applied Calculus', 'MATH 150', 'In progress', 'blue'],
  ['AL', 'American Literature', 'ENGL 210', 'Plan ready', 'green'],
] as const

const assignments = [
  { title: 'Lab Report 4', course: 'Applied Calculus', meta: 'Due today', tone: 'attention' },
  { title: 'Memory Systems Quiz', course: 'Cognitive Psychology', meta: 'Due Thursday', tone: 'calm' },
  { title: 'Reading Response', course: 'American Literature', meta: 'Done · nice work', tone: 'success' },
]

function MiniCheck() {
  return <span className="xp-check" aria-hidden="true">✓</span>
}

function CourseWorkPreview() {
  const [focused, setFocused] = useState(0)

  return (
    <div className="xp-course-layout">
      <div className="xp-course-list">
        <div className="xp-panel-heading">
          <div>
            <span>My courses</span>
            <h4>Pick up where you left off.</h4>
          </div>
          <button type="button">+ Add course</button>
        </div>
        <div className="xp-resume-banner">
          <span className="xp-resume-icon">↗</span>
          <span><small>Continue your plan</small><strong>Memory & Cognition · step 2 of 5</strong></span>
          <b>Resume</b>
        </div>
        <div className="xp-course-grid">
          {courses.map(([code, name, number, status, tone], index) => (
            <button
              className="xp-course-card"
              data-active={focused === index}
              data-tone={tone}
              type="button"
              onClick={() => setFocused(index)}
              key={code}
            >
              <span>{code}</span>
              <strong>{name}</strong>
              <small>{number} · Fall 2026</small>
              <em>{status}</em>
            </button>
          ))}
        </div>
        <div className="xp-plan-summary">
          <span>Your plan for {courses[focused][1]}</span>
          <p>Short focus blocks, quick review, and clear stopping points—adjusted to this course.</p>
          <div><MiniCheck /> 25-minute focus blocks <MiniCheck /> Review within 24 hours</div>
        </div>
      </div>
      <div className="xp-assignment-stack">
        <div className="xp-focus-card">
          <span>Needs attention</span>
          <h4>Lab Report 4</h4>
          <p>One useful next step: label the three result tables.</p>
          <div><button type="button">Open assignment</button><small>About 15 min</small></div>
        </div>
        <div className="xp-tracker">
          <div className="xp-panel-heading">
            <div><span>Assignment tracker</span><h4>One thing at a time.</h4></div>
          </div>
          {assignments.map((assignment) => (
            <div className="xp-assignment-row" data-tone={assignment.tone} key={assignment.title}>
              <i />
              <span><strong>{assignment.title}</strong><small>{assignment.course}</small></span>
              <em>{assignment.meta}</em>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const breathingPatterns = [
  { name: 'Box breathing', phases: ['Breathe in', 'Hold', 'Breathe out', 'Hold'], seconds: 4 },
  { name: 'Gentle exhale', phases: ['Breathe in', 'Breathe out'], seconds: 5 },
  { name: 'Quick reset', phases: ['Breathe in', 'Breathe out'], seconds: 3 },
  { name: 'Deep calm', phases: ['Breathe in', 'Hold', 'Breathe out'], seconds: 6 },
  { name: 'Steady rhythm', phases: ['Breathe in', 'Breathe out'], seconds: 4 },
] as const

function BreathingPreview({ compact = false }: { compact?: boolean }) {
  const [patternIndex, setPatternIndex] = useState(0)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [running, setRunning] = useState(true)
  const pattern = breathingPatterns[patternIndex]

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(
      () => setPhaseIndex((current) => (current + 1) % pattern.phases.length),
      pattern.seconds * 1000,
    )
    return () => window.clearInterval(timer)
  }, [pattern, running])

  useEffect(() => setPhaseIndex(0), [patternIndex])

  return (
    <div className={`xp-breathing-layout${compact ? ' is-compact' : ''}`}>
      <div className="xp-breathing-panel">
        <div className="xp-breathing-head">
          <span><i /> Guided rhythm</span>
          <em>{pattern.name}</em>
        </div>
        <div className="xp-orb-field" data-running={running}>
          <i className="xp-particle p1" /><i className="xp-particle p2" />
          <i className="xp-particle p3" /><i className="xp-particle p4" />
          <div className="xp-orb">
            <span>{running ? pattern.phases[phaseIndex] : 'Paused'}</span>
            <strong>{pattern.seconds}</strong>
            <small>seconds</small>
          </div>
        </div>
        <div className="xp-breathing-controls">
          <button type="button" onClick={() => setRunning((current) => !current)}>
            {running ? 'Pause' : 'Continue'}
          </button>
          <span>{phaseIndex + 1} of {pattern.phases.length} · Follow what feels comfortable</span>
        </div>
      </div>
      {!compact ? (
        <div className="xp-rhythm-picker">
          <span className="xp-panel-kicker">Choose a pace</span>
          <p>There is no perfect rhythm. Pick one that feels easy today.</p>
          {breathingPatterns.map((item, index) => (
            <button
              type="button"
              data-active={patternIndex === index}
              onClick={() => setPatternIndex(index)}
              key={item.name}
            >
              <i>{index + 1}</i>
              <span><strong>{item.name}</strong><small>{item.phases.join(' · ')}</small></span>
              <em>{item.seconds}s</em>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

type AccountScreen = 'profile' | 'settings' | 'support' | 'resources' | 'pricing' | 'onboarding' | 'login'

const accountScreens: { id: AccountScreen; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'settings', label: 'Settings' },
  { id: 'support', label: 'Support' },
  { id: 'resources', label: 'Resources' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'login', label: 'Login' },
]

function ToggleRow({ title, body, initial = false }: { title: string; body: string; initial?: boolean }) {
  const [enabled, setEnabled] = useState(initial)
  return (
    <button className="xp-toggle-row" type="button" role="switch" aria-checked={enabled} onClick={() => setEnabled(!enabled)}>
      <span><strong>{title}</strong><small>{body}</small></span>
      <i><b /></i>
    </button>
  )
}

function ProfilePanel() {
  return (
    <div className="xp-account-card xp-profile-panel">
      <div className="xp-avatar-wrap"><span className="xp-avatar">MP</span><button type="button">Change avatar</button></div>
      <div>
        <span className="xp-panel-kicker">My profile</span>
        <h4>Maya Patel</h4>
        <p>Cognitive Psychology · Fall 2026</p>
        <div className="xp-condition-pills"><span>ADHD</span><span>Anxiety</span><span>Low-energy days</span></div>
      </div>
      <button className="xp-soft-button" type="button">Edit profile</button>
    </div>
  )
}

function SettingsPanel() {
  return (
    <div className="xp-account-card">
      <div className="xp-panel-heading"><div><span>Display & reading</span><h4>Make Apulza easier to use.</h4></div></div>
      <ToggleRow title="Low stimulation" body="Reduce motion and decorative effects." />
      <ToggleRow title="Dyslexia-friendly mode" body="Use a roomier font and line spacing." initial />
      <ToggleRow title="High contrast" body="Strengthen text, borders, and focus states." />
      <ToggleRow title="Colour-blind friendly" body="Keep status colours distinguishable." initial />
    </div>
  )
}

function SupportPanel() {
  return (
    <div className="xp-account-card xp-support-panel">
      <div className="xp-support-head"><span><i /> Counselor support</span><em>Open</em></div>
      <div className="xp-thread-message is-team"><small>Jordan · Student support</small><p>Hi Maya. I saw your note about the calculus assignment. What part feels heaviest right now?</p></div>
      <div className="xp-thread-message is-user"><p>Starting it. I keep opening the file and closing it again.</p></div>
      <div className="xp-thread-message is-team"><small>Jordan</small><p>That makes sense. Could opening the rubric and highlighting one requirement be enough for now?</p></div>
      <div className="xp-reply-box"><span>Write a reply…</span><button type="button">Send</button></div>
    </div>
  )
}

function ResourcesPanel() {
  const [open, setOpen] = useState(1)
  const rows = ['Starting when your brain says no', 'Making time visible', 'Recovering after a hard study day']
  return (
    <div className="xp-account-card">
      <div className="xp-resource-tabs"><span>ADHD strategies</span><span>Medication education</span><span>Harm reduction</span></div>
      {rows.map((row, index) => (
        <button className="xp-resource-row" type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)} key={row}>
          <span><strong>{row}</strong>{open === index ? <small>Try lowering the entry cost: name a two-minute version, remove setup, and let stopping be allowed.</small> : null}</span>
          <b>{open === index ? '−' : '+'}</b>
        </button>
      ))}
      <small className="xp-education-note">Educational information—not medical advice.</small>
    </div>
  )
}

function PricingPanel() {
  const [selected, setSelected] = useState('Free')
  const plans = [
    ['Free', '$0', 'Study plans · assignments · breathing'],
    ['Plus', '$8', 'Everything in Free · ApulzaBot · Cat Cafe'],
    ['School', 'Custom', 'Student access · counselor suite · onboarding'],
  ]
  return (
    <div className="xp-pricing-grid">
      {plans.map(([name, price, features]) => (
        <button className="xp-price-card" data-selected={selected === name} type="button" onClick={() => setSelected(name)} key={name}>
          <span>{name === 'Plus' ? 'Most supportive' : 'Apulza'}</span>
          <h4>{name}</h4>
          <strong>{price}<small>{price.startsWith('$') && price !== '$0' ? ' / month' : ''}</small></strong>
          <p>{features}</p>
          <em>{selected === name ? 'Selected' : `Choose ${name}`}</em>
        </button>
      ))}
    </div>
  )
}

function OnboardingPanel() {
  const [step, setStep] = useState(1)
  return (
    <div className="xp-account-card xp-onboarding-panel">
      <div className="xp-progress-label"><span>Step {step} of 5</span><em>You can skip and come back</em></div>
      <div className="xp-progress"><i style={{ width: `${step * 20}%` }} /></div>
      <span className="xp-panel-kicker">A little context helps</span>
      <h4>{step === 1 ? 'Where do you study?' : step === 2 ? 'What are you working on?' : 'What kind of support helps?'}</h4>
      <p>There are no wrong answers. This only helps Apulza make the first screen feel more useful.</p>
      <div className="xp-field">University or school name <span>Optional</span></div>
      <div className="xp-onboarding-actions"><button type="button" onClick={() => setStep(Math.max(1, step - 1))}>Back</button><button type="button" onClick={() => setStep(Math.min(5, step + 1))}>Continue</button></div>
    </div>
  )
}

function LoginPanel() {
  return (
    <div className="xp-login-panel">
      <div className="xp-cat-nook" aria-label="A sleepy cat resting in a sunny window">
        <i className="xp-sun" />
        <span className="xp-plant">✦</span>
        <div className="xp-nook-cat"><i /><b /><em /></div>
        <small>Quiet company while you sign in.</small>
      </div>
      <div className="xp-login-card">
        <span className="xp-panel-kicker">Welcome back</span><h4>Continue when you are ready.</h4>
        <label>Email<input type="email" placeholder="maya@example.edu" /></label>
        <label>Password<input type="password" placeholder="••••••••" /></label>
        <button type="button">Sign in</button><small>No streak waiting. Nothing to catch up on.</small>
      </div>
    </div>
  )
}

function AccountPreview() {
  const [screen, setScreen] = useState<AccountScreen>('profile')
  return (
    <div className="xp-subscreen-layout">
      <div className="xp-subscreen-tabs" role="tablist" aria-label="Account and support screens">
        {accountScreens.map((item) => (
          <button type="button" role="tab" aria-selected={screen === item.id} onClick={() => setScreen(item.id)} key={item.id}>{item.label}</button>
        ))}
      </div>
      <div className="xp-subscreen-stage" role="tabpanel">
        {screen === 'profile' ? <ProfilePanel /> : null}
        {screen === 'settings' ? <SettingsPanel /> : null}
        {screen === 'support' ? <SupportPanel /> : null}
        {screen === 'resources' ? <ResourcesPanel /> : null}
        {screen === 'pricing' ? <PricingPanel /> : null}
        {screen === 'onboarding' ? <OnboardingPanel /> : null}
        {screen === 'login' ? <LoginPanel /> : null}
      </div>
    </div>
  )
}

const shopItems = [
  ['Witch Hat', 'Hat', 'Owned', '🎩'],
  ['Graduation Cap', 'Hat', '60 coins', '🎓'],
  ['Cozy Sweater', 'Shirt', 'Owned', '🧶'],
  ['Bow Tie', 'Shirt', '30 coins', '🎀'],
  ['Cozy Mittens', 'Mittens', 'Owned', '🧤'],
  ['Tiny Glasses', 'Accessories', 'Owned', '👓'],
] as const

function CssCat({ item = '🎩' }: { item?: string }) {
  return <div className="xp-css-cat" aria-hidden="true"><i /><b /><span>{item}</span><em /></div>
}

function ClawsetPreview() {
  const [cat, setCat] = useState('Midnight')
  const [filter, setFilter] = useState('All')
  const [equipped, setEquipped] = useState('Witch Hat')
  const filters = ['All', 'Hat', 'Shirt', 'Mittens', 'Accessories']
  return (
    <div className="xp-clawset-layout">
      <div className="xp-dressing-room">
        <div className="xp-cat-switcher">
          {['Midnight', 'Cloud', 'Ember'].map((name) => <button type="button" data-active={cat === name} onClick={() => setCat(name)} key={name}>{name[0]}</button>)}
        </div>
        <span className="xp-panel-kicker">Dressing room</span>
        <CssCat item={shopItems.find((item) => item[0] === equipped)?.[3] ?? '🎩'} />
        <h4>{cat}</h4>
        <div className="xp-outfit-slots"><span>Hat <b>{equipped}</b></span><span>Shirt <b>Cozy Sweater</b></span><span>Accessory <b>Bow Ribbon</b></span></div>
      </div>
      <div className="xp-shop">
        <div className="xp-shop-head"><span><strong>340</strong> coins · earned by studying</span><em>12 unlocks left this month</em></div>
        <div className="xp-shop-tabs">{filters.map((item) => <button type="button" data-active={filter === item} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
        <div className="xp-shop-grid">
          {shopItems.filter((item) => filter === 'All' || item[1] === filter).map(([name, type, price, icon]) => (
            <button type="button" data-equipped={equipped === name} onClick={() => setEquipped(name)} key={name}>
              <span>{type}</span><b>{icon}</b><strong>{name}</strong><small>{equipped === name ? 'Equipped' : price}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

type MobileScreen = 'dashboard' | 'breathing' | 'courses' | 'plan' | 'assignments' | 'notifications' | 'settings' | 'support' | 'resources' | 'profile' | 'onboarding'

const mobileScreens: { id: MobileScreen; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' }, { id: 'breathing', label: 'Breathing' },
  { id: 'courses', label: 'Courses' }, { id: 'plan', label: 'Course plan' },
  { id: 'assignments', label: 'Assignments' }, { id: 'notifications', label: 'Notifications' },
  { id: 'settings', label: 'Settings' }, { id: 'support', label: 'Support' },
  { id: 'resources', label: 'Resources' }, { id: 'profile', label: 'Profile' },
  { id: 'onboarding', label: 'Onboarding' },
]

function MobileRows({ kind }: { kind: 'courses' | 'assignments' | 'notifications' }) {
  const content = kind === 'courses'
    ? [['CP', 'Cognitive Psychology', 'Plan ready'], ['AC', 'Applied Calculus', 'In progress'], ['AL', 'American Literature', 'Plan ready']]
    : kind === 'assignments'
      ? [['!', 'Lab Report 4', 'Today'], ['•', 'Memory Systems Quiz', 'Thursday'], ['✓', 'Reading Response', 'Done']]
      : [['↗', 'Your plan is ready', '2m ago'], ['♡', 'A gentle reminder', '1h ago'], ['✓', 'Reading Response complete', 'Yesterday']]
  return <div className="xp-mobile-rows">{content.map(([icon, title, meta]) => <div key={title}><i>{icon}</i><span><strong>{title}</strong><small>{meta}</small></span><b>›</b></div>)}</div>
}

function MobilePhone({ screen }: { screen: MobileScreen }) {
  return (
    <div className="xp-phone">
      <div className="xp-phone-island" />
      <div className="xp-phone-screen">
        {screen === 'dashboard' ? <>
          <span className="xp-mobile-kicker">Good afternoon</span><h4>Welcome back, Maya</h4>
          <div className="xp-mobile-stat"><span>Study minutes</span><strong>3h 20m</strong><small>That is real progress.</small></div>
          <div className="xp-mobile-stat"><span>This week</span><strong>2 things due</strong><small>Spaced out—one at a time.</small></div>
          <div className="xp-mobile-cafe"><span>Cat Cafe</span><CssCat item="♡" /><small>Quiet company is waiting</small></div>
        </> : null}
        {screen === 'breathing' ? <><span className="xp-mobile-kicker">A short reset</span><h4>Breathing</h4><BreathingPreview compact /></> : null}
        {screen === 'courses' ? <><h4>Courses</h4><MobileRows kind="courses" /></> : null}
        {screen === 'plan' ? <>
          <span className="xp-mobile-back">‹ Courses</span><h4>Cognitive Psychology</h4>
          <div className="xp-mobile-plan"><span>Your plan</span><p>A steady, low-pressure approach built around short focus blocks.</p></div>
          <div className="xp-mobile-strategy"><strong>Study strategies</strong><span><MiniCheck /> 25-minute focus blocks</span><span><MiniCheck /> Review within 24 hours</span></div>
        </> : null}
        {screen === 'assignments' ? <><h4>Assignments</h4><div className="xp-mobile-tabs"><span>All</span><span>This week</span><span>Done</span></div><MobileRows kind="assignments" /></> : null}
        {screen === 'notifications' ? <><h4>Notifications</h4><MobileRows kind="notifications" /></> : null}
        {screen === 'settings' ? <><h4>Settings</h4><span className="xp-mobile-kicker">Display & reading</span><ToggleRow title="Low stimulation" body="Reduce motion." /><ToggleRow title="Dyslexia-friendly" body="Roomier reading." initial /><ToggleRow title="High contrast" body="Stronger edges." /></> : null}
        {screen === 'support' ? <><h4>Support</h4><div className="xp-mobile-bot"><span>✦ ApulzaBot</span><p>What would make this assignment feel smaller?</p><button type="button">Start a conversation</button></div><div className="xp-mobile-strategy"><strong>Counselor support</strong><span>One open conversation</span><small>Usually replies within one school day</small></div></> : null}
        {screen === 'resources' ? <><h4>Resources</h4><div className="xp-mobile-tabs"><span>ADHD</span><span>Medication</span></div>{['Starting when your brain says no', 'Making time visible', 'Resetting after a hard day'].map((row) => <div className="xp-mobile-accordion" key={row}><span>{row}</span><b>+</b></div>)}</> : null}
        {screen === 'profile' ? <><div className="xp-mobile-profile"><span>MP</span><h4>Maya Patel</h4><small>maya@example.edu</small></div><div className="xp-mobile-strategy"><strong>What Apulza supports</strong><span>ADHD</span><span>Anxiety</span><span>Low-energy days</span></div></> : null}
        {screen === 'onboarding' ? <><span className="xp-mobile-kicker">Step 2 of 5</span><div className="xp-mobile-progress"><i /></div><h4>Add your first course</h4><p className="xp-mobile-copy">A course name is enough. You can add the syllabus later.</p><div className="xp-mobile-input">Course name</div><div className="xp-mobile-input">Course code · optional</div><button className="xp-mobile-primary" type="button">Add course</button><small className="xp-mobile-center">Skip for now</small></> : null}
      </div>
      <div className="xp-phone-home" />
    </div>
  )
}

function MobilePreview() {
  const [screen, setScreen] = useState<MobileScreen>('dashboard')
  return (
    <div className="xp-mobile-layout">
      <div className="xp-mobile-nav">
        <span className="xp-panel-kicker">11 real app views</span>
        <h4>Everything important stays close.</h4>
        <p>Choose a screen to explore the mobile dashboard, coursework, support, account, and regulation tools.</p>
        <div role="tablist" aria-label="Mobile app screens">
          {mobileScreens.map((item) => <button type="button" role="tab" aria-selected={screen === item.id} onClick={() => setScreen(item.id)} key={item.id}><MiniCheck /> {item.label}</button>)}
        </div>
      </div>
      <MobilePhone screen={screen} />
    </div>
  )
}

const counselorStats = [
  ['24', 'Active students'], ['7', 'Needs a check-in'], ['4', 'Plans updated'],
  ['68%', 'Engaged this week'], ['12', 'Open conversations'], ['3', 'New referrals'], ['92%', 'Support reached'],
]

function CounselorPreview() {
  const [score, setScore] = useState(68)
  const factors = [
    ['Assignment load', 82, 'high'], ['Recent engagement', 64, 'medium'],
    ['Support signals', 48, 'medium'], ['Study-plan progress', 32, 'low'],
  ]
  return (
    <div className="xp-counselor-layout">
      <div className="xp-risk-card">
        <span className="xp-panel-kicker">Student support signal</span><h4>Weekly support overview</h4>
        <div className="xp-gauge" style={{ '--score': `${score * 3.6}deg` } as React.CSSProperties}>
          <div><strong>{score}</strong><small>/100</small></div>
        </div>
        <div className="xp-risk-label"><strong>High</strong><span>Review with care—not as a grade.</span></div>
        <label>Preview score<input type="range" min="12" max="92" value={score} onChange={(event) => setScore(Number(event.target.value))} /></label>
      </div>
      <div className="xp-factor-card">
        <span className="xp-panel-kicker">Factor breakdown</span><h4>Why this signal changed.</h4>
        {factors.map(([label, value, tone]) => <div className="xp-factor-row" data-tone={tone} key={label}><span><strong>{label}</strong><em>{value}%</em></span><i><b style={{ width: `${value}%` }} /></i></div>)}
        <p>Signals help a counselor decide where to look. They do not diagnose, rank, or automatically contact a student.</p>
      </div>
      <div className="xp-caseload-stats">
        {counselorStats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </div>
    </div>
  )
}

const viewDescriptions: Record<GalleryView, { title: string; body: string; count: string }> = {
  coursework: { title: 'The course, the plan, and the next assignment stay connected.', body: 'Course lists, plan details, focus cards, and due-date buckets work as one calm flow on desktop and mobile.', count: '9 connected views' },
  breathing: { title: 'A reset that follows the student—not a performance target.', body: 'The interactive orb and five real rhythms are optional, pauseable, and clear about what comes next.', count: '2 interactive tools' },
  account: { title: 'Support preferences and practical help live in one predictable place.', body: 'Profile, display settings, counselor messages, resources, pricing, onboarding, and login each keep the pressure low.', count: '12 account & support views' },
  clawset: { title: 'Personalization can be playful without becoming another grind.', body: 'The dressing room and shop make Cat Cafe companions feel personal while keeping every reward optional.', count: '2 playful spaces' },
  mobile: { title: 'The same calm system, shaped for a thumb-sized screen.', body: 'Dashboard, coursework, notifications, regulation, profile, resources, and support stay readable and reachable.', count: '11 mobile screens' },
  counselor: { title: 'Useful context for care teams, without turning students into scores.', body: 'A transparent support signal, factor breakdown, and caseload overview keep human judgment in the loop.', count: '3 counselor tools' },
}

export default function ExperienceGallery() {
  const [activeView, setActiveView] = useState<GalleryView>('coursework')
  const description = viewDescriptions[activeView]

  return (
    <section className="experience-gallery" aria-labelledby="experience-gallery-title">
      <div className="xp-gallery-inner">
        <div className="xp-gallery-heading motion-reveal">
          <div>
            <p className="eyebrow">Explore the full product</p>
            <h2 id="experience-gallery-title">Every part of Apulza speaks the same calm language.</h2>
          </div>
          <p>Move through the complete product system—from a first course to a counselor check-in. Every preview is responsive, and the controls are live.</p>
        </div>
        <div className="xp-gallery-tabs motion-reveal" role="tablist" aria-label="Product areas">
          {galleryViews.map((view) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeView === view.id}
              aria-controls="experience-gallery-panel"
              onClick={() => setActiveView(view.id)}
              key={view.id}
            >
              <span>{view.eyebrow}</span>
              <strong>{view.label}</strong>
            </button>
          ))}
        </div>
        <div className="xp-gallery-summary motion-reveal">
          <div><span>{description.count}</span><h3>{description.title}</h3></div>
          <p>{description.body}</p>
        </div>
        <div className="xp-gallery-stage motion-reveal" id="experience-gallery-panel" role="tabpanel" tabIndex={0}>
          {activeView === 'coursework' ? <CourseWorkPreview /> : null}
          {activeView === 'breathing' ? <BreathingPreview /> : null}
          {activeView === 'account' ? <AccountPreview /> : null}
          {activeView === 'clawset' ? <ClawsetPreview /> : null}
          {activeView === 'mobile' ? <MobilePreview /> : null}
          {activeView === 'counselor' ? <CounselorPreview /> : null}
        </div>
        <div className="xp-source-strip" aria-label="Included Apulza product areas">
          <span><MiniCheck /> Dashboard</span><span><MiniCheck /> Courses & assignments</span>
          <span><MiniCheck /> Account & support</span><span><MiniCheck /> Breathing</span>
          <span><MiniCheck /> Cat Cafe & Clawset</span><span><MiniCheck /> Counselor suite</span>
          <span><MiniCheck /> Mobile companion</span>
        </div>
      </div>
    </section>
  )
}
