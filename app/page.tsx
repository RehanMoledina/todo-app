'use client';
import TodoList from '@/components/TodoList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0ea5e9] via-[#a78bfa] to-[#f472b6] py-12 px-4">
      <div className="max-w-2xl mx-auto font-sans">
        <h1 className="text-5xl font-extrabold text-white text-center mb-8 tracking-tight drop-shadow-md">
          To Do List ✨
        </h1>

        <div className="rounded-2xl p-6 backdrop-blur-xl bg-white/20 border border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <TodoList />
        </div>
      </div>
    </div>
  );
}