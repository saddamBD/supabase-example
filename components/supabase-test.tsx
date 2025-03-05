"use client"

import { useState } from "react"
import { testSupabaseConnection } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export function SupabaseTest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const testConnection = async () => {
    try {
      setStatus("loading")
      setMessage("Testing connection to Supabase...")

      const result = await testSupabaseConnection()

      if (!result.success) {
        throw new Error(result.error)
      }

      setStatus("success")
      setMessage("Successfully connected to Supabase!")
      console.log("Connection test result:", result.data)
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Unknown error occurred")
      console.error("Supabase connection error:", err)
    }
  }

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-4">Supabase Connection Test</h2>

      <Button onClick={testConnection} disabled={status === "loading"} className="mb-4">
        {status === "loading" ? "Testing..." : "Test Connection"}
      </Button>

      {status === "success" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">{message}</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Make sure your Supabase project is properly set up:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Check that your environment variables are correct</li>
          <li>Verify that the 'todos' table exists in your database</li>
          <li>Ensure that your Supabase project is active</li>
        </ul>
      </div>
    </div>
  )
}

