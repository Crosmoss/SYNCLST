import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { CardDescription } from "@/components/ui/card"
import Anthropic from '@anthropic-ai/sdk'


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

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

    // ================ API call ======================== 

        const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          ...images.map((base64: string) => ({
            type: 'image' as const,
            source: {
              type: 'base64' as const,
              media_type: 'image/jpeg' as const,
              data: base64
            }
          })),
          {
            type: 'text',
            text: `You are an expert reseller with deep knowledge of eBay, Depop, and Mercari best practices.

Analyze this product image carefully and generate an optimized marketplace listing.

Guidelines:
- Title: Include brand, item type, condition, and key attributes. Under 80 characters. Use keywords buyers actually search for.
- Description: 2-3 sentences. Mention condition, any visible flaws, dimensions if estimable, and why someone would want this item.
- Price: Suggest a competitive resale price in USD based on the item's apparent condition and type.
- Category: Be specific (e.g. "Vintage Plush Toys" not just "Toys").
- Condition: Choose exactly one of: New, Like New, Good, Fair, Poor — based on what you can see.
- Tags: 4-6 keywords buyers would search for.

Return ONLY a raw JSON object. No markdown, no code blocks, no explanation:
{
  "title": "...",
  "description": "...",
  "price": 25,
  "category": "...",
  "condition": "...",
  "tags": ["...", "..."]
}`
          }
        ]
      }
    ]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  
  let listing
  try {
    listing = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
  }

  return NextResponse.json({ listing })
}