'use client'
import { useState, useRef, useEffect } from 'react'
import { api } from '../lib/axios'

export default function Chat({ sessionId, onCodeGenerated }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null) // New ref for container

  // const scrollToBottom = () => {
  //   // Use container scrollTop instead of scrollIntoView
  //   if (messagesContainerRef.current) {
  //     messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
  //   }
  // }

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    }
  }


  // Load session history when sessionId changes
  useEffect(() => {
    async function fetchHistory() {
      if (!sessionId) return setMessages([])
      setHistoryLoading(true)
      try {
        const token = localStorage.getItem('token')
        const res = await api.get(`/chat/history/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMessages(res.data.messages || [])
      } catch {
        setMessages([])
      }
      setHistoryLoading(false)
    }
    fetchHistory()
  }, [sessionId])

  useEffect(() => {
    // Add small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { type: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await api.post('/chat/generate', {
        sessionId,
        prompt: input,
        history: messages
      })

      const aiMessage = { type: 'ai', content: response.data.message }
      setMessages(prev => [...prev, aiMessage])
      onCodeGenerated(response.data.code)
    } catch (error) {
      setMessages(prev => [...prev, { type: 'error', content: 'Failed to generate' }])
    }
    setLoading(false)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="p-4 border-b border-gray-600 bg-[#20223a] rounded-t-xl flex-shrink-0">
        <h3 className="font-semibold text-white">AI Assistant</h3>
      </div>

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div 
          ref={messagesContainerRef}
          className="h-full overflow-y-auto custom-scrollbar p-4 space-y-4 scroll-smooth"
        >
          {historyLoading ? (
            <div className="text-gray-400 text-center py-8">Loading history...</div>
          ) : messages.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              <div className="text-2xl mb-2">👋</div>
              <p>Start a conversation by describing the component you want to create!</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                  msg.type === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-md' 
                    : msg.type === 'ai' 
                    ? 'bg-gray-700 text-gray-100 rounded-bl-md' 
                    : 'bg-red-600 text-white rounded-bl-md'
                }`}>
                  {/* Message Avatar/Icon */}
                  <div className="flex items-start space-x-2">
                    {msg.type === 'ai' && (
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                        AI
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed whitespace-pre-line break-words">
                        {msg.content}
                      </p>
                      {/* Timestamp */}
                      <div className={`text-xs mt-1 opacity-70 ${
                        msg.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 p-3 rounded-2xl rounded-bl-md max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    AI
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Area */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-600 bg-[#20223a] rounded-b-xl flex-shrink-0">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your component..."
            className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </form>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4a5568 #2d3748;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d3748;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5a6578;
        }
      `}</style>
    </div>
  )
}
