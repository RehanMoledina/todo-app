'use client';
import TodoList from '@/components/TodoList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-white text-center mb-8">
          My To-Do List
        </h1>
        
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <TodoList />
        </div>
      </div>
    </div>
  );
}