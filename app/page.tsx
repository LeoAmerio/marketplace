import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function Home() {
  const supabase = await createServerComponentClient({ cookies }, { supabaseUrl: "https://qfrykomckfnnbrjisfqj.supabase.co", supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcnlrb21ja2ZubmJyamlzZnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNTYxNjAsImV4cCI6MjA1NzgzMjE2MH0.-C6hY6haFUkSMJzCV849xxsqtb948sDpLI8zKH94wZs" })

  // Fetch templates from Supabase
  const { data: templates, error } = await supabase
    .from("templates")
    .select("*")
    .eq("enabled", true)
    .order("created_at", { ascending: false })

  // If there's an error or no templates, show some defaults
  const displayTemplates = templates || [
    {
      id: "1",
      title: "Project Management Template",
      description: "Organize your projects with this comprehensive template",
      price: 19.99,
      main_image: "/placeholder.svg?height=300&width=400",
      enabled: true,
    },
    {
      id: "2",
      title: "Personal Finance Tracker",
      description: "Track your expenses and income with this easy-to-use template",
      price: 14.99,
      main_image: "/placeholder.svg?height=300&width=400",
      enabled: true,
    },
    {
      id: "3",
      title: "Content Calendar",
      description: "Plan your content strategy with this organized template",
      price: 24.99,
      main_image: "/placeholder.svg?height=300&width=400",
      enabled: true,
    },
  ]

  return (
    <main className="container mx-auto py-10 px-4">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Premium Notion Templates</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Boost your productivity with our professionally designed Notion templates
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayTemplates.map((template) => (
          <Card key={template.id} className="flex flex-col h-full">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={template.main_image || "/placeholder.svg?height=300&width=400"}
                alt={template.title}
                className="object-cover w-full h-full transition-transform hover:scale-105"
              />
            </div>
            <CardContent className="flex-grow pt-6">
              <CardTitle className="mb-2">{template.title}</CardTitle>
              <p className="text-muted-foreground">{template.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="font-bold text-lg">${template.price}</span>
              <Link href={`/templates/${template.id}`}>
                <Button>
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </section>
    </main>
  )
}

