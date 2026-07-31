import { useEffect, useRef, useState, type SyntheticEvent } from 'react'
import './ExperienceGallery.css'

type Snippet = {
  label: string
  selector: string
  note: string
}

type SnippetGroup = {
  id: string
  label: string
  eyebrow: string
  file: string
  source: string
  description: string
  snippets: Snippet[]
}

const snippetGroups: SnippetGroup[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    eyebrow: 'Desktop home',
    file: 'apulza-dashboard-snippets.html',
    source: 'Dashboard widgets',
    description: 'The real dashboard building blocks, including progress, courses, and the next useful action.',
    snippets: [
      { label: 'Hero assignment', selector: '.apz-preview[data-tpl="tpl-hero"]', note: 'The primary assignment and its calm next action.' },
      { label: 'Study minutes', selector: '.apz-preview[data-tpl="tpl-minutes"]', note: 'Month-scoped effort framed as encouragement.' },
      { label: 'Completed tally', selector: '.apz-preview[data-tpl="tpl-completed"]', note: 'Completed work without streaks or comparison.' },
      { label: 'Courses list', selector: '.apz-preview[data-tpl="tpl-courses"]', note: 'Course status and plan readiness at a glance.' },
      { label: 'Continue row', selector: '.apz-preview[data-tpl="tpl-continue"]', note: 'Restores exactly where a student left off.' },
    ],
  },
  {
    id: 'courses',
    label: 'Coursework',
    eyebrow: 'Courses & assignments',
    file: 'apulza-courses-assignments-snippets.html',
    source: 'Course and assignment flows',
    description: 'Course context, personalized plans, a focused next step, and a complete assignment tracker.',
    snippets: [
      { label: 'Course list', selector: '.snippet-preview[data-tpl="courses-list"]', note: 'Resume banner plus the complete course grid.' },
      { label: 'Course detail', selector: '.snippet-preview[data-tpl="course-detail"]', note: 'Plan summary, strategies, and proposed study sessions.' },
      { label: 'Assignment focus', selector: '.snippet-preview[data-tpl="assignment-focus"]', note: 'One assignment, one clear next action.' },
      { label: 'Assignment tracker', selector: '.snippet-preview[data-tpl="assignment-list"]', note: 'Needs attention, this week, and completed buckets.' },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    eyebrow: 'Profile & support',
    file: 'apulza-account-support-snippets.html',
    source: 'Desktop account and support',
    description: 'The original profile, preferences, human support, resource, access, and onboarding experiences.',
    snippets: [
      { label: 'Profile & avatar', selector: '.snippet-preview[data-tpl="profile"]', note: 'Student profile with the original avatar picker.' },
      { label: 'Display settings', selector: '.snippet-preview[data-tpl="settings"]', note: 'Accessible display and reading preferences.' },
      { label: 'Support thread', selector: '.snippet-preview[data-tpl="support"]', note: 'A complete student and counselor conversation.' },
      { label: 'Resources', selector: '.snippet-preview[data-tpl="resources"]', note: 'Expandable, evidence-informed strategy cards.' },
      { label: 'Pricing', selector: '.snippet-preview[data-tpl="pricing"]', note: 'All three plan states and their original copy.' },
      { label: 'Onboarding', selector: '.snippet-preview[data-tpl="onboarding"]', note: 'Low-pressure progress and school context.' },
      { label: 'Login cat nook', selector: '.snippet-preview[data-tpl="catnook"]', note: 'The original illustrated login-side scene.' },
    ],
  },
  {
    id: 'breathing',
    label: 'Breathing',
    eyebrow: 'Guided regulation',
    file: 'apulza-breathing-snippets.html',
    source: 'Desktop breathing exercise',
    description: 'The original animated breathing orb and all five selectable rhythm patterns.',
    snippets: [
      { label: 'Breathing orb', selector: '.snippet-preview[data-tpl="tpl-orb"]', note: 'Interactive, auto-playing box breathing.' },
      { label: 'Rhythm picker', selector: '.snippet-preview[data-tpl="tpl-picker"]', note: 'Every breathing pace from the product.' },
    ],
  },
  {
    id: 'cafe',
    label: 'Cat Cafe',
    eyebrow: 'Focus lounge',
    file: 'apulza-cat-cafe-lounge-snippets.html',
    source: 'Cat Cafe lounge',
    description: 'The exact animated lounge environment and the same five cat portraits used throughout the product.',
    snippets: [
      { label: 'Animated lounge', selector: '.snippet-preview[data-tpl="tpl-lounge"]', note: 'Original scene, lighting, cats, and ambient motion.' },
      { label: 'Cat portraits', selector: '.snippet-preview[data-tpl="tpl-portraits"]', note: 'Midnight, Cloud, Truffle, Ember, and Feather.' },
    ],
  },
  {
    id: 'clawset',
    label: 'Clawset',
    eyebrow: 'Cat customization',
    file: 'apulza-clawset-snippets.html',
    source: 'My Clawset',
    description: 'The original dressing room, cat selector, inventory, and outfit shop components.',
    snippets: [
      { label: 'Dressing room', selector: '.snippet-preview[data-tpl="tpl-dressing-room"]', note: 'Current cat, equipped outfit, and selectable companions.' },
      { label: 'Outfit shop', selector: '.snippet-preview[data-tpl="tpl-shop"]', note: 'Original filters, coin balance, and inventory cards.' },
    ],
  },
  {
    id: 'counselor',
    label: 'Counselors',
    eyebrow: 'Care-team suite',
    file: 'apulza-counselor-suite-snippets.html',
    source: 'Counselor suite',
    description: 'Transparent student-support signals and real caseload context for care teams.',
    snippets: [
      { label: 'Risk gauge', selector: '.snippet-preview[data-tpl="tpl-gauge"]', note: 'The animated original 68/100 support signal.' },
      { label: 'Factor breakdown', selector: '.snippet-preview[data-tpl="tpl-factors"]', note: 'The contributing factors behind a signal.' },
      { label: 'Caseload stats', selector: '.snippet-preview[data-tpl="tpl-stats"]', note: 'All seven original caseload statistics.' },
    ],
  },
  {
    id: 'mobile-home',
    label: 'Mobile home',
    eyebrow: 'Dashboard & reset',
    file: 'apulza-mobile-dashboard-breathing-snippets.html',
    source: 'Mobile dashboard and breathing',
    description: 'The mobile dashboard cards and the compact interactive breathing experience.',
    snippets: [
      { label: 'Dashboard cards', selector: '.snippet-preview[data-tpl="tpl-dashboard"]', note: 'Study minutes, this week, and Cat Cafe.' },
      { label: 'Breathing orb', selector: '.snippet-preview[data-tpl="tpl-breathing"]', note: 'The original mobile box-breathing screen.' },
    ],
  },
  {
    id: 'mobile-courses',
    label: 'Mobile study',
    eyebrow: 'Courses & notifications',
    file: 'apulza-mobile-courses-assignments-snippets.html',
    source: 'Mobile coursework',
    description: 'The original phone-sized course, plan, assignment, and notification screens.',
    snippets: [
      { label: 'Course list', selector: '#screen-courses', note: 'All active courses and plan states.' },
      { label: 'Course detail', selector: '#screen-course-detail', note: 'Plan summary and course strategies.' },
      { label: 'Assignments', selector: '#screen-assignments', note: 'Complete assignment buckets and statuses.' },
      { label: 'Notifications', selector: '#screen-notifications', note: 'The original student notification feed.' },
    ],
  },
  {
    id: 'mobile-account',
    label: 'Mobile support',
    eyebrow: 'Account & resources',
    file: 'apulza-mobile-account-support-snippets.html',
    source: 'Mobile account and support',
    description: 'The original mobile settings, support, resources, profile, and first-course onboarding.',
    snippets: [
      { label: 'Settings', selector: '.snippet-preview[data-tpl="tpl-settings"]', note: 'Display and reading preferences.' },
      { label: 'ApulzaBot', selector: '.snippet-preview[data-tpl="tpl-support"]', note: 'The original mobile support widget.' },
      { label: 'Resources', selector: '.snippet-preview[data-tpl="tpl-resources"]', note: 'Mobile ADHD strategy accordion.' },
      { label: 'Profile', selector: '.snippet-preview[data-tpl="tpl-profile"]', note: 'Profile header and supported conditions.' },
      { label: 'Onboarding', selector: '.snippet-preview[data-tpl="tpl-onboarding"]', note: 'Add your first course on mobile.' },
    ],
  },
]

