"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Rooms</h2>
          <Button type="button" onClick={handleAddRoom}>
            Add Room
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

        {/* Add a Create New Room button at the bottom */}
        <div className="mt-8 flex justify-center">
          <Button type="button" onClick={handleAddRoom} className="px-6" size="lg">
            Create New Room
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

