'use client';

import { useState } from 'react';

// Define what a Todo item looks like
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all'); // MOVED HERE

  // Add a new todo
  const addTodo = () => {
    if (inputText.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now(),
      text: inputText,
      completed: false,
    };
    
    setTodos([...todos, newTodo]);
    setInputText('');
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

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-700"
        />
        <button
          onClick={addTodo}
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors"
        >
          Add
        </button>
      </div>
      
      {/* Filter Tabs */}
      {todos.length > 0 && (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active ({todos.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed ({todos.filter(t => t.completed).length})
          </button>
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No tasks yet. Add one above!
          </p>
        ) : (
          getFilteredTodos().map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 text-purple-600 rounded cursor-pointer"
              />
              
              {/* Todo Text */}
              <span
                className={`flex-1 text-lg ${
                  todo.completed
                    ? 'line-through text-gray-400'
                    : 'text-gray-700'
                }`}
              >
                {todo.text}
              </span>
              
              {/* Delete Button */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Task Counter */}
      {todos.length > 0 && (
        <div className="text-center text-gray-600 pt-4 border-t">
          {todos.filter(todo => !todo.completed).length} tasks remaining
        </div>
      )}
    </div>
  );
}