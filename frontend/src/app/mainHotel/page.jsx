"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axiosInstance from "@/utils/axios"
import { Building, Eye, Plus, RefreshCw, Star, Trash, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar/headernav"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function HotelsPage() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const router = useRouter()
  const [isStaff, setIsStaff] = useState(false)

  const fetchHotels = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axiosInstance.get("/api/hotels/", {
        withCredentials: true,
      })
      setHotels(response.data)
    } catch (error) {
      console.error("Error fetching hotels:", error)
      setError("Failed to load hotels. Please try again.")

      if (error.response && error.response.status === 401) {
        toast({
          title: "Authentication required",
          description: "Please log in to manage your hotels",
          variant: "destructive",
        })
        router.push("/login?redirect=/hotels")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  const handleDeleteHotel = async (id) => {
    if (!confirm("Are you sure you want to delete this hotel?")) return

    try {
      await axiosInstance.delete(`/api/hotels/${id}/delete/`)
      toast({
        title: "Hotel deleted",
        description: "The hotel has been successfully deleted",
      })
      fetchHotels()
    } catch (error) {
      console.error("Error deleting hotel:", error)
      toast({
        title: "Error",
        description: "Failed to delete hotel. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Helper function to determine hotel status and badge variant
  const getStatusDetails = (hotel) => {
    if (hotel.is_verified) {
      return {
        label: "Verified",
        variant: "success",
        className: "bg-green-100 text-green-800 hover:bg-green-200",
      }
    } else if (hotel.is_rejected) {
      return {
        label: "Rejected",
        variant: "destructive",
        className: "bg-red-100 text-red-800 hover:bg-red-200",
      }
    } else {
      return {
        label: "Pending Verification",
        variant: "outline",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      }
    }
  }
  if (!loading && !isStaff) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">

            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              This page is restricted to staff members only. If you believe you should have access, please contact an
              administrator.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center mt-8">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hotel Management</h1>
            <p className="text-muted-foreground">Manage your pet-friendly hotels and properties</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={fetchHotels} variant="outline" size="sm" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button asChild variant="default" size="sm" className="flex items-center gap-2">
              <Link href="/mainHotel/manage/">
                <Plus className="h-4 w-4" />
                Manage Hotel
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Building className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">No hotels found</h3>
            <p className="mb-6 text-muted-foreground">You haven't added any hotels yet.</p>
            <Button asChild>
              <Link href="/hotels/create">Add Your First Hotel</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => {
              const statusDetails = getStatusDetails(hotel)

              return (
                <Card key={hotel.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={
                        hotel.imgHotel
                          ? hotel.imgHotel.startsWith("http")
                            ? hotel.imgHotel
                            : `http://localhost:8000${hotel.imgHotel}`
                          : "/placeholder.svg"
                      }
                      alt={hotel.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute right-2 top-2">
                      <Badge className={statusDetails.className}>{statusDetails.label}</Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{hotel.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{hotel.address}</p>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{hotel.rating || "N/A"}</span>
                      <span className="text-xs text-muted-foreground">({hotel.total_review || 0} reviews)</span>
                    </div>
                    <p className="mt-2 text-sm">
                      <span className="font-medium">${hotel.price_per_night || "N/A"}</span>
                      <span className="text-muted-foreground"> / night</span>
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/hotels/${hotel.id}`}>
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteHotel(hotel.id)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

