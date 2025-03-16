"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axiosInstance from "@/utils/axios"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar/headernav"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Building, BedDouble, Coffee } from "lucide-react"
import FacilitiesTab from "@/components/hotel-edit/facilities-tab"
import Link from "next/link"

export default function EditHotelFacilitiesPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        if (!id) {
          setError("Hotel ID is missing")
          return
        }

        const response = await axiosInstance.get(`/api/hotels/${id}`)

        if (!response.data || !response.data.hotel) {
          throw new Error("Invalid response format")
        }

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
  }, [id, toast])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p>Loading hotel details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Navbar />
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-md mt-8">
          <p className="text-center font-medium">{error}</p>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => router.push("/mainHotel/manage/")}>Return to Hotel Management</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Edit Hotel Facilities</h1>
          <div className="flex flex-wrap gap-2">
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

        {hotel && <FacilitiesTab hotel={hotel} setHotel={setHotel} />}

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={() => router.push("/mainHotel/manage/")}>
            Back to Hotels
          </Button>
        </div>
      </div>
    </div>
  )
}

