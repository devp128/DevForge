'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Chat from '../components/Chat'
import Preview from '../components/Preview'
import CodeTabs from '../components/CodeTabs'
import SessionList from '../components/SessionList'

export default function Dashboard() {
  const [currentSession, setCurrentSession] = useState(null)
  const [generatedCode, setGeneratedCode] = useState({ jsx: '', css: '' })
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/signin')
    } else {
      setCheckingAuth(false)
    }
  }, [router])

  //loading screen
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-white">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex gap-6 px-6 py-4 bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 bg-panel border-border shadow-lg rounded-xl flex-shrink-0">
        <SessionList 
          currentSession={currentSession}
          setCurrentSession={setCurrentSession}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-panel rounded-xl shadow-lg overflow-hidden">
        {/* Top Section - Preview & Chat (60% height) */}
        <div className="flex-[3] flex gap-6 p-6 min-h-0">
          {/* Preview */}
          <div className="flex-1 min-h-0">
            <Preview code={generatedCode} />
          </div>

          {/* Chat - Fixed height container */}
          <div className="w-96 border-l border-border bg-panel shadow-lg rounded-xl overflow-hidden">
            <Chat 
              sessionId={currentSession?.id}
              onCodeGenerated={setGeneratedCode}
            />
          </div>
        </div>

        {/* Bottom Section - Code Tabs (40% height) */}
        <div className="flex-[2] border-border bg-panel rounded-b-xl p-4 flex-shrink-0 min-h-0">
          <CodeTabs code={generatedCode} />
        </div>
      </div>
    </div>
  )
}
