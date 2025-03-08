"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"; // ✅ Correct in Next.js App Router
import Head from "next/head"
import { toast } from "@/hooks/use-toast"
import axiosInstance from "@/utils/axios"
import AddHotelForm from "@/components/AddHotelForm"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Star, MapPin, Phone, Mail, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar/headernav"

export default function ManageHotelsPage() {
  const router = useRouter()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingHotelId, setDeletingHotelId] = useState(null)

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get("api/hotels/", {
        withCredentials: true,
      })
      console.log(response.data)
      setHotels(response.data)
    } catch (error) {
      console.error("Error fetching hotels:", error)
      setError("Failed to load hotels. Please try again.")

      // If unauthorized, redirect to login
      if (error.response && error.response.status === 401) {
        toast({
          title: "Authentication required",
          description: "Please log in to manage your hotels",
          variant: "destructive",
        })
        router.push("/login?redirect=/hotels/manage")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  const handleDelete = async (hotelId) => {
    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this hotel? This action cannot be undone.")) {
      return
    }

    setDeletingHotelId(hotelId)

    try {
      await axiosInstance.delete(`api/hotels/${hotelId}/delete/`, {
        withCredentials: true,
      })

      toast({
        title: "Success",
        description: "Hotel deleted successfully",
      })

      // Refresh the hotel list
      fetchHotels()
    } catch (error) {
      console.error("Error deleting hotel:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete hotel",
        variant: "destructive",
      })
    } finally {
      setDeletingHotelId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#E8E0D5]">
      <Head>
        <title>Manage Hotels | PetStay</title>
        <meta name="description" content="Manage your pet hotels" />
      </Head>
      <Navbar/>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Hotels</h1>
            <AddHotelForm onSuccess={fetchHotels} />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">{error}</div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No hotels found</h3>
              <p className="text-gray-500 mb-6">You haven't added any hotels yet.</p>
              <AddHotelForm onSuccess={fetchHotels} />
            </div>
          ) : (
            <div className="space-y-6">
              {hotels.map((hotel) => (
                <Card key={hotel.id} className="bg-white overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      {hotel.image_url ? (
                        <img
                          src={hotel.image_url || "/placeholder.svg"}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <p className="text-gray-500">No image</p>
                        </div>
                      )}
                      {!hotel.is_verified && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500">Pending Verification</Badge>
                      )}
                    </div>
                    <div className="md:w-2/3">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{hotel.name}</CardTitle>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{hotel.address}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                            <span className="font-medium">{hotel.rating || "0.0"}</span>
                            <span className="text-muted-foreground ml-1">({hotel.total_review || 0} reviews)</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="line-clamp-2 mb-4">{hotel.description}</CardDescription>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{hotel.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{hotel.email}</span>
                          </div>
                          {hotel.website && (
                            <div className="flex items-center col-span-2">
                              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                              <a
                                href={hotel.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline truncate"
                              >
                                {hotel.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/mainHotel/manage/edit/${hotel.id}`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(hotel.id)}
                          disabled={deletingHotelId === hotel.id}
                        >
                          {deletingHotelId === hotel.id ? (
                            <>
                              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

