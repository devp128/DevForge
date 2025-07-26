'use client'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeTabs({ code }) {
  const [activeTab, setActiveTab] = useState('jsx')

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text || '')
    alert('Copied to clipboard!')
  }

  const downloadCode = () => {
    const jsxContent = code?.jsx || '// No JSX code generated'
    const cssContent = code?.css || '/* No CSS code generated */'
    
    const zip = `// Component.jsx
${jsxContent}

/* styles.css */
${cssContent}`
    
    const blob = new Blob([zip], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'component-code.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Get the current code content
  const getCurrentCode = () => {
    if (!code) return `// No ${activeTab.toUpperCase()} code generated yet`
    
    const content = activeTab === 'jsx' ? code.jsx : code.css
    return content || `// No ${activeTab.toUpperCase()} code generated yet`
  }

  return (
    <div className="h-full flex flex-col w-full">
      {/* Header with tabs and buttons */}
      <div className="flex items-center justify-between p-4 border-b bg-[#20223a] rounded-t-xl flex-shrink-0">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('jsx')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'jsx' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            JSX {code?.jsx && <span className="ml-1 text-xs opacity-75">✓</span>}
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'css' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            CSS {code?.css && <span className="ml-1 text-xs opacity-75">✓</span>}
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => copyToClipboard(getCurrentCode())}
            className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
            disabled={!code}
          >
            Copy
          </button>
          <button
            onClick={downloadCode}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            disabled={!code}
          >
            Download
          </button>
        </div>
      </div>

      {/* Code content area */}
      <div className="flex-1 w-full overflow-hidden">
        <div className="h-full code-scrollbar">
          <SyntaxHighlighter
            language={activeTab === 'jsx' ? 'jsx' : 'css'}
            style={tomorrow}
            customStyle={{
              margin: 0,
              padding: '16px',
              height: '100%',
              width: '100%',
              backgroundColor: '#1a1b26',
              fontSize: '14px',
              lineHeight: '1.5',
              borderRadius: '0 0 12px 12px',
              overflow: 'auto',
            }}
            wrapLines={true}
            wrapLongLines={true}
            showLineNumbers={true}
            lineNumberStyle={{
              color: '#4a5568',
              paddingRight: '16px',
              userSelect: 'none',
              minWidth: '40px'
            }}
          >
            {getCurrentCode()}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Custom scrollbar styles matching code background */}
      <style jsx>{`
        .code-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #2d3748 #1a1b26;
        }
        
        .code-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .code-scrollbar::-webkit-scrollbar-track {
          background: #1a1b26;
          border-radius: 4px;
        }
        
        .code-scrollbar::-webkit-scrollbar-thumb {
          background: #2d3748;
          border-radius: 4px;
        }
        
        .code-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #374151;
        }

        /* Apply to SyntaxHighlighter's internal scrollbar */
        .code-scrollbar :global(pre) {
          scrollbar-width: thin !important;
          scrollbar-color: #2d3748 #1a1b26 !important;
        }
        
        .code-scrollbar :global(pre::-webkit-scrollbar) {
          width: 8px !important;
        }
        
        .code-scrollbar :global(pre::-webkit-scrollbar-track) {
          background: #1a1b26 !important;
          border-radius: 4px !important;
        }
        
        .code-scrollbar :global(pre::-webkit-scrollbar-thumb) {
          background: #2d3748 !important;
          border-radius: 4px !important;
        }
        
        .code-scrollbar :global(pre::-webkit-scrollbar-thumb:hover) {
          background: #374151 !important;
        }
      `}</style>
    </div>
  )
}
