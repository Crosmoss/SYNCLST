"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from '@clerk/nextjs'
import { error } from "console"
import {useRouter} from "next/navigation"


export default function UploadPage() {
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    // The generated results will be stored seperately and will allow user to edit
    const [listing, setListing] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [condition, setCondition] = useState('')
    const [tags, setTags] = useState<string[]>([])
    // the user id is needed to insert the listing to the database, so we get it from clerk authentication

    const router = useRouter()

    // Functions

    // When a file is added, it is converted into an url object and stored
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        // Storing the files in the array, or if it is empty, retunring an empty list
        // When new pictures are added
        const newFiles = Array.from(e.target.files || [])
        
        // When new images are coming, we combine them wiht the prev ones
        const updatedFiles = [...images, ...newFiles]
        setImages(updatedFiles)

        //converting the images to URL objects
        const newUrls = newFiles.map((file) => URL.createObjectURL(file))
        const updatedUrls = [...previews, ...newUrls]
        setPreviews(updatedUrls)
    }

    // the listing is cleared for a new one to be generated, and the previews are cleared as well
    function handleClear()
    {
        setImages([])
        setPreviews([])
        setListing(false)
        setTitle('')
        setDescription('')
        setPrice('')
        setCategory('')
        setCondition('')
        setTags([])
    }

    // Generates the listing for the image, posting the picture
    async function handleGenerate(){

        // if no image, dont generate anything
        if (images.length === 0) return
        setLoading(true)

        //returning only when all the files are done loading
        const base64Images = await Promise.all(
            images.map((image) => {
                //returning the image in base64 after formatting
                return new Promise<string>((resolve) => {
                    const reader = new FileReader()
                    reader.onload = () => {const base64 = (reader.result as string).split(',')[1] 
                    resolve(base64)
                    }

                    reader.readAsDataURL(image)
                })
            })
        )

        // Posting the image to the api 
        const response = await fetch('/api/generate-listing',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({images: base64Images})
            }
        )

        // fetching the response back and inserting
        // the result data into listing, loading is done
        const data = await response.json()
        
        setTitle(data.listing.title)
        setDescription(data.listing.description)
        setPrice(String(data.listing.price))
        setCategory(data.listing.category)
        setCondition(data.listing.condition)
        setTags(data.listing.tags)
        setListing(true)
        setLoading(false)

    }

    async function handleSave() {

        // sending the results to the backend
        const response = await fetch('/api/save-listing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            title,
            description,
            price,
            category,
            condition,
            tags,
            images: await Promise.all(
                images.map((image) => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader()
                    reader.onload = () => {
                    const base64 = (reader.result as string).split(',')[1]
                    resolve(base64)
                    }
                    reader.readAsDataURL(image)
                })
                })
            )
            })

            
        })

        const data = await response.json()
        console.log(data)

        if (data.error) {
            alert('Error saving listing: ' + data.error)
            return
        }

        alert('Listing saved successfully!')

        router.push('/dashboard')
        }


    return ( <div className="flex flex-col gap-6 max-w-3xl">
        
        <h1 className="text-2xl text-zinc-900"> Upload Photos </h1>

        <p className="text-gray-500">
            Upload a photo of your item and AI will generate a listing instantly
        </p>


    {/* Upload Zone */}
    {previews.length == 0 ? (
         <Card className="border-2 border-dashed border-gray-300 hover:border-violet-400 transition p-12 flex flex-col items-center gap-4 cursor-pointer"
        onClick={() => document.getElementById('file-input')?.click()}
        >
        <div className="text-5xl">📸</div>
        <div className="text-center">
          <p className="font-semibold text-gray-700">Click to upload photos</p>
          <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
        </div>

        {/* multiple input is accepted for an image file, files are stored with handelChange function */}
        <input
          id="file-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </Card>
      )
      :
      (
        <div className = "flex items-center gap-4">
        <button
            onClick={() => document.getElementById('file-input')?.click()}
            className="text-sm text-violet-600 hover:underline"
            >
            + Add more photos
            <input 
            id = "file-input"
            type = "file"
            accept = "image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
            />    
        </button>


        {/* When pictures are previeved, giving the option to clear them all */}
        <button onClick={handleClear} className="text-sm text-red-400 hover:underline"> Clear All </button>
        </div>        
    )}


        {/* Image Previevs are shown, stored as an url object and previwed here thorugh map/array */}
        {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {previews.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border">
              <img src={url} alt={`preview ${i}`} className="w-full h-full object-cover" />
            </div>
          ))}

       
        </div>
      )}

     
      
      <Button
    
      //  The button is unavailable at the following conditions: no image inserted, at the loading state
      disabled = {images.length == 0 || loading}
      className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 text-lg rounded-xl"

      // When clicked the function handles the listing details, the state is set to true/loading
      onClick={handleGenerate}
      >

          {loading ? "Generating listing..." : "✨ Generate listing with AI"}

      </Button>

      {listing && (
  <div className="flex flex-col gap-4 border rounded-xl p-6 bg-white">
    <h2 className="text-xl font-bold">Generated Listing</h2>

    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500">Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      />
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="border rounded-lg px-3 py-2 text-sm"
      />
    </div>

    <div className="flex gap-4">
      <div className="flex flex-col gap-1 flex-1">
        <label className="text-sm text-gray-500">Price ($)</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <label className="text-sm text-gray-500">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <label className="text-sm text-gray-500">Condition</label>
        <input
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
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

    <Button 
    onClick={handleSave}
    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 font-bold rounded-xl">
        
      Save listing
      
    </Button>
  </div>
)}


    </div>
    )
}