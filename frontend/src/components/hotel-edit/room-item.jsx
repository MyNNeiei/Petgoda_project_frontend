"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, ImagePlus, X } from "lucide-react"

export default function RoomItem({
  room,
  index,
  hotel,
  setHotel,
  handleRemoveRoom,
  roomImagePreviews,
  handleRoomImageChange,
  handleRemoveRoomImage,
  handleRoomImageDescriptionChange,
}) {
  const roomId = room.id || room.tempId

  return (
    <div className="border p-6 rounded-md relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        onClick={() => handleRemoveRoom(index)}
      >
        <Trash2 className="h-5 w-5" />
        <span className="sr-only">Remove room</span>
      </Button>

      <div className="grid gap-6">
        {/* Room Basic Info */}
        <div>
          <h3 className="text-lg font-medium mb-3 pb-2 border-b">Basic Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Room Name</Label>
              <Input
                value={room.roomname}
                onChange={(e) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].roomname = e.target.value
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Price per Night</Label>
              <Input
                type="number"
                step="0.01"
                value={room.price_per_night}
                onChange={(e) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].price_per_night = Number.parseFloat(e.target.value)
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
                required
              />
            </div>
          </div>
        </div>

        {/* Room Details */}
        <div>
          <h3 className="text-lg font-medium mb-3 pb-2 border-b">Room Details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Room Size (sq.m)</Label>
              <Input
                type="number"
                step="0.01"
                value={room.size}
                onChange={(e) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].size = Number.parseFloat(e.target.value)
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Room Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={room.room_type}
                onChange={(e) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].room_type = e.target.value
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label>Availability Status</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={room.availability_status}
                onChange={(e) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].availability_status = e.target.value
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label>Current Rating</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={room.rating_decimal || 0}
                onChange={(e) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].rating_decimal = Number.parseFloat(e.target.value)
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
              />
            </div>
          </div>
        </div>

        {/* Pet Accommodation */}
        <div>
          <h3 className="text-lg font-medium mb-3 pb-2 border-b">Pet Accommodation</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Maximum Pets</Label>
              <Input
                type="number"
                min="1"
                value={room.max_pets}
                onChange={(e) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].max_pets = Number.parseInt(e.target.value)
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Current Pets Count</Label>
              <Input
                type="number"
                min="0"
                value={room.current_pets_count_int || 0}
                onChange={(e) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].current_pets_count_int = Number.parseInt(e.target.value)
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label>Allowed Pet Size</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={room.allow_pet_size}
                onChange={(e) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].allow_pet_size = e.target.value
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="all">All Sizes</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label>Allowed Pet Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={room.allow_pet_type}
                onChange={(e) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].allow_pet_type = e.target.value
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="all">All Pets</option>
              </select>
            </div>
          </div>
        </div>

        {/* Room Amenities */}
        <div>
          <h3 className="text-lg font-medium mb-3 pb-2 border-b">Room Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`has_ac_${roomId}`}
                checked={room.amenities?.has_ac || false}
                onCheckedChange={(checked) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].amenities = {
                    ...(updatedRooms[index].amenities || {}),
                    has_ac: checked,
                  }
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
              />
              <Label htmlFor={`has_ac_${roomId}`}>Air Conditioning</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`has_heating_${roomId}`}
                checked={room.amenities?.has_heating || false}
                onCheckedChange={(checked) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].amenities = {
                    ...(updatedRooms[index].amenities || {}),
                    has_heating: checked,
                  }
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
              />
              <Label htmlFor={`has_heating_${roomId}`}>Heating</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`has_tv_${roomId}`}
                checked={room.amenities?.has_tv || false}
                onCheckedChange={(checked) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].amenities = {
                    ...(updatedRooms[index].amenities || {}),
                    has_tv: checked,
                  }
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
              />
              <Label htmlFor={`has_tv_${roomId}`}>TV</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`has_private_bathroom_${roomId}`}
                checked={room.amenities?.has_private_bathroom || false}
                onCheckedChange={(checked) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].amenities = {
                    ...(updatedRooms[index].amenities || {}),
                    has_private_bathroom: checked,
                  }
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
              />
              <Label htmlFor={`has_private_bathroom_${roomId}`}>Private Bathroom</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`has_pet_bed_${roomId}`}
                checked={room.amenities?.has_pet_bed || false}
                onCheckedChange={(checked) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].amenities = {
                    ...(updatedRooms[index].amenities || {}),
                    has_pet_bed: checked,
                  }
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
              />
              <Label htmlFor={`has_pet_bed_${roomId}`}>Pet Bed</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`has_food_water_bowls_${roomId}`}
                checked={room.amenities?.has_food_water_bowls || false}
                onCheckedChange={(checked) => {
                  const updatedRooms = [...hotel.rooms]
                  updatedRooms[index].amenities = {
                    ...(updatedRooms[index].amenities || {}),
                    has_food_water_bowls: checked,
                  }
                  setHotel({ ...hotel, rooms: updatedRooms })
                }}
              />
              <Label htmlFor={`has_food_water_bowls_${roomId}`}>Food/Water Bowls</Label>
            </div>
          </div>
        </div>

        {/* Room Images Section */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-3 pb-2 border-b">Room Images</h3>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">Upload photos to showcase this room to potential guests</p>
            <div className="relative">
              <input
                type="file"
                id={`room-images-${roomId}`}
                accept="image/*"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleRoomImageChange(e, roomId)}
              />
              <Button type="button" variant="outline" size="sm" className="flex items-center gap-1">
                <ImagePlus className="h-4 w-4" />
                Add Images
              </Button>
            </div>
          </div>

          {/* Display existing room images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {roomImagePreviews[roomId]?.map((image, imgIndex) => (
              <div key={imgIndex} className="relative border rounded-md p-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 bg-white/80 hover:bg-white text-red-500 rounded-full z-10"
                  onClick={() => handleRemoveRoomImage(roomId, imgIndex, image.id !== undefined)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>

                <div className="aspect-video overflow-hidden rounded-md mb-2">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`Room ${room.roomname} image ${imgIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-1">
                  <Input
                    type="text"
                    placeholder="Image description"
                    value={image.description || ""}
                    onChange={(e) =>
                      handleRoomImageDescriptionChange(roomId, imgIndex, e.target.value, image.id !== undefined)
                    }
                    className="text-xs"
                  />
                </div>
              </div>
            ))}

            {(!roomImagePreviews[roomId] || roomImagePreviews[roomId].length === 0) && (
              <div className="col-span-full text-center py-8 border rounded-md border-dashed text-muted-foreground">
                No images added yet. Click "Add Images" to upload room photos.
              </div>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <h3 className="text-lg font-medium mb-3 pb-2 border-b">Additional Notes</h3>
          <div className="grid gap-2">
            <Label htmlFor={`room-notes-${roomId}`}>Notes (Internal use only)</Label>
            <Textarea
              id={`room-notes-${roomId}`}
              rows={3}
              value={room.notes || ""}
              onChange={(e) => {
                const updatedRooms = [...hotel.rooms]
                updatedRooms[index].notes = e.target.value
                setHotel({ ...hotel, rooms: updatedRooms })
              }}
              placeholder="Add any special notes about this room (not visible to guests)"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

