"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { fetchTodos, type Todo, createTodo, updateTodo, deleteTodo } from "@/lib/api"

export function useSyncedTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [supabaseConnected, setSupabaseConnected] = useState(false)

  // Initial fetch from REST API
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true)
        const apiTodos = await fetchTodos()
        setTodos(apiTodos.slice(0, 10)) // Limiting to 10 items for demo

        // Check if Supabase has data
        try {
          const { data: supabaseTodos, error } = await supabase.from("todos").select("*").limit(10)

          if (error) throw error

          // If Supabase has data, use it instead of API data
          if (supabaseTodos && supabaseTodos.length > 0) {
            console.log("Using data from Supabase:", supabaseTodos.length, "todos")
            setTodos(supabaseTodos)
          } else {
            console.log("No data found in Supabase, using API data")
            // Try to sync the data to Supabase
            try {
              const existingIds = new Set()
              const todosToInsert = apiTodos
                .slice(0, 10)
                .filter((todo) => !existingIds.has(todo.id))
                .map(({ id, title, completed }) => ({ id, title, completed }))

              if (todosToInsert.length > 0) {
                console.log("Syncing", todosToInsert.length, "todos to Supabase")
                await supabase.from("todos").insert(todosToInsert)
              }
            } catch (syncError) {
              console.error("Failed to sync with Supabase:", syncError)
            }
          }

          setSupabaseConnected(true)
        } catch (supabaseError) {
          console.error("Failed to fetch from Supabase:", supabaseError)
          // Continue with API data even if Supabase fetch fails
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch todos"))
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Set up Supabase real-time subscription
  useEffect(() => {
    // Subscribe to changes on the todos table
    const subscription = supabase
      .channel("todos-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
        },
        (payload) => {
          console.log("Change received!", payload)

          // Handle different types of changes
          if (payload.eventType === "INSERT") {
            const newTodo = payload.new as Todo
            setTodos((prev) => [...prev, newTodo])
          } else if (payload.eventType === "UPDATE") {
            const updatedTodo = payload.new as Todo
            setTodos((prev) => prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)))
          } else if (payload.eventType === "DELETE") {
            const deletedTodo = payload.old as Todo
            setTodos((prev) => prev.filter((todo) => todo.id !== deletedTodo.id))
          }
        },
      )
      .subscribe((status) => {
        console.log("Supabase subscription status:", status)
        if (status === "SUBSCRIBED") {
          setSupabaseConnected(true)
        }
      })

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  // Functions to modify data (both API and Supabase)
  const addTodo = async (title: string) => {
    try {
      // First add to REST API
      const newTodo = await createTodo(title)

      // Then sync with Supabase
      if (supabaseConnected) {
        await supabase.from("todos").insert([
          {
            id: newTodo.id,
            title: newTodo.title,
            completed: newTodo.completed,
          },
        ])
      }

      // Optimistically update UI
      setTodos((prev) => [...prev, newTodo])

      return newTodo
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to add todo"))
      throw err
    }
  }

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      // Update in REST API
      const updatedTodo = await updateTodo(id, { completed })

      // Sync with Supabase
      if (supabaseConnected) {
        await supabase.from("todos").update({ completed }).eq("id", id)
      }

      // Optimistically update UI
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo)))

      return updatedTodo
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update todo ${id}`))
      throw err
    }
  }

  const removeTodo = async (id: number) => {
    try {
      // Delete from REST API
      await deleteTodo(id)

      // Sync with Supabase
      if (supabaseConnected) {
        await supabase.from("todos").delete().eq("id", id)
      }

      // Update UI
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to delete todo ${id}`))
      throw err
    }
  }

  return {
    todos,
    loading,
    error,
    supabaseConnected,
    addTodo,
    toggleTodo,
    removeTodo,
  }
}

