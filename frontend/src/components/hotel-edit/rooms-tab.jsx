"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import axiosInstance from "@/utils/axios"
import RoomItem from "./room-item"

export default function RoomsTab({
  hotel,
  setHotel,
  handleAddRoom,
  handleRemoveRoom,
  roomImagePreviews,
  handleRoomImageChange,
  handleRemoveRoomImage,
  handleRoomImageDescriptionChange,
}) {
  const [creating, setCreating] = useState(false)

  const handleCreateRoom = async () => {
    setCreating(true)

    try {
      // Create a new room object
      const newRoom = {
        hotelId: hotel.id,
        roomname: "New Room",
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
      }

      // Make POST request to create a new room
      const response = await axiosInstance.post(`/api/hotels/${hotel.id}/rooms/create/`, newRoom)

      // Add the newly created room to the hotel state
      const createdRoom = response.data.room
      setHotel({
        ...hotel,
        rooms: [...(hotel?.rooms || []), createdRoom],
      })

      // Initialize empty image array for this room
      const roomId = createdRoom.id

      toast({
        title: "Success",
        description: "Room created successfully!",
      })
    } catch (err) {
      console.error("Error creating room:", err)
      toast({
        title: "Error",
        description: "Failed to create room. Using local state instead.",
        variant: "destructive",
      })

      // Fallback to local state if API call fails
      handleAddRoom()
    } finally {
      setCreating(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Rooms</h2>
          <Button type="button" onClick={handleCreateRoom} disabled={creating}>
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Add Room"
            )}
          </Button>
        </div>

        {hotel?.rooms?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No rooms added yet. Click "Add Room" to create your first room.
          </div>
        )}

        <div className="space-y-8">
          {hotel?.rooms?.map((room, index) => (
            <RoomItem
              key={room.id || room.tempId || index}
              room={room}
              index={index}
              hotel={hotel}
              setHotel={setHotel}
              handleRemoveRoom={handleRemoveRoom}
              roomImagePreviews={roomImagePreviews}
              handleRoomImageChange={handleRoomImageChange}
              handleRemoveRoomImage={handleRemoveRoomImage}
              handleRoomImageDescriptionChange={handleRoomImageDescriptionChange}
            />
          ))}
        </div>

      </CardContent>
    </Card>
  )
}

