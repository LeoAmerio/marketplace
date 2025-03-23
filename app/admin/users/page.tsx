"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useAuth } from "@/app/auth-providers"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { UserModal } from "@/components/user-modal"
import { UserTable } from "@/components/user-table"

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { isAdmin } = useAuth()
  const router = useRouter()

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/")
    }
  }, [isAdmin, router])

  const handleAddUser = () => {
    setCurrentUser(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: any) => {
    setCurrentUser(user)
    setIsModalOpen(true)
  }

  if (!isAdmin) {
    return null
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage system users</CardDescription>
          </div>
          <Button onClick={handleAddUser}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <UserTable onEdit={handleEditUser} />
        </CardContent>
      </Card>

      <UserModal open={isModalOpen} onOpenChange={setIsModalOpen} user={currentUser} />
    </main>
  )
}

