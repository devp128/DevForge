'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,_#2d1b4a,_#0e0e1a)]">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-6">
        <div className="text-2xl font-bold text-white">
          DevForge
        </div>
        <div className="flex space-x-4">
          <Link 
            href="/signin" 
            className="text-white px-6 py-2 rounded-full border border-gray-400 hover:bg-gray-700 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-800 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-8 leading-tight">
            Generate React Components with
            <br />
            DevForge
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Create stunning AI-generated React components in seconds with our powerful tools
          </p>

          {/* Search Input Box */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search component or prompt..."
              className="w-full px-6 py-4 rounded-lg bg-slate-800/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 backdrop-blur-sm"
              onKeyDown={e => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  router.push('/signin');
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
