type Status = "To Do" | "Done"

type ToDo = {
  id: number
  name: string
  status: Status
}

class ToDoList {
  private list: Array<ToDo>;
  private nextId: number;
 
  constructor(){
    this.list = [];
    this.nextId = 1;
  }

  getTodos(): Array<ToDo> {
    return this.list;
  }

  addTodo(name: string): void {
    const newTodo: ToDo = {
      id: this.nextId,
      name,
      status: "To Do",
    };
    this.list.push(newTodo);
    this.nextId++;
  }

  filterTodos(status: Status): Array<ToDo> {
    return this.list.filter(todo => todo.status === status);
  }

  deleteTodoById(id: number): void {
    this.list = this.list.filter(todo => todo.id !== id);
  }

  toggleTodoStatus(id: number): void {
    const todo = this.list.find(todo => todo.id === id);
    if (todo) {
      todo.status = todo.status === "To Do" ? "Done" : "To Do";
    }
  }

  searchTodos(query: string): Array<ToDo> {
    return this.list.filter(todo =>
      todo.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

const todoList = new ToDoList();
