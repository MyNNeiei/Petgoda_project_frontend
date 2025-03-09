"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axiosInstance from "@/utils/axios"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar/headernav"
import { toast } from "@/hooks/use-toast"
import { Loader2, Save, Building, BedDouble, Coffee } from "lucide-react"
import HotelInfoTab from "@/components/hotel-edit/hotel-info-tab"
import Link from "next/link"

export default function EditHotelInfoPage() {
  const { id } = useParams()
  const router = useRouter()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        if (!id) return

        const response = await axiosInstance.get(`/api/hotels/${id}`)
        setHotel(response.data.hotel)
        console.log(response.data.hotel.id)
        // Set image preview if hotel has an image
        if (response.data.hotel?.imgHotel) {
          setImagePreview(response.data.hotel.imgHotel)
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

  const handleUpdateHotelInfo = async () => {
    setUpdating(true)

    try {
      const formData = new FormData()

      // Add basic hotel properties to formData
      for (const key in hotel) {
        // ส่ง imgHotel เฉพาะเมื่อเป็น File เท่านั้น
        if (key === "imgHotel") {
          if (hotel.imgHotel instanceof File) {
            formData.append("imgHotel", hotel.imgHotel)
          }
          // ถ้าเป็น URL หรือข้อมูลอื่นที่ไม่ใช่ File ให้ข้าม
        } else if (key !== "rooms" && key !== "facilities") {
          formData.append(key, hotel[key])
        }
      }
      formData.append("hotel_id", id);

      await axiosInstance.put(`/api/hotels/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast({
        title: "Success",
        description: "Hotel information updated successfully!",
      })
    } catch (err) {
      console.error("Error updating hotel info:", err)
      toast({
        title: "Error",
        description: "Failed to update hotel information.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setHotel({ ...hotel, imgHotel: file })

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
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
          <h1 className="text-2xl font-bold">Edit Hotel Information</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <Link href={`/mainHotel/manage/edit/${id}/rooms`}>
                <BedDouble className="h-4 w-4" />
                Edit Rooms
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
          <Building className="h-5 w-5 mr-2 text-primary" />
          <span>
            You are editing the basic information for <strong>{hotel?.name}</strong>
          </span>
        </div>

        <HotelInfoTab
          hotel={hotel}
          setHotel={setHotel}
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
        />

        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button variant="outline" onClick={() => router.push("/mainHotel/manage/")}>
            Back to Hotels
          </Button>

          <Button onClick={handleUpdateHotelInfo} disabled={updating} className="flex items-center gap-2">
            {updating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Hotel Info...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Hotel Info
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

