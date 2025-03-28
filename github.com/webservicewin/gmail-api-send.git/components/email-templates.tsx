"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Edit, Trash2, Save, X } from "lucide-react"
import { getTemplates, saveTemplate, deleteTemplate } from "@/lib/actions"
import type { EmailTemplate } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export function EmailTemplates() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<EmailTemplate>>({
    name: "",
    subject: "",
    body: "",
  })

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates()
        setTemplates(data)
      } catch (error) {
        console.error("Failed to fetch templates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const handleEdit = (template: EmailTemplate) => {
    setEditingId(template.id)
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body,
    })
  }

  const handleCreate = () => {
    setIsCreating(true)
    setFormData({
      name: "",
      subject: "",
      body: "",
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
  }

  const handleChange = (field: keyof EmailTemplate, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.name || !formData.subject || !formData.body) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      const templateData = {
        id: editingId || crypto.randomUUID(),
        name: formData.name!,
        subject: formData.subject!,
        body: formData.body!,
      }

      await saveTemplate(templateData)

      if (editingId) {
        setTemplates(templates.map((t) => (t.id === editingId ? templateData : t)))
      } else {
        setTemplates([...templates, templateData])
      }

      setEditingId(null)
      setIsCreating(false)

      toast({
        title: "Template saved",
        description: "Your email template has been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Failed to save template",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id)
      setTemplates(templates.filter((t) => t.id !== id))
      toast({
        title: "Template deleted",
        description: "Your email template has been deleted",
      })
    } catch (error) {
      toast({
        title: "Failed to delete template",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    )
  }

  const renderTemplateForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? "Edit Template" : "Create Template"}</CardTitle>
        <CardDescription>{editingId ? "Update your email template" : "Create a new email template"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g., Welcome Email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="template-subject">Subject</Label>
          <Input
            id="template-subject"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            placeholder="Email subject line"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="template-body">Body (HTML supported)</Label>
          <Textarea
            id="template-body"
            value={formData.body}
            onChange={(e) => handleChange("body", e.target.value)}
            placeholder="Enter your email content here..."
            className="min-h-[200px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Template
        </Button>
      </CardFooter>
    </Card>
  )

  if (editingId || isCreating) {
    return renderTemplateForm()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Templates</h3>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No templates found. Create your first template to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription className="truncate">{template.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground line-clamp-3">
                  {template.body.replace(/<[^>]*>/g, "")}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(template.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

