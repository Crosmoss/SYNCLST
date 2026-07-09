"use client"

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
      <div className="w-64 bg-gray-900 text-white flex flex-col p-6 gap-6 fixed h-full">
        <div className="text-xl font-bold">SYNCLST</div>
        <nav className="flex flex-col gap-2">
          <Link 
            href="/dashboard" 
            className="px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Dashboard
          </Link>
          <Link 
          href="/dashboard/listings" 
          className="px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Listings
        </Link>
          <Link 
            href="/dashboard/upload" 
            className="px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Upload
          </Link>
        </nav>
        <div className="mt-auto flex items-center gap-3">
          <UserButton />
          <span className="text-sm text-gray-400">Account</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 bg-gray-50 ml-64">
        {children}
      </div>
    </div>
  )
}