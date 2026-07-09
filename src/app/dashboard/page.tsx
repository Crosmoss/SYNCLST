import { currentUser } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await currentUser()

  //fetching the api 
  const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

//selecting all the listings from the database that belongs to the user and ordering them by created_at in descending order
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })


return (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-xl font-medium text-zinc-900">
        Good morning, {user?.firstName ?? 'there'}
      </h1>
      <p className="text-sm text-zinc-400 mt-1">
        Here's what's happening today.
      </p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white rounded-xl p-5 border border-zinc-200">
        <p className="text-xs text-zinc-400 mb-2">Total listings</p>
        <p className="text-2xl font-medium text-zinc-900">{listings?.length ?? 0}</p>
      </div>
      <div className="bg-white rounded-xl p-5 border border-zinc-200">
        <p className="text-xs text-zinc-400 mb-2">Active</p>
        <p className="text-2xl font-medium text-zinc-900">
          {listings?.filter(l => l.status === 'active').length ?? 0}
        </p>
      </div>
      <div className="bg-white rounded-xl p-5 border border-zinc-200">
        <p className="text-xs text-zinc-400 mb-2">Sold</p>
        <p className="text-2xl font-medium text-zinc-900">
          {listings?.filter(l => l.status === 'sold').length ?? 0}
        </p>
      </div>
    </div>

    {/* Listings */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-zinc-900">Your listings</h2>
        {listings && listings.length > 0 && (
          <Link
            href="/dashboard/upload"
            className="bg-amber-400 text-zinc-900 px-4 py-2 rounded-lg text-xs font-medium hover:bg-amber-500 transition"
          >
            + New listing
          </Link>
        )}
      </div>

      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {listings.map((listing) => (
            <Link
              href={`/dashboard/listings/${listing.id}`}
              key={listing.id}
              className="bg-white rounded-xl p-4 border border-zinc-200 flex flex-col gap-2 hover:border-zinc-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  listing.status === 'active' ? 'bg-amber-50 text-amber-700' :
                  listing.status === 'sold' ? 'bg-green-50 text-green-700' :
                  'bg-zinc-100 text-zinc-500'
                }`}>
                  {listing.status}
                </span>
                <span className="text-sm font-medium text-zinc-900">${listing.price}</span>
              </div>
              <p className="text-sm font-medium text-zinc-900 line-clamp-2">{listing.title}</p>
              <p className="text-xs text-zinc-400">{listing.category}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 border border-zinc-200 text-center">
          <p className="text-3xl mb-3">📦</p>
          <p className="text-sm font-medium text-zinc-700">No listings yet</p>
          <Link
            href="/dashboard/upload"
            className="mt-4 inline-block bg-amber-400 text-zinc-900 px-5 py-2 rounded-lg text-sm font-medium hover:bg-amber-500 transition"
          >
            Upload your first item
          </Link>
        </div>
      )}
    </div>
  </div>
)
}