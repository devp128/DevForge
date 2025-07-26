'use client'

import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <nav className="bg-[#151624] border-border p-4 px-8 flex items-center justify-between shadow-lg rounded-b-xl sticky top-0 z-50">
      <div className="font-bold text-lg text-accent">DevForge</div>
      <button
        onClick={handleLogout}
        className="bg-red-500 opacity-60% hover:bg-red-700 hover:opacity-100% text-white px-4 py-2 rounded shadow text-sm font-semibold transition"
      >
        Logout
      </button>
    </nav>
  );
}
