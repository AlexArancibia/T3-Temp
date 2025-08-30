"use client";
import React, { useState } from 'react';
import LoginModal from '@/frontend/components/LoginModal';

export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <button
        className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg text-2xl font-bold hover:bg-blue-700 transition"
        onClick={() => setOpen(true)}
      >
        Login
      </button>
      <LoginModal open={open} onOpenChange={setOpen} />
    </main>
  );
}
