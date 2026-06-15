"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function UploadPage() {
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

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

    // Clearing all the pictures for resetting
    function handleClear()
    {
        setImages([])
        setPreviews([])
    }

    return ( <div className="flex flex-col gap-6 max-w-3xl">
        
        <h1 className="text-2xl font-bold"> Upload Photos </h1>

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
      className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 text-lg font-bold rounded-xl"

      // When clicked, the state is set tp true/loading
      onClick={() => setLoading(true)}
      >

          {loading ? "Generating listing..." : "✨ Generate listing with AI"}

      </Button>


    </div>
    )
}