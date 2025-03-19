import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home } from "lucide-react"

export default function ThankYouPage() {
  return (
    <main className="container mx-auto py-20 px-4 text-center max-w-2xl">
      <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
      <p className="text-xl text-muted-foreground mb-8">
        We've sent you an email with instructions on how to access your Notion template.
      </p>
      <Link href="/">
        <Button size="lg">
          <Home className="mr-2 h-5 w-5" />
          Return to Home
        </Button>
      </Link>
    </main>
  )
}

