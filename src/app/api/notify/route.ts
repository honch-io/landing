import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import { getPostHogClient } from "@/lib/posthog-server"

// In-memory rate limit: IP -> { count, resetAt }
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 2 // 2 requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

// Basic email validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const distinctId = request.headers.get("x-posthog-distinct-id")

  // Rate limit by IP
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown"

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    )
  }

  // Parse body safely
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { email } = body as { email?: string }

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  // Validate email format
  const trimmed = email.trim().toLowerCase()
  if (!EMAIL_RE.test(trimmed) || trimmed.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const sql = neon(process.env.DATABASE_URL!)

  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    INSERT INTO waitlist (email)
    VALUES (${trimmed})
    ON CONFLICT (email) DO NOTHING
  `

  const posthog = getPostHogClient()
  posthog.capture({
    distinctId: distinctId ?? trimmed,
    event: "waitlist_signup_completed",
    properties: { email: trimmed },
  })

  return NextResponse.json({ ok: true })
}
