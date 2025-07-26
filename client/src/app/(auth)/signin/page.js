'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '../../lib/axios'

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/auth/signin', form)
      localStorage.setItem('token', response.data.token)
      router.push('/dashboard')
    } catch (error) {
      alert('Sign in failed')
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
  Sign In
</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg"
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg"
          value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value})}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <p className="text-center mt-4">
        Don't have an account? <Link href="/signup" className="text-blue-600">Sign Up</Link>
      </p>
    </div>
  )
}
