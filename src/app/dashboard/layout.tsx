"use client"

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#f7f7f5]">

      {/* Sidebar */}
      <div className="w-52 bg-[#18181b] flex flex-col py-5 fixed h-full">

        {/* Logo */}
        <div className="px-5 pb-6 text-base font-medium text-white tracking-tight">
          SYNC<span className="text-amber-400">LST</span>
        </div>

        {/* Nav */}
        <div className="px-3 flex flex-col gap-1">
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest px-2 mb-1">Menu</p>
          <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${pathname === '/dashboard' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
            Dashboard
          </Link>
          <Link href="/dashboard/listings" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${pathname.startsWith('/dashboard/listings') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
            Listings
          </Link>
          <Link href="/dashboard/upload" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${pathname === '/dashboard/upload' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
            Upload
          </Link>
        </div>

        {/* Channels section */}
        <div className="px-3 flex flex-col gap-1 mt-6">
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest px-2 mb-1">Channels</p>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-600 cursor-not-allowed">
            eBay <span className="ml-auto text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">Soon</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-600 cursor-not-allowed">
            Etsy <span className="ml-auto text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">Soon</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-auto px-5">
          <UserButton />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-52 p-7">
        {children}
      </div>

    </div>
  )
}