export type Todo = {
  id: number
  title: string
  completed: boolean
}

// Simulating a REST API endpoint - replace with your actual API
const API_URL = "https://jsonplaceholder.typicode.com/todos"

export async function fetchTodos(): Promise<Todo[]> {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.status} ${response.statusText}`)
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching todos:", error)
    throw error
  }
}

export async function fetchTodo(id: number): Promise<Todo> {
  try {
    const response = await fetch(`${API_URL}/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch todo ${id}: ${response.status} ${response.statusText}`)
    }
    return response.json()
  } catch (error) {
    console.error(`Error fetching todo ${id}:`, error)
    throw error
  }
}

export async function createTodo(title: string): Promise<Todo> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        title,
        completed: false,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to create todo: ${response.status} ${response.statusText}`)
    }
    return response.json()
  } catch (error) {
    console.error("Error creating todo:", error)
    throw error
  }
}

export async function updateTodo(id: number, updates: Partial<Todo>): Promise<Todo> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to update todo ${id}: ${response.status} ${response.statusText}`)
    }
    return response.json()
  } catch (error) {
    console.error(`Error updating todo ${id}:`, error)
    throw error
  }
}

export async function deleteTodo(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Failed to delete todo ${id}: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error(`Error deleting todo ${id}:`, error)
    throw error
  }
}

