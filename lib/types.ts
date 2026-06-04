export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled'
export type ContactStatus = 'active' | 'inactive' | 'prospect' | 'client'
export type FinanceType = 'income' | 'expense'

export interface Task {
  id: string
  title: string
  priority: TaskPriority
  status: TaskStatus
  due_date: string | null
  notes: string | null
  created_at: string
}

export interface Contact {
  id: string
  name: string
  company: string | null
  status: ContactStatus
  last_contact: string | null
  next_action: string | null
  notes: string | null
  email: string | null
  phone: string | null
}

export interface Finance {
  id: string
  amount: number
  type: FinanceType
  category: string
  description: string | null
  date: string
}

export interface Memory {
  id: string
  key: string
  value: string
  updated_at: string
}
