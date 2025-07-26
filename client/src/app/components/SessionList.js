import { useEffect, useState } from 'react'
import { api } from '../lib/axios'

export default function SessionList({ currentSession, setCurrentSession }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('token')
        const res = await api.get('/sessions', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSessions(res.data)
      } catch (err) {
        setError('Failed to load sessions')
      }
      setLoading(false)
    }
    fetchSessions()
  }, [])

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-4 flex-shrink-0 border-b border-gray-700">
        <h3 className="font-semibold text-accent">History</h3>
        <button
          className="bg-purple-600 opacity-60 hover:opacity-100 hover:bg-purple-700 text-white px-3 py-1 rounded-lg shadow transition-all duration-200 text-sm"
          onClick={async () => {
            const token = localStorage.getItem('token')
            try {
              const res = await api.post('/sessions', {}, {
                headers: { Authorization: `Bearer ${token}` }
              })
              setSessions(s => [{ _id: res.data.sessionId, title: res.data.title }, ...s])
              setCurrentSession({ id: res.data.sessionId, title: res.data.title })
            } catch {
              alert('Failed to start new chat')
            }
          }}
          title="Start a new conversation"
        >
          + New Chat
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide p-4">
          {loading ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : error ? (
            <div className="text-red-400 text-sm">{error}</div>
          ) : sessions.length === 0 ? (
            <div className="text-gray-400 text-sm">No sessions yet.</div>
          ) : (
            <ul className="space-y-2">
              {sessions.map(session => {
                const isActive = currentSession && currentSession.id === session._id
                
                return (
                  <li
                    key={session._id}
                    className={`cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md border border-purple-500' // Active state
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white hover:shadow-sm' // Hover state
                    }`}
                    onClick={() => setCurrentSession({ id: session._id, title: session.title })}
                    title={session.title}
                  >
                    <div className="flex items-center space-x-2">
                      {/* Active indicator dot */}
                      <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        isActive ? 'bg-white' : 'bg-transparent'
                      }`} />
                      <span className="truncate block flex-1">
                        {session.title || 'Untitled Session'}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-styled {
          scrollbar-width: thin;
          scrollbar-color: #374151 #1f2937;
        }
        .scrollbar-styled::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-styled::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .scrollbar-styled::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        .scrollbar-styled::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  )
}
