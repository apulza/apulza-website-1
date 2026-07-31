import { useEffect, useRef, useState, type SyntheticEvent } from 'react'
import './MobileAppShowcase.css'

type MobileScreen = {
  id: string
  label: string
  selector: string
  eyebrow: string
  note: string
}

const mobileScreens: MobileScreen[] = [
  {
    id: 'support',
    label: 'ApulzaBot',
    selector: '.snippet-preview[data-tpl="tpl-support"]',
    eyebrow: 'Ask in the moment',
    note: 'Get calm, course-aware guidance without leaving the task in front of you.',
  },
  {
    id: 'resources',
    label: 'Resources',
    selector: '.snippet-preview[data-tpl="tpl-resources"]',
    eyebrow: 'Find a strategy',
    note: 'Browse practical ADHD support by what feels difficult right now.',
  },
  {
    id: 'settings',
    label: 'Settings',
    selector: '.snippet-preview[data-tpl="tpl-settings"]',
    eyebrow: 'Make it comfortable',
    note: 'Adjust reading and display preferences around the way your brain works.',
  },
  {
    id: 'profile',
    label: 'Profile',
    selector: '.snippet-preview[data-tpl="tpl-profile"]',
    eyebrow: 'Keep context close',
    note: 'Carry the preferences and support context that make guidance feel personal.',
  },
  {
    id: 'onboarding',
    label: 'Onboarding',
    selector: '.snippet-preview[data-tpl="tpl-onboarding"]',
    eyebrow: 'Start without friction',
    note: 'Add a first course with a short, low-pressure setup built for mobile.',
  },
]

