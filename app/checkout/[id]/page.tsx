"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, DollarSign } from "lucide-react"

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // In a real app, this would fetch from your database based on the ID
  const template = {
    id: params.id,
    title: "Project Management Template",
    price: 19.99,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      router.push("/thank-you")
    }, 2000)
  }

  return (
    <main className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="mercadopago" className="mb-6">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="mercadopago">Mercado Pago</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  </TabsList>

                  <TabsContent value="mercadopago">
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                      </div>

                      <RadioGroup defaultValue="card" className="grid grid-cols-2 gap-4">
                        <div>
                          <RadioGroupItem value="card" id="card" className="peer sr-only" />
                          <Label
                            htmlFor="card"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <CreditCard className="mb-3 h-6 w-6" />
                            Credit Card
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                          <Label
                            htmlFor="cash"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <DollarSign className="mb-3 h-6 w-6" />
                            Cash
                          </Label>
                        </div>
                      </RadioGroup>

                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" required />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal">
                    <div className="space-y-4 py-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        You will be redirected to PayPal to complete your purchase securely.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="paypal-email">PayPal Email</Label>
                        <Input id="paypal-email" type="email" placeholder="john@example.com" required />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : "Complete Purchase"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{template.title}</span>
                  <span>${template.price}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${template.price}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy.
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}

