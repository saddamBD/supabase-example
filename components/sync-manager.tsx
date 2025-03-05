"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, RefreshCw, Trash2 } from "lucide-react"
import { syncTodosToSupabase, clearSupabaseTodos } from "@/lib/sync-utils"
import { ensureTodosTable } from "@/lib/supabase"

export function SyncManager() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [action, setAction] = useState<"sync" | "clear" | "check">("sync")

  const handleSync = async () => {
    try {
      setAction("sync")
      setStatus("loading")
      setMessage("Syncing todos from REST API to Supabase...")

      const result = await syncTodosToSupabase()

      if (!result.success) {
        throw new Error(result.error)
      }

      setStatus("success")
      setMessage(result.message || "Sync completed successfully")
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Unknown error occurred")
      console.error("Sync error:", err)
    }
  }

  const handleClear = async () => {
    try {
      setAction("clear")
      setStatus("loading")
      setMessage("Clearing all todos from Supabase...")

      const result = await clearSupabaseTodos()

      if (!result.success) {
        throw new Error(result.error)
      }

      setStatus("success")
      setMessage(result.message || "All todos cleared successfully")
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Unknown error occurred")
      console.error("Clear error:", err)
    }
  }

  const checkTable = async () => {
    try {
      setAction("check")
      setStatus("loading")
      setMessage("Checking todos table...")

      const result = await ensureTodosTable()

      if (!result.success) {
        throw new Error(result.error)
      }

      setStatus("success")
      setMessage("Todos table exists and is accessible")
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Unknown error occurred")
      console.error("Table check error:", err)
    }
  }

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-4">Supabase Sync Manager</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={handleSync} disabled={status === "loading"} className="flex items-center">
          {status === "loading" && action === "sync" ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Data to Supabase
            </>
          )}
        </Button>

        <Button
          onClick={handleClear}
          variant="destructive"
          disabled={status === "loading"}
          className="flex items-center"
        >
          {status === "loading" && action === "clear" ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Clearing...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Supabase Data
            </>
          )}
        </Button>

        <Button onClick={checkTable} variant="outline" disabled={status === "loading"} className="flex items-center">
          {status === "loading" && action === "check" ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Check Table
            </>
          )}
        </Button>
      </div>

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
        <p className="font-medium">Troubleshooting Tips:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>
            Make sure your Supabase project has a <code>todos</code> table with the correct schema
          </li>
          <li>Check that Row Level Security (RLS) policies allow inserts and selects</li>
          <li>
            Verify that real-time is enabled for the <code>todos</code> table in Supabase
          </li>
          <li>Try clearing and re-syncing the data if you encounter issues</li>
        </ul>
      </div>
    </div>
  )
}

