import { currentUser } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function ListingsPage() {
  const user = await currentUser()

  if (!user) {
    notFound()
  }

//fetching all teh lsitings from the user
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-zinc-900">Your Listings</h1>
          <p className="text-sm text-zinc-400 mt-1">{listings?.length ?? 0} listings total</p>
        </div>
        <Link
          href="/dashboard/upload"
          className="bg-violet-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-violet-700 transition"        >
          + New listing
        </Link>
      </div>

      {listings && listings.length > 0 ? (
        <div className="flex flex-col gap-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/dashboard/listings/${listing.id}`}
              className="bg-white border rounded-xl p-5 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex flex-col gap-1">
                <p className=" text-zinc-900">{listing.title}</p>
                <div className="flex gap-3 text-sm text-zinc-400">
                  <span>{listing.category}</span>
                  <span>•</span>
                  <span>{listing.condition}</span>
                  <span>•</span>
                  <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {listing.status}
                </span>
                <span className="text-lg font-bold text-violet-600">${listing.price}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 border text-center">
          <p className="text-4xl mb-4">📦</p>
          <p className="font-semibold text-gray-700">No listings yet</p>
          <p className="text-sm text-gray-400 mt-1">Upload photos to generate your first listing</p>
          <Link
            href="/dashboard/upload"
            className="mt-4 inline-block bg-violet-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-violet-700 transition"
          >
            Upload your first item
          </Link>
        </div>
      )}
    </div>
  )
}