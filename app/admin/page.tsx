"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { BarChart, DollarSign, Package, Plus, Users } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { toast } from "sonner"

// Template type definition
type Template = {
  id: string
  title: string
  description: string
  price: number
  main_image: string
  images: string[]
  enabled: boolean
  created_at: string
  sales_count: number
}

// Sales data type definition
type SalesData = {
  template_id: string
  template_title: string
  count: number
  revenue: number
}

export default function AdminPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<Partial<Template> | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [additionalImageFiles, setAdditionalImageFiles] = useState<(File | null)[]>([])
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([])
  const supabase = createClientComponentClient({ supabaseUrl: "https://qfrykomckfnnbrjisfqj.supabase.co", supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcnlrb21ja2ZubmJyamlzZnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNTYxNjAsImV4cCI6MjA1NzgzMjE2MH0.-C6hY6haFUkSMJzCV849xxsqtb948sDpLI8zKH94wZs" })

  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    totalTemplates: 0,
    totalSales: 0,
    totalRevenue: 0,
    conversionRate: 0,
  })

  // Fetch templates and sales data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch templates
        const { data: templatesData, error: templatesError } = await supabase
          .from("templates")
          .select("*")
          .order("created_at", { ascending: false })

        if (templatesError) throw templatesError

        // Fetch sales data
        const { data: salesData, error: salesError } = await supabase
          .from("sales")
          .select(`
            template_id,
            templates(title),
            count(*) as count,
            sum(amount) as revenue
          `)
          .filter('template_id, templates.title')
          .order("revenue", { ascending: false })

        if (salesError) throw salesError

        // Fetch monthly revenue data
        const { data: monthlyData, error: monthlyError } = await supabase
          .from("monthly_revenue")
          .select("*")
          .order("month", { ascending: true })

        if (monthlyError) throw monthlyError

        // Process the data
        const processedSalesData = salesData.map((item: any) => ({
          template_id: item.template_id,
          template_title: item.templates.title,
          count: item.count,
          revenue: item.revenue,
        }))

        // Calculate analytics
        const totalTemplates = templatesData.length
        const totalSales = processedSalesData.reduce((sum, item) => sum + item.count, 0)
        const totalRevenue = processedSalesData.reduce((sum, item) => sum + item.revenue, 0)
        const conversionRate = 3.2 // This would be calculated from actual data

        setTemplates(templatesData)
        setSalesData(processedSalesData)
        setMonthlyRevenue(monthlyData || [])
        setAnalyticsData({
          totalTemplates,
          totalSales,
          totalRevenue,
          conversionRate,
        })
      } catch (error: any) {
        toast.error('Error fetching data: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const handleAddTemplate = () => {
    setCurrentTemplate({
      title: "",
      description: "",
      price: 0,
      main_image: "",
      images: ["", "", "", ""],
      enabled: true,
    })
    setMainImageFile(null)
    setAdditionalImageFiles([null, null, null, null])
    setIsDialogOpen(true)
  }

  const handleEditTemplate = (template: Template) => {
    setCurrentTemplate(template)
    setMainImageFile(null)
    setAdditionalImageFiles([null, null, null, null])
    setIsDialogOpen(true)
  }

  const handleToggleTemplate = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("templates").update({ enabled: !currentStatus }).eq("id", id)

      if (error) throw error

      setTemplates(
        templates.map((template) => (template.id === id ? { ...template, enabled: !currentStatus } : template)),
      )

      toast.success('Template has been ' + (!currentStatus ? 'enabled' : 'disabled'))
    } catch (error: any) {
      toast.error('Error updating template: ' + error.message)
    }
  }

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentTemplate) return

    try {
      // Upload main image if provided
      let mainImageUrl = currentTemplate.main_image
      if (mainImageFile) {
        const mainImagePath = `templates/${Date.now()}_${mainImageFile.name}`
        const { data: mainImageData, error: mainImageError } = await supabase.storage
          .from("template-images")
          .upload(mainImagePath, mainImageFile)

        if (mainImageError) throw mainImageError

        const { data: mainImageUrlData } = supabase.storage.from("template-images").getPublicUrl(mainImagePath)

        mainImageUrl = mainImageUrlData.publicUrl
      }

      // Upload additional images if provided
      const additionalImageUrls = [...(currentTemplate.images || [])]
      for (let i = 0; i < additionalImageFiles.length; i++) {
        const file = additionalImageFiles[i]
        if (file) {
          const imagePath = `templates/${Date.now()}_${i}_${file.name}`
          const { data: imageData, error: imageError } = await supabase.storage
            .from("template-images")
            .upload(imagePath, file)

          if (imageError) throw imageError

          const { data: imageUrlData } = supabase.storage.from("template-images").getPublicUrl(imagePath)

          additionalImageUrls[i] = imageUrlData.publicUrl
        }
      }

      const templateData = {
        title: currentTemplate.title || '',
        description: currentTemplate.description || '',
        price: currentTemplate.price || 0,
        main_image: mainImageUrl || '',
        images: additionalImageUrls,
        enabled: currentTemplate.enabled ?? true,
      } satisfies Partial<Template>;

      if (currentTemplate.id) {
        // Update existing template
        const { error } = await supabase.from("templates").update(templateData).eq("id", currentTemplate.id)

        if (error) throw error

        setTemplates(
          templates.map((template) =>
            template.id === currentTemplate.id ? { ...template, ...templateData } : template,
          ),
        )

        toast.success('The template has been successfully updated.')
      } else {
        // Add new template
        const { data, error } = await supabase.from("templates").insert(templateData).select()

        if (error) throw error

        setTemplates([data[0], ...templates])

        toast.success('The new template has been successfully created.')
      }

      setIsDialogOpen(false)
    } catch (error: any) {
      toast.error('Error saving template: ' + error.message)
    }
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <Package className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Templates</p>
              <h3 className="text-2xl font-bold">{analyticsData.totalTemplates}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <Users className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <h3 className="text-2xl font-bold">{analyticsData.totalSales}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <DollarSign className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <h3 className="text-2xl font-bold">${analyticsData.totalRevenue.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <BarChart className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <h3 className="text-2xl font-bold">{analyticsData.conversionRate}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="mb-8">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Templates</CardTitle>
                <CardDescription>Manage your Notion templates</CardDescription>
              </div>
              <Button onClick={handleAddTemplate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Template
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading templates...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.title}</TableCell>
                        <TableCell>${template.price}</TableCell>
                        <TableCell>{salesData.find((s) => s.template_id === template.id)?.count || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={template.enabled}
                              onCheckedChange={() => handleToggleTemplate(template.id, template.enabled)}
                            />
                            <span>{template.enabled ? "Active" : "Disabled"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Template</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={salesData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="template_title" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Sales" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyRevenue}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyRevenue}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="conversion_rate"
                      name="Conversion Rate (%)"
                      stroke="#ff7300"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Template</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={salesData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="template_title" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentTemplate?.id ? "Edit Template" : "Add Template"}</DialogTitle>
            <DialogDescription>Fill in the details for your Notion template</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveTemplate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={currentTemplate?.title || ""}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentTemplate?.description || ""}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={currentTemplate?.price || 0}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, price: Number.parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainImage">Main Image</Label>
              <div className="flex items-center gap-4">
                {currentTemplate?.main_image && (
                  <img
                    src={currentTemplate.main_image || "/placeholder.svg"}
                    alt="Main template image"
                    className="h-16 w-16 object-cover rounded-md"
                  />
                )}
                <Input
                  id="mainImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Images (at least 4)</Label>
              <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="space-y-2">
                    {currentTemplate?.images?.[index] && (
                      <img
                        src={currentTemplate.images[index] || "/placeholder.svg"}
                        alt={`Template image ${index + 1}`}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const newFiles = [...additionalImageFiles]
                        newFiles[index] = e.target.files?.[0] || null
                        setAdditionalImageFiles(newFiles)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={currentTemplate?.enabled || false}
                onCheckedChange={(checked) => setCurrentTemplate({ ...currentTemplate, enabled: checked })}
              />
              <Label htmlFor="enabled">Template Active</Label>
            </div>

            <DialogFooter>
              <Button type="submit">Save Template</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}

