import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Check your .env file or Vercel project settings.")
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Simple function to test connection
export async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...")
    const { data, error } = await supabase.from("todos").select("count").limit(1)

    if (error) throw error

    console.log("Supabase connection successful:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Supabase connection test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Function to create the todos table if it doesn't exist
export async function ensureTodosTable() {
  try {
    console.log("Checking if todos table exists...")

    // First, check if we can access the table
    const { error: accessError } = await supabase.from("todos").select("count").limit(1)

    if (accessError) {
      console.error("Error accessing todos table:", accessError)
      return {
        success: false,
        error: accessError.message,
      }
    }

    console.log("Todos table exists and is accessible")
    return { success: true }
  } catch (error) {
    console.error("Error ensuring todos table:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

