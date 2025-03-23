import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import api from "@/lib/api"

async function getTemplate(id: string) {
  try {
    const response = await api.get(`/templates/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching template ${id}:`, error)
    return null
  }
}

export default async function TemplatePage({ params }: { params: { id: string } }) {
  const supabase = await createServerComponentClient({ cookies }, { supabaseUrl: "https://qfrykomckfnnbrjisfqj.supabase.co", supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcnlrb21ja2ZubmJyamlzZnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNTYxNjAsImV4cCI6MjA1NzgzMjE2MH0.-C6hY6haFUkSMJzCV849xxsqtb948sDpLI8zKH94wZs" })
  const template2 = await getTemplate(params.id)

  // Fetch template from Supabase
  const { data: template, error } = await supabase.from("templates").select("*").eq("id", params.id).single()
  console.log('template 2', template2)
  console.log('template supa', template)
  // If template not found, show 404
  if (error || !template) {
    notFound()
  }

  // Default features if not provided
  const features = [
    "Project dashboard with key metrics",
    "Task management with priority levels",
    "Timeline view with Gantt chart",
    "Resource allocation tracker",
    "Automated status updates",
  ]

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="mb-6">
            <img
              src={template.main_image || "/placeholder.svg?height=500&width=800"}
              alt={template.title}
              className="w-full rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(template.images || []).map((image: string, index: number) => (
              <img
                key={index}
                src={image || "/placeholder.svg?height=400&width=600"}
                alt={`${template.title} preview ${index + 1}`}
                className="w-full rounded-lg"
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
          <p className="text-2xl font-bold mb-4">${template.price}</p>
          <p className="text-muted-foreground mb-6">{template.description}</p>

          <Tabs defaultValue="features" className="mb-8">
            <TabsList>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
            </TabsList>
            <TabsContent value="features">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="instructions">
              <Card>
                <CardContent className="pt-6">
                  <p>
                    After purchase, you'll receive an email with instructions to duplicate this template to your Notion
                    workspace. If you have any questions, please contact our support team.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Link href={`/checkout/${template.id}`}>
            <Button size="lg" className="w-full">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Buy Now
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

