import { TodoList } from "@/components/todo-list"
import { SupabaseTest } from "@/components/supabase-test"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Todo App</h1>
        <p className="text-muted-foreground mb-4 text-center">With REST API and Supabase real-time sync</p>

        <div className="flex justify-center mb-8">
          <Button asChild variant="outline">
            <Link href="/data">
              <Database className="mr-2 h-4 w-4" />
              View Supabase Data
            </Link>
          </Button>
        </div>

        <SupabaseTest />

        <div className="h-8"></div>

        <TodoList />
      </div>
    </main>
  )
}

