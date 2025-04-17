import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, CheckCircle, Circle, ListTodo, X } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type FilterType = 'all' | 'active' | 'completed';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([
        {
          id: crypto.randomUUID(),
          text: newTodo.trim(),
          completed: false,
          createdAt: Date.now(),
        },
        ...todos,
      ]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = async (id: string) => {
    setRemovingId(id);
    await new Promise(resolve => setTimeout(resolve, 200)); // 等待动画完成
    setTodos(todos.filter((todo) => todo.id !== id));
    setRemovingId(null);
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    active: todos.filter((todo) => !todo.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-200 hover:shadow-2xl">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ListTodo className="w-6 h-6 text-indigo-100" />
                <h1 className="text-2xl font-bold text-white">Modern Todo List</h1>
              </div>
              {stats.completed > 0 && (
                <button
                  onClick={clearCompleted}
                  className="text-indigo-200 hover:text-white text-sm flex items-center gap-1 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  Clear completed
                </button>
              )}
            </div>
          </div>

          {/* Add Todo Form */}
          <form onSubmit={addTodo} className="p-6 border-b">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                aria-label="New todo input"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-2 transition-all duration-200"
                aria-label="Add todo"
              >
                <PlusCircle className="w-5 h-5" />
                Add
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex justify-center gap-4 p-4 bg-gray-50 border-b">
            {(['all', 'active', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filter === filterType
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                aria-label={`Show ${filterType} todos`}
                aria-pressed={filter === filterType}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          {/* Todo List */}
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {filteredTodos.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No {filter !== 'all' ? filter : ''} tasks found
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-all duration-200 todo-item ${
                    removingId === todo.id ? 'removing' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                    aria-label={`${todo.completed ? 'Mark as incomplete' : 'Mark as complete'}`}
                  >
                    {todo.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  <span
                    className={`flex-1 ${
                      todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                    aria-label="Delete todo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Stats */}
          <div className="bg-gray-50 px-6 py-4 text-sm text-gray-600 border-t">
            <div className="flex justify-between">
              <span>Total: {stats.total}</span>
              <span>Active: {stats.active}</span>
              <span>Completed: {stats.completed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;