"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import axiosInstance from "@/utils/axios";

export function EditProfileDialog({ profile, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone_number", formData.phone);
      formDataToSend.append("address", formData.address);

      if (formData.avatar instanceof File) {
        formDataToSend.append("profile_picture", formData.avatar);
      }

      const response = await axiosInstance.put("api/profile/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setProfile(response.data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsEditing(false);
      // Update preview image after successful update
      setPreviewImage(response.data.profile_picture || DEFAULT_AVATAR); // update the preview image from the data returned from the backend
    } catch (error) {
      console.error("Error updating profile", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}