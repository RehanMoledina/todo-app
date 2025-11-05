'use client';

import { useState, useEffect } from 'react';

// Define what a Todo item looks like
type Todo = {
  id: number;
  text: string;
  completed: boolean;
  dueAt?: string; // ISO string
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [archivedTodos, setArchivedTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [inputDueDate, setInputDueDate] = useState(''); // yyyy-mm-dd
  const [inputDueTime, setInputDueTime] = useState(''); // HH:mm
  const clearCompleted = () => {
    const completed = todos.filter(todo => todo.completed);
    if (completed.length === 0) return;
    setArchivedTodos([...archivedTodos, ...completed]);
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Load todos from localStorage when component mounts
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedArchived = localStorage.getItem('archivedTodos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    if (savedArchived) {
      setArchivedTodos(JSON.parse(savedArchived));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('archivedTodos', JSON.stringify(archivedTodos));
  }, [archivedTodos]);

  // Add a new todo
  const addTodo = () => {
    const trimmedText = inputText.trim();
    
    if (trimmedText === '') {
      alert('Please enter a task!');
      return;
    }
    
    if (trimmedText.length > 100) {
      alert('Task is too long! Keep it under 100 characters.');
      return;
    }
    // Build due date/time if provided
    let dueAt: string | undefined;
    if (inputDueDate) {
      const time = inputDueTime || '23:59';
      const candidate = new Date(`${inputDueDate}T${time}:00`);
      if (!isNaN(candidate.getTime())) {
        dueAt = candidate.toISOString();
      }
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: trimmedText,
      completed: false,
      dueAt,
    };
    
    setTodos([...todos, newTodo]);
    setInputText('');
    setInputDueDate('');
    setInputDueTime('');
  };

  // Delete a todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Toggle completion status
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Archived actions
  const restoreArchived = (id: number) => {
    const item = archivedTodos.find(t => t.id === id);
    if (!item) return;
    setArchivedTodos(archivedTodos.filter(t => t.id !== id));
    setTodos([...todos, { ...item, completed: false }]);
  };

  const deleteArchived = (id: number) => {
    setArchivedTodos(archivedTodos.filter(t => t.id !== id));
  };
  
  // Begin editing a todo
  const startEdit = (id: number, currentText: string) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // Save edited text
  const saveEdit = () => {
    if (editingId === null) return;
    const trimmed = editingText.trim();
    if (trimmed === '') {
      alert('Please enter a task!');
      return;
    }
    if (trimmed.length > 100) {
      alert('Task is too long! Keep it under 100 characters.');
      return;
    }
    setTodos(todos.map(t => (t.id === editingId ? { ...t, text: trimmed } : t)));
    setEditingId(null);
    setEditingText('');
  };
  
  // Filter todos based on selected filter
  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const formatDue = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4 font-sans text-black">
      {/* Input Section */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done? ✍️"
          className="flex-1 px-4 py-3 rounded-xl border border-white/40 bg-white/30 text-black placeholder-black/50 focus:outline-none focus:ring-4 focus:ring-white/30"
        />
        <input
          type="date"
          value={inputDueDate}
          onChange={(e) => setInputDueDate(e.target.value)}
          className="px-3 py-3 rounded-xl border border-white/40 bg-white/30 text-black focus:outline-none focus:ring-4 focus:ring-white/30"
        />
        <input
          type="time"
          value={inputDueTime}
          onChange={(e) => setInputDueTime(e.target.value)}
          className="px-3 py-3 rounded-xl border border-white/40 bg-white/30 text-black focus:outline-none focus:ring-4 focus:ring-white/30"
        />
        <button
          onClick={addTodo}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black font-semibold shadow-[0_8px_20px_rgba(217,70,239,0.35)] hover:from-cyan-300 hover:to-fuchsia-400 transition-colors"
        >
          Add
        </button>
      </div>
      
      {/* Filter Tabs */}
      {todos.length > 0 && (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full font-medium transition ${
              filter === 'all'
                ? 'bg-white/30 text-black shadow border border-white/40'
                : 'bg-white/20 text-black/70 hover:bg-white/25 border border-white/30'
            }`}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-full font-medium transition ${
              filter === 'active'
                ? 'bg-white/30 text-black shadow border border-white/40'
                : 'bg-white/20 text-black/70 hover:bg-white/25 border border-white/30'
            }`}
          >
            Active ({todos.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-full font-medium transition ${
              filter === 'completed'
                ? 'bg-white/30 text-black shadow border border-white/40'
                : 'bg-white/20 text-black/70 hover:bg-white/25 border border-white/30'
            }`}
          >
            Completed ({todos.filter(t => t.completed).length})
          </button>
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-center text-black/50 py-8">
            No tasks yet. Add one above!
          </p>
        ) : (
          getFilteredTodos().map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-4 rounded-2xl border border-white/30 bg-white/15 hover:bg-white/25 transition-colors backdrop-blur-xl"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 rounded cursor-pointer accent-fuchsia-500"
              />

              {/* Todo Text or Edit Field */}
              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-white/40 bg-white/30 text-black focus:outline-none focus:ring-4 focus:ring-white/30"
                  autoFocus
                />
              ) : (
                <div className="flex-1">
                  <div
                    className={`text-lg ${
                      todo.completed
                        ? 'line-through text-black/40'
                        : 'text-black'
                    }`}
                  >
                    {todo.text}
                  </div>
                  {todo.dueAt && (
                    <div className={`text-sm ${
                      !todo.completed && new Date(todo.dueAt).getTime() < Date.now()
                        ? 'text-pink-600'
                        : 'text-black/50'
                    }`}>
                      Due: {formatDue(todo.dueAt)}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {editingId === todo.id ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black font-semibold shadow hover:from-cyan-300 hover:to-fuchsia-400 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 rounded-xl bg-white/20 text-black hover:bg-white/30 transition-colors border border-white/30"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(todo.id, todo.text)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black font-semibold shadow hover:from-cyan-300 hover:to-fuchsia-400 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-4 py-2 rounded-xl bg-red-500/90 text-black hover:bg-red-500 transition-colors border border-white/30"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Task Counter */}
      {todos.length > 0 && (
        <div className="text-center text-black/60 pt-4 border-t border-white/30">
          {todos.filter(todo => !todo.completed).length} tasks remaining
        </div>
      )}
      {todos.some(todo => todo.completed) && (
        <button 
          onClick={clearCompleted}
          className="w-full mt-2 px-4 py-2 rounded-xl bg-white/20 text-black hover:bg-white/30 transition-colors border border-white/30"
        >
          Clear Completed
        </button>
      )}
      {archivedTodos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-black mb-3 tracking-tight">Completed Items ✅</h2>
          <div className="space-y-2">
            {archivedTodos.map(todo => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-4 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl"
              >
                <div className="flex-1">
                  <div className="text-black">{todo.text}</div>
                  {todo.dueAt && (
                    <div className="text-sm text-black/50">Due: {formatDue(todo.dueAt)}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => restoreArchived(todo.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black font-semibold shadow hover:from-cyan-300 hover:to-fuchsia-400 transition-colors"
                  >
                    Re-add
                  </button>
                  <button
                    onClick={() => deleteArchived(todo.id)}
                    className="px-4 py-2 rounded-xl bg-red-500/90 text-black hover:bg-red-500 transition-colors border border-white/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}