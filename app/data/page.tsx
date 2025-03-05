import { DataViewer } from "@/components/data-viewer"
import { SyncManager } from "@/components/sync-manager"

export default function DataPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Supabase Data Manager</h1>
      <p className="text-muted-foreground mb-8">View and manage your Supabase table data</p>

      <div className="space-y-8">
        <SyncManager />
        <DataViewer />
      </div>
    </main>
  )
}

