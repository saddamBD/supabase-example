"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"

export function DataViewer() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tableName, setTableName] = useState("todos")

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.from(tableName).select("*").limit(100)

      if (error) throw error

      setData(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, []) // Removed tableName from the dependency array

  // Get column names from the first row of data
  const columns = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="Table name"
          className="max-w-xs"
        />
        <Button onClick={fetchData} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Refresh Data"
          )}
        </Button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-md">Error: {error}</div>}

      {data.length === 0 && !loading && !error ? (
        <div className="p-4 text-center text-muted-foreground">No data found in table "{tableName}"</div>
      ) : (
        <div className="border rounded-md overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {typeof row[column] === "object" ? JSON.stringify(row[column]) : String(row[column])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        Showing {data.length} records from the "{tableName}" table
      </div>
    </div>
  )
}