function MobilePreview({ screen }: { screen: MobileScreen }) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [screen.id])

  const isolatePreview = (event: SyntheticEvent<HTMLIFrameElement>) => {
    const frame = event.currentTarget

    try {
      const doc = frame.contentDocument
      const childWindow = frame.contentWindow
      if (!doc || !childWindow) throw new Error('Preview document unavailable')

      const preview = doc.querySelector<HTMLElement>(screen.selector)
      if (!preview) throw new Error(`Preview not found: ${screen.selector}`)

      doc.documentElement.dataset.theme = 'light'

      const colorReplacements: Record<string, string> = {
        '#7c3aed': '#611a9f',
        '#6d28d9': '#4e1583',
        '#f2ecfd': '#f2eafb',
        '#f6f3fb': '#fbf7ff',
        '#1c1526': '#241f2b',
        '#78708a': '#6e6676',
        '#a89cbb': '#9c94a2',
        '#efeaf7': '#ece6e0',
        '#ded2ee': '#ded6cd',
      }

      preview.querySelectorAll<HTMLElement>('[style], [fill], [stroke]').forEach((element) => {
        ;['style', 'fill', 'stroke'].forEach((attribute) => {
          const value = element.getAttribute(attribute)
          if (!value) return

          const harmonized = Object.entries(colorReplacements).reduce(
            (current, [source, replacement]) => current.replace(new RegExp(source, 'gi'), replacement),
            value,
          )
          element.setAttribute(attribute, harmonized)
        })
      })

      const host = doc.createElement('main')
      host.className = 'apulza-mobile-embed'
      host.append(preview)
      doc.body.replaceChildren(host)

      const fontLink = doc.createElement('link')
      fontLink.rel = 'stylesheet'
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@300..800&display=swap'
      doc.head.append(fontLink)

      const style = doc.createElement('style')
      style.textContent = `
        html {
          color-scheme: light !important;
          --page-bg: #fbf7ff !important;
          --page-surface: #ffffff !important;
          --page-surface-2: #f5effa !important;
          --page-border: #e4d3f6 !important;
          --page-fg: #241f2b !important;
          --page-fg-muted: #6e6676 !important;
          --page-accent: #611a9f !important;
        }
        html, body {
          width: 100%;
          min-width: 0 !important;
          min-height: 0 !important;
          margin: 0 !important;
          overflow: hidden !important;
          background: transparent !important;
        }
        .apz {
          --c-bg: #fbf7ff !important;
          --c-card: #ffffff !important;
          --c-muted: #f5effa !important;
          --c-fg: #241f2b !important;
          --c-fg-muted: #6e6676 !important;
          --c-subtle: #9c94a2 !important;
          --c-primary: #611a9f !important;
          --c-primary-strong: #4e1583 !important;
          --c-primary-weak: #f2eafb !important;
          --c-border: #ece6e0 !important;
          --c-border-strong: #ded6cd !important;
        }
        .apulza-mobile-embed {
          display: block;
          width: 100%;
          min-width: 0;
          margin: 0;
          padding: 0;
        }
        .apulza-mobile-embed > .snippet-preview {
          box-sizing: border-box;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          border: 0 !important;
          border-radius: 0 !important;
          padding: 0 !important;
          background: transparent !important;
        }
        .phone-frame {
          border-color: rgba(97, 26, 159, .18) !important;
          box-shadow:
            0 30px 65px rgba(43, 18, 61, .23),
            0 0 0 6px #241f2b inset !important;
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
        const height = Math.max(620, Math.ceil(host.scrollHeight))
        const currentHeight = Math.round(frame.getBoundingClientRect().height)
        if (Math.abs(currentHeight - height) > 1) frame.style.height = `${height}px`
      }

      syncHeight()
      fontLink.addEventListener('load', syncHeight, { once: true })
      doc.addEventListener('click', () => {
        childWindow.setTimeout(syncHeight, 0)
        childWindow.setTimeout(syncHeight, 240)
      })
      childWindow.setTimeout(syncHeight, 50)
      childWindow.setTimeout(syncHeight, 300)
      childWindow.setTimeout(syncHeight, 900)
    } catch {
      setError(true)
    }
  }

  if (error) {
    return (
      <div className="mobile-app-error" role="status">
        This mobile preview could not load. Choose another screen and return to try again.
      </div>
    )
  }

  return (
    <iframe
      ref={frameRef}
      key={screen.id}
      className="mobile-app-frame"
      src="/snippets/apulza-mobile-account-support-snippets.html"
      title={`Apulza mobile app: ${screen.label}`}
      loading="eager"
      onLoad={isolatePreview}
    />
  )
}

export default function MobileAppShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeScreen = mobileScreens[activeIndex]

  const moveScreen = (direction: number) => {
    setActiveIndex((current) => (current + direction + mobileScreens.length) % mobileScreens.length)
  }

  return (
    <section className="mobile-app-section" id="mobile-app" aria-labelledby="mobile-app-title">
      <div className="mobile-app-inner">
        <div className="mobile-app-copy motion-reveal">
          <p className="eyebrow">Support that goes with you</p>
          <h2 id="mobile-app-title">A calmer next step, right from your phone.</h2>
          <p className="mobile-app-lede">
            Apulza keeps support close when starting feels hard. Ask for guidance, find a useful
            strategy, and shape the experience around your needs—without returning to a desk.
          </p>

          <div className="mobile-screen-list" role="tablist" aria-label="Mobile support screens">
            {mobileScreens.map((screen, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-controls="mobile-app-preview"
                onClick={() => setActiveIndex(index)}
                key={screen.id}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <small>{screen.eyebrow}</small>
                  <strong>{screen.label}</strong>
                </span>
                <i aria-hidden="true">→</i>
              </button>
            ))}
          </div>
        </div>

        <div className="mobile-app-stage motion-reveal" id="mobile-app-preview" role="tabpanel">
          <div className="mobile-stage-orbit mobile-stage-orbit-one" aria-hidden="true" />
          <div className="mobile-stage-orbit mobile-stage-orbit-two" aria-hidden="true" />

          <div className="mobile-stage-header">
            <div>
              <span>Live mobile preview</span>
              <strong>{activeScreen.label}</strong>
            </div>
            <div className="mobile-stage-controls">
              <button type="button" onClick={() => moveScreen(-1)} aria-label="Previous mobile screen">←</button>
              <span>{activeIndex + 1} / {mobileScreens.length}</span>
              <button type="button" onClick={() => moveScreen(1)} aria-label="Next mobile screen">→</button>
            </div>
          </div>

          <div className="mobile-phone-shell">
            <MobilePreview screen={activeScreen} />
          </div>

          <p className="mobile-stage-note">{activeScreen.note}</p>
        </div>
      </div>
    </section>
  )
}
