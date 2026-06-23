import {notFound} from "next/navigation"
import {createClient} from '@supabase/supabase-js'
import { currentUser } from "@clerk/nextjs/server"

// Creating the connection to the database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)


export default async function ListingDetailPage({
  params,
}: {
    // extracting the id from the listing
  params: Promise<{ id: string }>
}) {
  const user = await currentUser()
  const { id } = await params

  //finding all the data that fits the id and user id req, retuning them as a
  // single object instead of an array
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id) //checking the id matching with the user, ensuring safety
    .eq('user_id', user?.id)
    .single()

  if (!listing) {
    notFound()
  }

  return (
  <div className="flex flex-col gap-6 max-w-3xl">
    {listing.images && listing.images.length > 0 && (
      <div className="grid grid-cols-3 gap-4">
        {listing.images.map((img: string, i: number) => (
          <img 
            key={i}
            src={`data:image/jpeg;base64,${img}`}
            alt={`listing image ${i}`}
            className="w-full aspect-square object-cover rounded-xl border"
          />
        ))}
      </div>
    )}

    <h1 className="text-2xl font-bold">{listing.title}</h1>
    <p className="text-gray-500">{listing.description}</p>
    <p className="text-xl font-bold text-violet-600">${listing.price}</p>
  </div>
)
}