'use client'
import { useEffect, useState } from 'react'

export default function Preview({ code }) {
  const [htmlContent, setHtmlContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (code?.jsx && code?.css) {
      try {
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      margin: 20px; 
      font-family: system-ui, -apple-system, sans-serif;
      overflow-x: auto;
      overflow-y: auto;
    }
    * {
      box-sizing: border-box;
    }
    ${code.css}
  </style>
</head>
<body>
  ${code.jsx.replace(/className=/g, 'class=')}
</body>
</html>`;
        setHtmlContent(html);
        setError(null);
      } catch (err) {
        console.error('HTML generation error:', err);
        setError('Failed to generate preview');
      }
    } else {
      setHtmlContent('');
    }
  }, [code]);

  return (
    <div className="h-full flex flex-col bg-panel rounded-xl shadow-lg m-2 mt-1 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-[#20223a] rounded-t-xl flex-shrink-0">
        <h3 className="font-semibold text-white">Preview</h3>
      </div>
      
      <div className="flex-1 bg-white rounded-b-xl overflow-hidden">
        {error ? (
          <div className="h-full flex items-center justify-center text-red-500 p-6">
            Error: {error}
          </div>
        ) : htmlContent ? (
          <iframe
            srcDoc={htmlContent}
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-0 rounded-b-xl"
            title="Component Preview"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 p-6">
            Generate a component to see preview
          </div>
        )}
      </div>
    </div>
  );
}
