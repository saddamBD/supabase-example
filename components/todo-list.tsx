"use client"

import { useSyncedTodos } from "@/hooks/use-synced-todos"
import { TodoItem } from "@/components/todo-item"
import { AddTodoForm } from "@/components/add-todo-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function TodoList() {
  const { todos, loading, error, supabaseConnected, addTodo, toggleTodo, removeTodo } = useSyncedTodos()

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error: {error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <AddTodoForm onAdd={addTodo} disabled={loading} />

      <div className="border rounded-md overflow-hidden">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 border-b">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : todos.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No tasks yet. Add one above!</p>
        ) : (
          todos.map((todo) => <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={removeTodo} />)
        )}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          {loading
            ? "Loading tasks..."
            : `${todos.length} task${todos.length === 1 ? "" : "s"} • ${todos.filter((t) => t.completed).length} completed`}
        </p>
        <p className="mt-1 flex items-center">
          <span
            className={`inline-block w-2 h-2 ${supabaseConnected ? "bg-green-500" : "bg-yellow-500"} rounded-full mr-2`}
          ></span>
          {supabaseConnected ? "Real-time sync enabled" : "Using API data only (Supabase not connected)"}
        </p>
      </div>
    </div>
  )
}

