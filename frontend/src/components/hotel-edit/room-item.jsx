"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, Info, Upload, X, FileText } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function RoomItem({ room, index, hotel, setHotel, handleRemoveRoom }) {
  const roomId = room.id || room.tempId

  // Helper function to update room facilities
  const updateFacility = (facilityKey, isChecked) => {
    const updatedRooms = [...hotel.rooms]

    // Initialize facilities object if it doesn't exist
    if (!updatedRooms[index].facilities) {
      updatedRooms[index].facilities = {}
    }

    updatedRooms[index].facilities = {
      ...updatedRooms[index].facilities,
      [facilityKey]: isChecked,
    }

    setHotel({ ...hotel, rooms: updatedRooms })
  }

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
                <option value="partially_reserved">Partially Reserved</option>
                <option value="fully_reserved">Fully Reserved</option>
                <option value="partially_occupied">Partially Occupied</option>
                <option value="fully_occupied">Fully Occupied</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="unavailable">Unavailable</option>
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

        {/* Room Facilities */}
        <div>
          <h3 className="text-lg font-medium mb-3 pb-2 border-b flex items-center">
            Room Facilities
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px]">These facilities will be displayed to pet owners when booking</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_air_conditioning_${roomId}`}
                checked={room.facilities?.has_air_conditioning || false}
                onCheckedChange={(checked) => updateFacility("has_air_conditioning", checked)}
              />
              <Label htmlFor={`has_air_conditioning_${roomId}`}>Air Conditioning</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_cctv_${roomId}`}
                checked={room.facilities?.has_cctv || false}
                onCheckedChange={(checked) => updateFacility("has_cctv", checked)}
              />
              <Label htmlFor={`has_cctv_${roomId}`}>CCTV</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_webcam_monitoring_${roomId}`}
                checked={room.facilities?.has_webcam_monitoring || false}
                onCheckedChange={(checked) => updateFacility("has_webcam_monitoring", checked)}
              />
              <Label htmlFor={`has_webcam_monitoring_${roomId}`}>Webcam Monitoring</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_pet_food_${roomId}`}
                checked={room.facilities?.has_pet_food || false}
                onCheckedChange={(checked) => updateFacility("has_pet_food", checked)}
              />
              <Label htmlFor={`has_pet_food_${roomId}`}>Pet Food</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_toys_${roomId}`}
                checked={room.facilities?.has_toys || false}
                onCheckedChange={(checked) => updateFacility("has_toys", checked)}
              />
              <Label htmlFor={`has_toys_${roomId}`}>Toys</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_private_space_${roomId}`}
                checked={room.facilities?.has_private_space || false}
                onCheckedChange={(checked) => updateFacility("has_private_space", checked)}
              />
              <Label htmlFor={`has_private_space_${roomId}`}>Private Space</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_pet_bedding_${roomId}`}
                checked={room.facilities?.has_pet_bedding || false}
                onCheckedChange={(checked) => updateFacility("has_pet_bedding", checked)}
              />
              <Label htmlFor={`has_pet_bedding_${roomId}`}>Pet Bedding</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_soundproofing_${roomId}`}
                checked={room.facilities?.has_soundproofing || false}
                onCheckedChange={(checked) => updateFacility("has_soundproofing", checked)}
              />
              <Label htmlFor={`has_soundproofing_${roomId}`}>Soundproofing</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_water_dispenser_${roomId}`}
                checked={room.facilities?.has_water_dispenser || false}
                onCheckedChange={(checked) => updateFacility("has_water_dispenser", checked)}
              />
              <Label htmlFor={`has_water_dispenser_${roomId}`}>Water Dispenser</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_emergency_button_${roomId}`}
                checked={room.facilities?.has_emergency_button || false}
                onCheckedChange={(checked) => updateFacility("has_emergency_button", checked)}
              />
              <Label htmlFor={`has_emergency_button_${roomId}`}>Emergency Button</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_natural_light_${roomId}`}
                checked={room.facilities?.has_natural_light || false}
                onCheckedChange={(checked) => updateFacility("has_natural_light", checked)}
              />
              <Label htmlFor={`has_natural_light_${roomId}`}>Natural Light</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_flexible_checkin_${roomId}`}
                checked={room.facilities?.has_flexible_checkin || false}
                onCheckedChange={(checked) => updateFacility("has_flexible_checkin", checked)}
              />
              <Label htmlFor={`has_flexible_checkin_${roomId}`}>Flexible Check-in</Label>
            </div>
          </div>

          {/* Show selected facilities count */}
          {room.facilities && (
            <div className="mt-4 text-sm text-muted-foreground">
              {Object.values(room.facilities).filter(Boolean).length} facilities selected
            </div>
          )}
        </div>

        {/* Amenities Attachment */}
        <div>
          <h3 className="text-lg font-medium mb-3 pb-2 border-b flex items-center">
            Amenities Attachment
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px]">Upload a document with detailed amenities information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_amenities_attachment_${roomId}`}
                checked={!!room.amenitiesAttachment}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    // If unchecked, remove the attachment
                    const updatedRooms = [...hotel.rooms]
                    updatedRooms[index].amenitiesAttachment = null
                    setHotel({ ...hotel, rooms: updatedRooms })
                  }
                }}
              />
              <Label htmlFor={`has_amenities_attachment_${roomId}`}>Include Amenities Document</Label>
            </div>

            {!!room.amenitiesAttachment && (
              <div className="mt-2">
                {typeof room.amenitiesAttachment === "string" ? (
                  // Display existing attachment
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate flex-1">
                      {room.amenitiesAttachment.split("/").pop() || "Attached Document"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updatedRooms = [...hotel.rooms]
                        updatedRooms[index].amenitiesAttachment = null
                        setHotel({ ...hotel, rooms: updatedRooms })
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                ) : (
                  // File upload input
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label
                      htmlFor={`amenities-attachment-${roomId}`}
                      className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary focus:outline-none"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <span className="font-medium text-sm text-muted-foreground">
                          Click to upload amenities document
                        </span>
                        <span className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</span>
                      </div>
                      <Input
                        id={`amenities-attachment-${roomId}`}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const updatedRooms = [...hotel.rooms]
                            updatedRooms[index].amenitiesAttachment = file
                            setHotel({ ...hotel, rooms: updatedRooms })
                          }
                        }}
                      />
                    </Label>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

