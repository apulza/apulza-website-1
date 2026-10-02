type AssetsBinding = {
  fetch(request: Request): Promise<Response>
}

type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement
  run(): Promise<{ meta: { last_row_id: number } }>
}

type D1Database = {
  prepare(query: string): D1PreparedStatement
}

type ExecutionContext = {
  waitUntil(promise: Promise<unknown>): void
}

type Env = {
  ASSETS: AssetsBinding
  DB: D1Database
  // Google Sheet copy of sign-ups (see google-apps-script/beta-signups.gs).
  // Optional: when unset, sign-ups are only stored in D1.
  SHEETS_WEBHOOK_URL?: string
  SHEETS_WEBHOOK_SECRET?: string
}

// Bump this whenever public/beta-terms.html changes in a meaningful way.
const BETA_TERMS_VERSION = '2026-09-30'

// Support-needs answers stay in D1 only unless this is turned on, so the more
// sensitive answers aren't copied into Google. Flip to true to show them in the Sheet.
const SHEET_INCLUDES_SUPPORT_NEEDS = false

const roles = ['student', 'counselor'] as const
const feedbackPrefs = ['survey', 'call', 'in_app'] as const
const supportNeeds = ['focus', 'time', 'deadlines', 'starting'] as const

// Labels shown in the Google Sheet.
const roleLabels: Record<(typeof roles)[number], string> = {
  student: 'Student',
  counselor: 'Counselor (needs approval)',
}
const feedbackLabels: Record<(typeof feedbackPrefs)[number], string> = {
  survey: 'Short survey',
  call: 'Quick call',
  in_app: 'In the app only',
}
const supportNeedLabels: Record<(typeof supportNeeds)[number], string> = {
  focus: 'Focus',
  time: 'Managing time',
  deadlines: 'Deadlines',
  starting: 'Getting started',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status })
}

function text(form: FormData, key: string, maxLength: number) {
  const value = String(form.get(key) ?? '').trim()
  return value.length > maxLength ? null : value
}

function pickAllowed<T extends string>(values: FormDataEntryValue[], allowed: readonly T[]) {
  return [...new Set(values.map(String))].filter((value): value is T =>
    (allowed as readonly string[]).includes(value),
  )
}

type SheetRow = Record<string, string>

async function copyToSheet(env: Env, signupId: number, row: SheetRow) {
  if (!env.SHEETS_WEBHOOK_URL || !env.SHEETS_WEBHOOK_SECRET) return

  try {
    // Apps Script answers POSTs with a redirect; fetch follows it to read the result.
    const response = await fetch(env.SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.SHEETS_WEBHOOK_SECRET, row }),
    })
    const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null

    if (!response.ok || !result?.ok) {
      console.error('beta signup sheet copy rejected', signupId, response.status, result?.error)
      return
    }

    await env.DB.prepare(`UPDATE beta_signups SET sheet_synced_at = datetime('now') WHERE id = ?`)
      .bind(signupId)
      .run()
  } catch (error) {
    // The sign-up is still safe in D1; rows with sheet_synced_at IS NULL can be re-sent.
    console.error('beta signup sheet copy failed', signupId, error)
  }
}

async function handleBetaSignup(request: Request, env: Env, ctx: ExecutionContext) {
  if (Number(request.headers.get('content-length') ?? 0) > 20_000) {
    return json({ error: 'Submission is too large.' }, 413)
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return json({ error: 'Could not read the form.' }, 400)
  }

  // Honeypot: real people never fill this hidden field. Pretend it worked.
  if (String(form.get('_gotcha') ?? '').trim()) return json({ ok: true })

  const name = text(form, 'name', 100)
  const email = text(form, 'email', 254)?.toLowerCase()
  const role = pickAllowed([form.get('role') ?? ''], roles)[0]

  if (!name || !email || !emailPattern.test(email)) {
    return json({ error: 'Please add your name and a valid email address.' }, 400)
  }
  if (!role) {
    return json({ error: 'Please choose student or counselor.' }, 400)
  }
  if (form.get('confirm_18_plus') !== 'yes' || form.get('accept_terms') !== 'yes') {
    return json({ error: 'Please confirm you are 18+ and accept the beta terms.' }, 400)
  }

  const school = text(form, 'school', 150)
  const yearLevel = text(form, 'year_level', 80)
  const phoneInput = text(form, 'phone', 30)
  if (school === null || yearLevel === null || phoneInput === null) {
    return json({ error: 'One of the optional answers is too long.' }, 400)
  }

  const feedbackPref = pickAllowed([form.get('feedback_pref') ?? ''], feedbackPrefs)[0] ?? null
  // Only keep a phone number when they asked to be contacted by call.
  const phone = feedbackPref === 'call' && phoneInput ? phoneInput : null
  const chosenSupportNeeds = pickAllowed(form.getAll('support_needs'), supportNeeds)

  let signupId: number
  try {
    const result = await env.DB.prepare(
      `INSERT INTO beta_signups
        (name, email, role, confirmed_18_plus, terms_version, school, year_level,
         feedback_pref, phone, support_needs)
       VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        name,
        email,
        role,
        BETA_TERMS_VERSION,
        school || null,
        yearLevel || null,
        feedbackPref,
        phone,
        chosenSupportNeeds.length ? JSON.stringify(chosenSupportNeeds) : null,
      )
      .run()
    signupId = result.meta.last_row_id
  } catch (error) {
    if (String(error).includes('UNIQUE')) {
      return json({ error: 'duplicate' }, 409)
    }
    console.error('beta signup insert failed', error)
    return json({ error: 'Something went wrong on our side.' }, 500)
  }

  const sheetRow: SheetRow = {
    'Signed up (UTC)': new Date().toISOString().slice(0, 16).replace('T', ' '),
    Name: name,
    Email: email,
    Role: roleLabels[role],
    School: school,
    'Year / level': yearLevel,
    'Feedback preference': feedbackPref ? feedbackLabels[feedbackPref] : '',
    Phone: phone ?? '',
    ...(SHEET_INCLUDES_SUPPORT_NEEDS
      ? { 'Support needs': chosenSupportNeeds.map((need) => supportNeedLabels[need]).join(', ') }
      : {}),
    'Terms version': BETA_TERMS_VERSION,
    'Signup ID': String(signupId),
  }
  // Don't make the person wait on Google; the Worker finishes this after responding.
  ctx.waitUntil(copyToSheet(env, signupId, sheetRow))

  return json({ ok: true }, 201)
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)

    if (url.pathname === '/api/beta-signup') {
      if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)
      return handleBetaSignup(request, env, ctx)
    }

    return env.ASSETS.fetch(request)
  },
}
