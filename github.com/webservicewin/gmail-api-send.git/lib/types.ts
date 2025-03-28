export type EmailData = {
  to: string
  subject: string
  body: string
  cc?: string[]
  bcc?: string[]
  attachments?: any[]
}

export type EmailHistoryItem = {
  id: string
  subject: string
  recipients: string[]
  timestamp: string
  success: boolean
  error?: string
}

export type EmailTemplate = {
  id: string
  name: string
  subject: string
  body: string
}

