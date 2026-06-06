import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col p-6 gap-6">
        <div className="text-xl font-bold">Listify</div>
        <nav className="flex flex-col gap-2">
          <Link 
            href="/dashboard" 
            className="px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Dashboard
          </Link>
          <Link 
            href="/dashboard/upload" 
            className="px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Upload
          </Link>
        </nav>
        <div className="mt-auto">
          <UserButton />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 bg-gray-50">
        {children}
      </div>
    </div>
  )
}