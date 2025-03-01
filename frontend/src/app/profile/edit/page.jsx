"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { fetchProfile, updateProfile } from "@/utils/axios"
import { toast } from "@/hooks/use-toast"

export default function EditProfileForm({ profileId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    about: "",
  })
  const [loading, setLoading] = useState(false)

  // Fetch profile data and prefill form
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchProfile(profileId)
        setFormData({
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          location: profileData.location || "",
          about: profileData.about || "",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        })
      }
    }
    loadProfile()
  }, [profileId])

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateProfile(profileId, formData)
      toast({
        title: "Success",
        description: "Profile updated successfully!",
        variant: "success",
      })
      onSuccess() // Reload profile after update
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} />
          </div>

          {/* About */}
          <div>
            <Label htmlFor="about">About</Label>
            <Textarea id="about" name="about" value={formData.about} onChange={handleChange} />
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
