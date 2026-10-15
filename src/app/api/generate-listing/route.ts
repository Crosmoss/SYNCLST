import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

// Fail loudly at startup if the key is missing
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set in .env.local")
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Limits protect your bill and match Anthropic's API limits
const MAX_IMAGES = 5
const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB per image

type MediaType = "image/jpeg" | "image/png" | "image/webp" | "image/gif"

// Detect the real image type from the first characters of the base64 data
function detectMediaType(base64: string): MediaType | null {
  if (base64.startsWith("/9j/")) return "image/jpeg"
  if (base64.startsWith("iVBORw0KGgo")) return "image/png"
  if (base64.startsWith("UklGR")) return "image/webp"
  if (base64.startsWith("R0lGOD")) return "image/gif"
  return null
}

const PROMPT = `You are an expert reseller with deep knowledge of eBay, Depop, and Mercari best practices.

Analyze this product image carefully and generate an optimized marketplace listing.

Guidelines:
- Title: Include brand, item type, condition, and key attributes. Under 80 characters. Use keywords buyers actually search for.
- Description: 2-3 sentences. Mention condition, any visible flaws, dimensions if estimable, and why someone would want this item.
- Price: Suggest a competitive resale price in USD based on the item's apparent condition and type.
- Category: Be specific (e.g. "Vintage Plush Toys" not just "Toys").
- Condition: Choose exactly one of: New, Like New, Good, Fair, Poor, based on what you can see.
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

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Validate input
    const body = await req.json().catch(() => null)
    const images = body?.images

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 })
    }
    if (images.length > MAX_IMAGES) {
      return NextResponse.json({ error: `Maximum ${MAX_IMAGES} images allowed` }, { status: 400 })
    }

    const imageBlocks = []
    for (const img of images) {
      if (typeof img !== "string") {
        return NextResponse.json({ error: "Invalid image data" }, { status: 400 })
      }
      const sizeInBytes = (img.length * 3) / 4
      if (sizeInBytes > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: "Each image must be under 5 MB" }, { status: 400 })
      }
      const mediaType = detectMediaType(img)
      if (!mediaType) {
        return NextResponse.json({ error: "Only JPEG, PNG, WebP, or GIF images are allowed" }, { status: 400 })
      }
      imageBlocks.push({
        type: "image" as const,
        source: { type: "base64" as const, media_type: mediaType, data: img },
      })
    }

    // 3. Call the AI
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        { role: "user", content: [...imageBlocks, { type: "text", text: PROMPT }] },
      ],
    })

    // 4. Parse the response (strip ```json fences in case the model adds them)
    const text = response.content[0]?.type === "text" ? response.content[0].text : ""
    const cleaned = text.replace(/```json|```/g, "").trim()

    let listing
    try {
      listing = JSON.parse(cleaned)
    } catch {
      console.error("[generate-listing] Could not parse AI response")
      return NextResponse.json({ error: "Failed to generate listing, please try again" }, { status: 502 })
    }

    return NextResponse.json({ listing })
  } catch (error) {
    // Log details on the server only, never the images or keys
    if (error instanceof Anthropic.APIError) {
      console.error(`[generate-listing] Anthropic API error ${error.status}: ${error.message}`)
    } else {
      console.error("[generate-listing] Unexpected error:", error)
    }
    // Send only a generic message to the browser
    return NextResponse.json({ error: "Something went wrong, please try again" }, { status: 500 })
  }
}