import { supabase } from "./supabase"
import { fetchTodos } from "./api"

export async function syncTodosToSupabase() {
  try {
    console.log("Starting manual sync from REST API to Supabase...")

    // Fetch todos from REST API
    const apiTodos = await fetchTodos()
    const todosToSync = apiTodos.slice(0, 10) // Limit to 10 for demo

    console.log(`Fetched ${todosToSync.length} todos from API`)

    // Check for existing todos in Supabase to avoid duplicates
    const { data: existingTodos, error: fetchError } = await supabase.from("todos").select("id")

    if (fetchError) {
      console.error("Error fetching existing todos:", fetchError)
      throw fetchError
    }

    // Create a set of existing IDs for quick lookup
    const existingIds = new Set()
    if (existingTodos) {
      existingTodos.forEach((todo) => existingIds.add(todo.id))
      console.log(`Found ${existingIds.size} existing todos in Supabase`)
    }

    // Filter out todos that already exist in Supabase
    const newTodos = todosToSync.filter((todo) => !existingIds.has(todo.id))
    console.log(`Preparing to insert ${newTodos.length} new todos`)

    if (newTodos.length === 0) {
      console.log("No new todos to sync")
      return {
        success: true,
        message: "No new todos to sync",
        existingCount: existingIds.size,
      }
    }

    // Insert new todos into Supabase
    const { data, error } = await supabase
      .from("todos")
      .insert(newTodos.map(({ id, title, completed }) => ({ id, title, completed })))
      .select()

    if (error) {
      console.error("Error inserting todos:", error)
      throw error
    }

    console.log(`Successfully synced ${data?.length || 0} todos to Supabase`)
    return {
      success: true,
      message: `Synced ${data?.length || 0} todos to Supabase`,
      newCount: data?.length || 0,
      existingCount: existingIds.size,
    }
  } catch (error) {
    console.error("Sync failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function clearSupabaseTodos() {
  try {
    console.log("Clearing all todos from Supabase...")

    const { error } = await supabase.from("todos").delete().neq("id", 0) // Delete all records

    if (error) {
      console.error("Error clearing todos:", error)
      throw error
    }

    console.log("Successfully cleared all todos from Supabase")
    return { success: true, message: "All todos cleared from Supabase" }
  } catch (error) {
    console.error("Clear failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

