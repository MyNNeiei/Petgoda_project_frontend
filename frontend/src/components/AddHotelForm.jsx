"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Upload } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import axiosInstance from "@/utils/axios"

export default function AddHotelForm({ onSuccess }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    place_id: "",
    price_per_night: "",
  })

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // ถ้ามีรูปเก่าอยู่แล้ว ให้ revoke URL ก่อน
      if (image && image.preview) {
        URL.revokeObjectURL(image.preview);
      }

      const file = e.target.files[0];
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleImageDescriptionChange = (index, description) => {
    const updatedImages = [...images]
    updatedImages[index].description = description
    setImages(updatedImages)
  }

  const removeImage = () => {
    if (image && image.preview) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Basic validation to check required fields
    if (!formData.name || !formData.description || !formData.phone || !formData.email) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const hotelFormData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          hotelFormData.append(key, formData[key]);
        }
      });

      if (formData.price_per_night) {
        hotelFormData.append("price_per_night", formData.price_per_night.toString());
      }

      if (image && image.file) {
        hotelFormData.append('imgHotel', image.file);
      }

      const hotelResponse = await axiosInstance.post("api/hotels/create/", hotelFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast({
        title: "Success",
        description: "Hotel added successfully",
      });

      setOpen(false);
      setFormData({
        name: "",
        description: "",
        phone: "",
        email: "",
        website: "",
        address: "",
        place_id: "",
        price_per_night: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log("Error adding hotel:", error.response?.data || error);

      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add hotel",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Hotel
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Hotel</DialogTitle>
          <DialogDescription>Add your hotel information. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Hotel Name*</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your hotel, services, and amenities..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number*</Label>
              <Input
                id="phone"
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g., 0812345678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="hotel@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://www.yourhotel.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address*</Label>
            <Textarea
              id="address"
              required
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address of your hotel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="place_id">Google Place ID*</Label>
            <Input
              id="place_id"
              required
              value={formData.place_id}
              onChange={(e) => setFormData({ ...formData, place_id: e.target.value })}
              placeholder="e.g., ChIJN1t_tDeuEmsRUsoyG83frY4"
            />
            <p className="text-xs text-muted-foreground">
              You can find your Place ID using the{" "}
              <a
                href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Place ID Finder
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label>Hotel Image</Label>
            <div className="border-2 border-dashed rounded-md p-4 text-center">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Click to upload hotel image</p>
                  <p className="text-xs text-muted-foreground mt-1">Upload main image of your hotel</p>
                </div>
              </label>
            </div>

            {image && (
              <div className="mt-4">
                <p className="text-sm font-medium">Hotel Image</p>
                <div className="border rounded-md p-2">
                  <div className="aspect-video relative mb-2">
                    <img
                      src={image.preview}
                      alt="Hotel image"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Hotel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

