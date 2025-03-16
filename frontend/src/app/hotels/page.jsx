"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Star, MapPin, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import axiosInstance from "@/utils/axios"
import Navbar from "@/components/navbar/headernav"

export default function AllHotelsPage() {
  const router = useRouter()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // State for confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState(null)

  // ✅ Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axiosInstance.get("/api/hotels/")
        console.log("✅ Raw API Response:", response.data)

        if (!Array.isArray(response.data)) {
          console.error("❌ Expected an array, but got:", response.data)
          setError("Unexpected API response format.")
          return
        }

        // ✅ Filter only verified hotels
        const verifiedHotels = response.data.filter((hotel) => hotel.is_verified !== false)
        setHotels(verifiedHotels)

        console.log("✅ Filtered Hotels:", verifiedHotels)
      } catch (err) {
        console.error("❌ Error fetching hotels:", err)
        setError("Failed to load hotels. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [])

  // ✅ ค้นหาชื่อโรงแรมหรือที่อยู่
  const filteredHotels = hotels.filter(
    (hotel) =>
      (hotel.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hotel.address ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle view details click
  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel)
    setConfirmDialogOpen(true)
  }

  // Handle confirmation
  const handleConfirm = () => {
    if (selectedHotel) {
      router.push(`/hotels/${selectedHotel.id}`)
    }
    setConfirmDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading hotels...</p>
      </div>
    )
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Pet Hotels</h1>

          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="search"
              placeholder="Search hotels by name or location..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 cursor-pointer" onClick={() => handleViewDetails(hotel)}>
                  <img
                    src={hotel.imgHotel || hotel.image_url || "/default-hotel.jpg"} // ✅ ใช้ค่าที่มี หรือ fallback
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{hotel.name}</h3>
                  <p className="text-muted-foreground text-sm">{hotel.address}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{hotel.rating || "N/A"}</span>
                    <span className="text-muted-foreground">({hotel.total_review || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="h-3 w-3" />
                    <span>{hotel.address}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-lg">${hotel.price_per_night || "N/A"}</span>
                    <span className="text-muted-foreground text-sm"> / night</span>
                  </div>
                  <Button size="sm" onClick={() => handleViewDetails(hotel)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <h3 className="text-xl font-semibold mb-2">No verified pet hotels found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="bg-[#D2C8BC] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>View Hotel Details</DialogTitle>
            <DialogDescription>You are about to view details for {selectedHotel?.name}</DialogDescription>
          </DialogHeader>

          {selectedHotel && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={selectedHotel.imgHotel || selectedHotel.image_url || "/default-hotel.jpg"}
                    alt={selectedHotel.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedHotel.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedHotel.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      ${selectedHotel.price_per_night || "N/A"} / night
                    </Badge>
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {selectedHotel.rating || "N/A"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-md flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  You'll be able to see detailed information about this pet hotel, including available rooms,
                  facilities, and booking options.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Continue to Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

