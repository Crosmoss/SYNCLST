import { currentUser } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  const user = await currentUser()

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

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Listings</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Sold</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
      </div>
    </div>
  )
}