/**
 * Apulza beta sign-ups → Google Sheet
 *
 * The website saves every beta sign-up to its own database (Cloudflare D1) and
 * then sends a copy here, so the team can read and email testers from a Sheet.
 *
 * ONE-TIME SETUP
 * 1. Create a Google Sheet (e.g. "Apulza beta sign-ups"). Share it only with
 *    the people running the beta.
 * 2. In the Sheet: Extensions → Apps Script. Delete the sample code, paste in
 *    this whole file, and click Save.
 * 3. Project Settings (gear icon) → Script Properties → Add script property:
 *      Property: SHARED_SECRET
 *      Value:    a long random password (the same value goes in the website's
 *                SHEETS_WEBHOOK_SECRET setting)
 * 4. Deploy → New deployment → type "Web app".
 *      Execute as:     Me
 *      Who has access: Anyone
 *    Click Deploy, approve the permissions, and copy the Web app URL.
 *    ("Anyone" only means the website can reach it. Requests without the
 *    secret are rejected, and nobody can read the Sheet through this URL.)
 * 5. Give the Web app URL to whoever deploys the website. It goes in the
 *    SHEETS_WEBHOOK_URL setting.
 *
 * If you edit this script later: Deploy → Manage deployments → edit (pencil)
 * → Version: New version → Deploy. The URL stays the same.
 *
 * Feel free to add your own columns to the right (e.g. "Invited?",
 * "Approved?"). New sign-ups fill in their columns by header name and leave
 * yours alone. Don't rename the columns the website fills in.
 */

const SHEET_NAME = 'Sign-ups'

function doPost(e) {
  let payload
  try {
    payload = JSON.parse(e.postData.contents)
  } catch (err) {
    return respond({ ok: false, error: 'bad json' })
  }

  const secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET')
  if (!secret || payload.secret !== secret) {
    return respond({ ok: false, error: 'unauthorized' })
  }

  const row = payload.row
  if (!row || typeof row !== 'object') {
    return respond({ ok: false, error: 'missing row' })
  }

  // Two sign-ups arriving at once shouldn't overwrite each other.
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const sheet = getSheet()
    const fields = Object.keys(row)
    let headers = sheet.getLastColumn() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String)
      : []

    // First run (or a new field from the website): add any missing headers.
    const missing = fields.filter((field) => headers.indexOf(field) === -1)
    if (missing.length) {
      sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing])
      headers = headers.concat(missing)
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold')
      sheet.setFrozenRows(1)
    }

    const values = headers.map((header) => (header in row ? safeCell(row[header]) : ''))
    sheet.appendRow(values)
  } finally {
    lock.releaseLock()
  }

  return respond({ ok: true })
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME, 0)
}

// Stop text like "=IMPORTXML(...)" typed into the form from running as a formula.
function safeCell(value) {
  const text = value == null ? '' : String(value)
  return /^[=+\-@]/.test(text) ? "'" + text : text
}

function respond(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON)
}
