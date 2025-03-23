import type React from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mountain, ShoppingCart } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import "./globals.css"
import { Toaster } from 'sonner'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "./auth-providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Notion Template Marketplace",
  description: "Premium Notion templates for productivity and organization",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <header className="border-b">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                  <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                      <Mountain className="h-6 w-6" />
                      <span className="font-bold">NotionMarket</span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                        Home
                      </Link>
                      <Link href="/templates" className="text-sm font-medium transition-colors hover:text-primary">
                        Templates
                      </Link>
                      <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                        About
                      </Link>
                      <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                        Contact
                      </Link>
                    </nav>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link href="/cart">
                      <Button variant="ghost" size="icon">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="sr-only">Cart</span>
                      </Button>
                    </Link>
                    <UserNav />
                  </div>
                </div>
              </header>
              <div className="flex-1">{children}</div>
              <footer className="border-t py-6 md:py-10">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <Link href="/" className="flex items-center gap-2 mb-4">
                        <Mountain className="h-6 w-6" />
                        <span className="font-bold">NotionMarket</span>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Premium Notion templates for productivity and organization.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-4">Quick Links</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="/" className="text-muted-foreground hover:text-foreground">
                            Home
                          </Link>
                        </li>
                        <li>
                          <Link href="/templates" className="text-muted-foreground hover:text-foreground">
                            Templates
                          </Link>
                        </li>
                        <li>
                          <Link href="/about" className="text-muted-foreground hover:text-foreground">
                            About
                          </Link>
                        </li>
                        <li>
                          <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                            Contact
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-4">Legal</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                            Privacy Policy
                          </Link>
                        </li>
                        <li>
                          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                            Terms of Service
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-4">Contact</h3>
                      <address className="not-italic text-sm text-muted-foreground">
                        <p>Email: support@notionmarket.com</p>
                        <p>Buenos Aires, Argentina</p>
                      </address>
                    </div>
                  </div>
                  <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    {/* <p>© {new Date().getFullYear()} NotionMarket. All rights reserved.</p> */}
                  </div>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}

