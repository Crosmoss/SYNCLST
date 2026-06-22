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
      <h1 className="text-2xl font-bold">
        Welcome back, {user?.firstName ?? 'there'} 👋
      </h1>
      <p className="text-gray-500 mt-1">
        Here's what's happening with your listings today.
      </p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <p className="text-sm text-gray-500">Total Listings</p>
        <p className="text-3xl font-bold mt-1">{listings?.length ?? 0}</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <p className="text-sm text-gray-500">Active</p>
        <p className="text-3xl font-bold mt-1">
          {listings?.filter(l => l.status === 'active').length ?? 0}
        </p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <p className="text-sm text-gray-500">Sold</p>
        <p className="text-3xl font-bold mt-1">
          {listings?.filter(l => l.status === 'sold').length ?? 0}
        </p>
      </div>
    </div>

    {/* Listings */}
    <div>
      <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold">Your Listings</h2>
      {listings && listings.length > 0 && (
        <Link 
          href="/dashboard/upload"
          className="bg-violet-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-violet-700 transition"
        >
          + New listing
        </Link>
      )}
    </div>

      
      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl p-5 border shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {listing.status}
                </span>
                <span className="text-lg font-bold text-violet-600">${listing.price}</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{listing.title}</p>
              <p className="text-xs text-gray-400">{listing.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 border text-center">
          <p className="text-4xl mb-4">📦</p>
          <p className="font-semibold text-gray-700">No listings yet</p>
          <Link 
            href="/dashboard/upload"
            className="mt-4 inline-block bg-violet-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-violet-700 transition"
          >
            Upload your first item
          </Link>
          
        </div>
      )}
    </div>
  </div>
)
}