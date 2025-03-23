"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/app/auth-providers"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Package, BarChart } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/")
    }
  }, [isAdmin, router])

  if (!isAdmin) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-muted border-r hidden md:block">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-6">Admin Dashboard</h2>
          <nav className="space-y-2">
            <Link href="/admin">
              <Button variant={pathname === "/admin" ? "default" : "ghost"} className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant={pathname === "/admin/users" ? "default" : "ghost"} className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link href="/admin/templates">
              <Button
                variant={pathname.startsWith("/admin/templates") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Package className="mr-2 h-4 w-4" />
                Templates
              </Button>
            </Link>
            <Link href="/admin/sales">
              <Button
                variant={pathname.startsWith("/admin/sales") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <BarChart className="mr-2 h-4 w-4" />
                Sales
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">{children}</div>
    </div>
  )
}

