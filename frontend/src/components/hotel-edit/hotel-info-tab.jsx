"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function HotelInfoTab({ hotel, setHotel, imagePreview, handleImageChange }) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Hotel Name</Label>
          <Input
            id="name"
            value={hotel?.name || ""}
            onChange={(e) => setHotel({ ...hotel, name: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={hotel?.description || ""}
            onChange={(e) => setHotel({ ...hotel, description: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={hotel?.phone || ""}
            onChange={(e) => setHotel({ ...hotel, phone: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={hotel?.email || ""}
            onChange={(e) => setHotel({ ...hotel, email: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            type="url"
            value={hotel?.website || ""}
            onChange={(e) => setHotel({ ...hotel, website: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            rows={2}
            value={hotel?.address || ""}
            onChange={(e) => setHotel({ ...hotel, address: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hotelImage">Hotel Image</Label>
          <div className="flex flex-col gap-4">
            {imagePreview && (
              <div className="relative w-full max-w-md">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Hotel preview"
                  className="w-full h-48 object-cover rounded-md border"
                />
              </div>
            )}
            <input
              id="hotelImage"
              type="file"
              accept="image/*"
              className="block w-full border border-gray-300 p-2 rounded-md"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

