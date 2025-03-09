"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axiosInstance from "@/utils/axios"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar/headernav"
import { toast } from "@/hooks/use-toast"
import { Loader2, Save, Building, BedDouble, Coffee } from "lucide-react"
import FacilitiesTab from "@/components/hotel-edit/facilities-tab"
import Link from "next/link"

export default function EditHotelFacilitiesPage() {
  const { id } = useParams()
  const router = useRouter()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        if (!id) return

        const response = await axiosInstance.get(`/api/hotels/${id}`)
        setHotel(response.data.hotel)
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

  const handleUpdateFacilities = async () => {
    setUpdating(true)

    try {
      // Handle facilities separately
      const facilitiesData = {
        hotelId: id,
        facilities: hotel.facilities,
      }

      await axiosInstance.put(`/api/hotels/facilities/update/${id}`, facilitiesData)

      toast({
        title: "Success",
        description: "Hotel facilities updated successfully!",
      })
    } catch (err) {
      console.error("Error updating facilities:", err)
      toast({
        title: "Error",
        description: "Failed to update hotel facilities.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
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
          <h1 className="text-2xl font-bold">Edit Hotel Facilities</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <Link href={`/mainHotel/manage/edit/${id}`}>
                <Building className="h-4 w-4" />
                Edit Hotel Info
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <Link href={`/mainHotel/manage/edit/${id}/rooms`}>
                <BedDouble className="h-4 w-4" />
                Edit Rooms
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg mb-6 flex items-center">
          <Coffee className="h-5 w-5 mr-2 text-primary" />
          <span>
            You are editing the facilities for <strong>{hotel?.name}</strong>
          </span>
        </div>

        <FacilitiesTab hotel={hotel} setHotel={setHotel} />

        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button variant="outline" onClick={() => router.push("/mainHotel/manage/")}>
            Back to Hotels
          </Button>

          <Button onClick={handleUpdateFacilities} disabled={updating} className="flex items-center gap-2">
            {updating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Facilities...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Facilities
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

