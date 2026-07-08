"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Listing = {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  tags: string[]
}

export default function ListingActions({ listing }: { listing: Listing }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(listing.title)
  const [description, setDescription] = useState(listing.description)
  const [price, setPrice] = useState(String(listing.price))
  const [category, setCategory] = useState(listing.category)
  const [condition, setCondition] = useState(listing.condition)
  const [tags, setTags] = useState<string[]>(listing.tags)

  async function handleDelete() {
    const confirmed = confirm('Are you sure you want to delete this listing?')
    if (!confirmed) return

    const response = await fetch('/api/delete-listing', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: listing.id })
    })

    const data = await response.json()

    if (data.error) {
      alert('Error deleting listing: ' + data.error)
      return
    }

    router.push('/dashboard')
  }

  async function handleUpdate() {
    const response = await fetch('/api/update-listing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: listing.id,
        title,
        description,
        price,
        category,
        condition,
        tags
      })
    })

    const data = await response.json()

    if (data.error) {
      alert('Error updating listing: ' + data.error)
      return
    }

    setEditing(false)
    router.refresh()
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-4 border rounded-xl p-6 bg-white">
        <h2 className="text-lg font-bold">Edit Listing</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="border rounded-lg px-3 py-2 text-sm" />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm text-gray-500">Price ($)</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm text-gray-500">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm text-gray-500">Condition</label>
            <input value={condition} onChange={(e) => setCondition(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Tags (comma separated)</label>
          <input
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={handleUpdate} className="bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl flex-1">
            Save changes
          </Button>
          <Button onClick={() => setEditing(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl flex-1">
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      <Button onClick={() => setEditing(true)} className="bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl">
        Edit listing
      </Button>
      <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl">
        Delete listing
      </Button>
    </div>
  )
}