function ExactSnippetFrame({
  group,
  snippet,
}: {
  group: SnippetGroup
  snippet: Snippet
}) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [group.id, snippet.label])

  const isolatePreview = (event: SyntheticEvent<HTMLIFrameElement>) => {
    const frame = event.currentTarget

    try {
      const doc = frame.contentDocument
      const childWindow = frame.contentWindow
      if (!doc || !childWindow) throw new Error('Preview document unavailable')

      const selected = doc.querySelector<HTMLElement>(snippet.selector)
      const preview = selected?.matches('.snippet-preview, .apz-preview')
        ? selected
        : selected?.closest<HTMLElement>('.snippet-preview, .apz-preview')

      if (!preview) throw new Error(`Preview not found: ${snippet.selector}`)

      const host = doc.createElement('main')
      host.className = 'apulza-exact-embed'
      host.append(preview)
      doc.body.replaceChildren(host)

      const style = doc.createElement('style')
      style.textContent = `
        html, body {
          width: 100%;
          min-width: 0 !important;
          min-height: 0 !important;
          margin: 0 !important;
          overflow: hidden !important;
          background: transparent !important;
        }
        .apulza-exact-embed {
          display: block;
          width: 100%;
          min-width: 0;
          margin: 0;
          padding: 0;
        }
        .apulza-exact-embed > .snippet-preview,
        .apulza-exact-embed > .apz-preview {
          box-sizing: border-box;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
          }
        }
      `
      doc.head.append(style)

      const syncHeight = () => {
        const height = Math.max(220, Math.ceil(doc.documentElement.scrollHeight))
        frame.style.height = `${height}px`
      }

      syncHeight()
      const observer = new ResizeObserver(syncHeight)
      observer.observe(doc.body)
      childWindow.setTimeout(syncHeight, 50)
      childWindow.setTimeout(syncHeight, 300)
    } catch {
      setError(true)
    }
  }

  if (error) {
    return (
      <div className="exact-preview-error" role="status">
        This product preview could not load. Choose another view and return to try again.
      </div>
    )
  }

  return (
    <iframe
      ref={frameRef}
      key={`${group.id}-${snippet.label}`}
      className="exact-snippet-frame"
      src={`/snippets/${group.file}`}
      title={`${group.label}: ${snippet.label}`}
      loading="eager"
      onLoad={isolatePreview}
    />
  )
}

