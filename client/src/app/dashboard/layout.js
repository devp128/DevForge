import Navbar from '../components/Navbar'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#151624]">
      <Navbar />
      {children}
    </div>
  )
}
