import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest)
{
    //getting the confirmation from clerk for user
    const { userId } = await auth() 

    if(!userId)
    {
        return NextResponse.json({error: 'Unautharized'}, {status: 401})
    }

    const {images} = await req.json()
    
    // bad request if there is no image or the image array is empty
    if (!images || images.length === 0) {
    return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    // ================ Till API call, this is the placeholder ======================== will be fixed
    const mockListing = {
    title: "Vintage Plush Toy in Excellent Condition",
    description: "A beautiful vintage plush toy...",
    price: 25,
    category: "Toys & Collectibles",
    condition: "Excellent",
    tags: ["vintage", "plush", "collectible", "toy"]
    }
    // ==================================================================================

    return NextResponse.json({ listing: mockListing })
}