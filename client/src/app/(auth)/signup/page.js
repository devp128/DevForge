'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '../../lib/axios'

export default function SignUp() {
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/auth/signup', form)
      localStorage.setItem('token', response.data.token)
      router.push('/dashboard')
    } catch (error) {
      alert('Sign up failed')
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
  Create Account
</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          required
        />
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
          className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account? <Link href="/signin" className="text-blue-600">Sign In</Link>
      </p>
    </div>
  )
}