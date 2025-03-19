import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res }, { supabaseUrl: "https://qfrykomckfnnbrjisfqj.supabase.co", supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcnlrb21ja2ZubmJyamlzZnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNTYxNjAsImV4cCI6MjA1NzgzMjE2MH0.-C6hY6haFUkSMJzCV849xxsqtb948sDpLI8zKH94wZs" })

  const path = req.nextUrl.pathname

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the path starts with /admin
  if (path.startsWith("/admin")) {
    // If not authenticated, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    // Check if the user is an admin (has the email leoame99@gmail.com)
    if (session.user.email !== "leoame99@gmail.com") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}

