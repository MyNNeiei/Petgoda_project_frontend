"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axiosInstance from "@/utils/axios"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar/headernav"
import { toast } from "@/hooks/use-toast"
import { Loader2, Save, Building, BedDouble, Coffee } from "lucide-react"
import RoomsTab from "@/components/hotel-edit/rooms-tab"
import Link from "next/link"

export default function EditHotelRoomsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)
  const [roomImages, setRoomImages] = useState({})
  const [roomImagePreviews, setRoomImagePreviews] = useState({})

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        if (!id) return

        const response = await axiosInstance.get(`/api/hotels/${id}`)
        setHotel(response.data.hotel)

        // Initialize room images from response
        if (response.data.rooms) {
          const initialRoomImagePreviews = {}
          response.data.rooms.forEach((room) => {
            if (room.images && room.images.length > 0) {
              initialRoomImagePreviews[room.id] = room.images.map((img) => ({
                id: img.id,
                url: img.image,
                description: img.description,
              }))
            }
          })
          setRoomImagePreviews(initialRoomImagePreviews)
        }
      } catch (err) {
        console.error("Error fetching hotel details:", err)
        setError("Failed to load hotel details.")
        toast({
          title: "Error",
          description: "Failed to load hotel details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchHotel()
  }, [id])

  const handleUpdateRooms = async () => {
    setUpdating(true)

    try {
      const formData = new FormData()

      // Add rooms data
      if (hotel.rooms) {
        formData.append("rooms", JSON.stringify(hotel.rooms))
      }

      // Add room images
      for (const roomId in roomImages) {
        if (roomImages[roomId] && roomImages[roomId].length > 0) {
          roomImages[roomId].forEach((image, index) => {
            formData.append(`room_${roomId}_images_${index}`, image.file)
            formData.append(`room_${roomId}_image_descriptions_${index}`, image.description || "")
          })
        }
      }

      await axiosInstance.put(`/api/hotels/${id}/rooms`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast({
        title: "Success",
        description: "Hotel rooms updated successfully!",
      })
    } catch (err) {
      console.error("Error updating rooms:", err)
      toast({
        title: "Error",
        description: "Failed to update hotel rooms.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleAddRoom = () => {
    const newRoom = {
      roomname: "",
      price_per_night: 0,
      size: 0,
      max_pets: 1,
      current_pets_count_int: 0,
      rating_decimal: 0,
      total_review: 0,
      availability_status: "available",
      room_type: "standard",
      allow_pet_size: "small",
      allow_pet_type: "dog",
      // Generate a temporary ID for new rooms
      tempId: `temp_${Date.now()}`,
    }

    setHotel({
      ...hotel,
      rooms: [...(hotel?.rooms || []), newRoom],
    })

    // Initialize empty image array for this room
    setRoomImages({
      ...roomImages,
      [newRoom.tempId]: [],
    })

    setRoomImagePreviews({
      ...roomImagePreviews,
      [newRoom.tempId]: [],
    })
  }

  const handleRemoveRoom = (index) => {
    const updatedRooms = [...hotel.rooms]
    const roomToRemove = updatedRooms[index]
    updatedRooms.splice(index, 1)
    setHotel({ ...hotel, rooms: updatedRooms })

    // Remove images for this room
    const roomId = roomToRemove.id || roomToRemove.tempId
    if (roomId) {
      const updatedRoomImages = { ...roomImages }
      const updatedRoomImagePreviews = { ...roomImagePreviews }
      delete updatedRoomImages[roomId]
      delete updatedRoomImagePreviews[roomId]
      setRoomImages(updatedRoomImages)
      setRoomImagePreviews(updatedRoomImagePreviews)
    }
  }

  const handleRoomImageChange = (e, roomId) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Create new image objects with file and preview URL
    const newImages = files.map((file) => ({
      file,
      description: "",
    }))

    // Update room images state
    setRoomImages({
      ...roomImages,
      [roomId]: [...(roomImages[roomId] || []), ...newImages],
    })

    // Generate previews for each image
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setRoomImagePreviews((prev) => ({
          ...prev,
          [roomId]: [
            ...(prev[roomId] || []),
            {
              url: reader.result,
              description: "",
            },
          ],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveRoomImage = (roomId, imageIndex, isExisting = false) => {
    if (isExisting) {
      // For existing images, we'll need to track which ones to delete on the server
      const updatedPreviews = [...roomImagePreviews[roomId]]
      updatedPreviews.splice(imageIndex, 1)

      setRoomImagePreviews({
        ...roomImagePreviews,
        [roomId]: updatedPreviews,
      })

      // Add image ID to a list of images to delete (you'd need to implement this)
      // setImagesToDelete([...imagesToDelete, roomImagePreviews[roomId][imageIndex].id]);
    } else {
      // For new images, just remove from the state
      const updatedImages = [...(roomImages[roomId] || [])]
      updatedImages.splice(imageIndex, 1)

      const updatedPreviews = [...(roomImagePreviews[roomId] || [])]
      updatedPreviews.splice(imageIndex, 1)

      setRoomImages({
        ...roomImages,
        [roomId]: updatedImages,
      })

      setRoomImagePreviews({
        ...roomImagePreviews,
        [roomId]: updatedPreviews,
      })
    }
  }

  const handleRoomImageDescriptionChange = (roomId, imageIndex, description, isExisting = false) => {
    if (isExisting) {
      const updatedPreviews = [...roomImagePreviews[roomId]]
      updatedPreviews[imageIndex] = {
        ...updatedPreviews[imageIndex],
        description,
      }

      setRoomImagePreviews({
        ...roomImagePreviews,
        [roomId]: updatedPreviews,
      })
    } else {
      const updatedImages = [...(roomImages[roomId] || [])]
      updatedImages[imageIndex] = {
        ...updatedImages[imageIndex],
        description,
      }

      setRoomImages({
        ...roomImages,
        [roomId]: updatedImages,
      })

      // Also update the preview description
      const updatedPreviews = [...(roomImagePreviews[roomId] || [])]
      updatedPreviews[imageIndex] = {
        ...updatedPreviews[imageIndex],
        description,
      }

      setRoomImagePreviews({
        ...roomImagePreviews,
        [roomId]: updatedPreviews,
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading hotel details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p className="text-center">{error}</p>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => router.push("/mainHotel/manage/")}>Return to Hotel Management</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Hotel Rooms</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <Link href={`/mainHotel/manage/edit/${id}`}>
                <Building className="h-4 w-4" />
                Edit Hotel Info
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <Link href={`/mainHotel/manage/edit/${id}/facilities`}>
                <Coffee className="h-4 w-4" />
                Edit Facilities
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg mb-6 flex items-center">
          <BedDouble className="h-5 w-5 mr-2 text-primary" />
          <span>
            You are editing the rooms for <strong>{hotel?.name}</strong>
          </span>
        </div>

        <RoomsTab
          hotel={hotel}
          setHotel={setHotel}
          handleAddRoom={handleAddRoom}
          handleRemoveRoom={handleRemoveRoom}
          roomImagePreviews={roomImagePreviews}
          handleRoomImageChange={handleRoomImageChange}
          handleRemoveRoomImage={handleRemoveRoomImage}
          handleRoomImageDescriptionChange={handleRoomImageDescriptionChange}
        />

        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button variant="outline" onClick={() => router.push("/mainHotel/manage/")}>
            Back to Hotels
          </Button>

          <Button onClick={handleUpdateRooms} disabled={updating} className="flex items-center gap-2">
            {updating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Rooms...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Rooms
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

