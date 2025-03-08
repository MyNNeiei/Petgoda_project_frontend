"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, Phone, User2, Pencil, Save, Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchProfile } from "@/utils/apiPets";
import axiosInstance from "@/utils/axios";

export default function PersonProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null); // Keep if you need a separate readonly version
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    birth_date: "",
    avatar: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Default avatar if no image exists

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("api/profile/");
        
        const data = response.data;

        setProfile(data); // Still set profile if needed

        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          birth_date: data.birth_date || "",
          phone: data.phone_number || "",
          address: data.address || "",
          avatar: data.profile_picture || null, // Keep avatar as null initially
        });
        setPreviewImage(data.profile_picture);  // Set default image if none exists
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({ ...prev, avatar: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone_number", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("birth_date", formData.birth_date);

      if (formData.avatar instanceof File) {
        formDataToSend.append("profile_picture", formData.avatar);
      }

      const response = await axiosInstance.put("api/profile/edit/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setProfile(response.data);

      // ✅ Corrected toast usage (removed useToast hook)
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      });

      setIsEditing(false);
      fetchProfile();
      

      // ✅ Update preview image after successful update
      // setPreviewImage(response.data.profile_picture || "/default-avatar.png");
    } catch (error) {
      console.error("Error updating profile", error);

      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };




  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <Card className="bg-[#D2C8BC]">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="relative group">
          <Avatar className="h-16 w-16 cursor-pointer transition-opacity group-hover:opacity-75">
            <AvatarImage src={previewImage || "/default-avatar.png"} />
            <AvatarFallback>
              <User2 className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <button
              type="button"
              onClick={handleImageClick}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
        </div>
        <div>
          <CardTitle>{formData.firstName} {formData.lastName}</CardTitle>
          <p className="text-sm text-muted-foreground">Personal Information</p>
          <p className="text-sm text-muted-foreground">{formData.birth_date}</p>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