export default function ExperienceGallery() {
  const [activeGroupId, setActiveGroupId] = useState(snippetGroups[0].id)
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0)
  const activeGroup = snippetGroups.find((group) => group.id === activeGroupId) ?? snippetGroups[0]
  const activeSnippet = activeGroup.snippets[activeSnippetIndex] ?? activeGroup.snippets[0]

  const chooseGroup = (id: string) => {
    setActiveGroupId(id)
    setActiveSnippetIndex(0)
  }

  const previousSnippet = () => {
    setActiveSnippetIndex((current) => (current - 1 + activeGroup.snippets.length) % activeGroup.snippets.length)
  }

  const nextSnippet = () => {
    setActiveSnippetIndex((current) => (current + 1) % activeGroup.snippets.length)
  }

  return (
    <section className="experience-gallery" aria-labelledby="experience-gallery-title">
      <div className="exact-gallery-inner">
        <div className="exact-gallery-heading motion-reveal">
          <div>
            <p className="eyebrow">Explore the complete product</p>
            <h2 id="experience-gallery-title">The real Apulza experience, down to the details.</h2>
          </div>
          <p>
            These are the original product components—same markup, tokens, artwork, animations,
            data, and interactions—presented inside the marketing site without redesigning them.
          </p>
        </div>

        <div className="exact-group-tabs motion-reveal" role="tablist" aria-label="Apulza product areas">
          {snippetGroups.map((group) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeGroup.id === group.id}
              onClick={() => chooseGroup(group.id)}
              key={group.id}
            >
              <span>{group.eyebrow}</span>
              <strong>{group.label}</strong>
              <em>{group.snippets.length}</em>
            </button>
          ))}
        </div>

        <div className="exact-gallery-shell motion-reveal">
          <aside className="exact-snippet-nav" aria-label={`${activeGroup.label} previews`}>
            <div className="exact-snippet-nav-intro">
              <span>{activeGroup.source}</span>
              <h3>{activeGroup.label}</h3>
              <p>{activeGroup.description}</p>
            </div>
            <div role="tablist" aria-label={`${activeGroup.label} components`}>
              {activeGroup.snippets.map((snippet, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSnippetIndex === index}
                  onClick={() => setActiveSnippetIndex(index)}
                  key={snippet.label}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{snippet.label}</strong>
                  <em>›</em>
                </button>
              ))}
            </div>
            <small>
              {activeGroup.snippets.length} original component{activeGroup.snippets.length === 1 ? '' : 's'}
            </small>
          </aside>

          <div className="exact-preview-column" role="tabpanel">
            <div className="exact-preview-head">
              <div>
                <span><i /> Original product preview</span>
                <h3>{activeSnippet.label}</h3>
                <p>{activeSnippet.note}</p>
              </div>
              <div className="exact-preview-stepper">
                <button type="button" onClick={previousSnippet} aria-label="Previous component">←</button>
                <span>{activeSnippetIndex + 1} / {activeGroup.snippets.length}</span>
                <button type="button" onClick={nextSnippet} aria-label="Next component">→</button>
              </div>
            </div>
            <div className="exact-preview-canvas">
              <ExactSnippetFrame group={activeGroup} snippet={activeSnippet} />
            </div>
            <div className="exact-preview-foot">
              <span>Exact source implementation</span>
              <span>Responsive preview</span>
              <span>Interactive where supported</span>
            </div>
          </div>
        </div>

        <div className="exact-coverage-strip" aria-label="Included source collections">
          <strong>36 original components</strong>
          <span>10 supplied source collections</span>
          <span>Desktop + mobile + counselor</span>
          <span>No visual reinterpretation</span>
        </div>
      </div>
    </section>
  )
}
