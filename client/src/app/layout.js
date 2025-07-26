import './globals.css'


export const metadata = {
  title: 'DevForge',
  description: 'Generate React components with AI and preview them instantly',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#151624] min-h-screen">
        <div className="text-foreground">
          {children}
        </div>
      </body>
    </html>
  )
}