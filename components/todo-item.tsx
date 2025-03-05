import type { Todo } from "@/lib/api"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number, completed: boolean) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={(checked) => {
            onToggle(todo.id, checked === true)
          }}
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={`text-sm ${todo.completed ? "line-through text-muted-foreground" : ""}`}
        >
          {todo.title}
        </label>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onDelete(todo.id)} aria-label={`Delete ${todo.title}`}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

