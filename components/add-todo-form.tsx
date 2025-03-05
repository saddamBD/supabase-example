"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Loader2 } from "lucide-react"

interface AddTodoFormProps {
  onAdd: (title: string) => Promise<void>
  disabled?: boolean
}

export function AddTodoForm({ onAdd, disabled = false }: AddTodoFormProps) {
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setIsSubmitting(true)
      await onAdd(title)
      setTitle("")
    } catch (error) {
      console.error("Error adding todo:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={disabled || isSubmitting}
        className="flex-1"
      />
      <Button type="submit" disabled={disabled || isSubmitting || !title.trim()}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </>
        )}
      </Button>
    </form>
  )
}

