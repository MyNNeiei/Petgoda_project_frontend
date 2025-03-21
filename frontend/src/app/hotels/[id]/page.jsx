"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import axiosInstance from "@/utils/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/navbar/headernav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2, Calendar, Users, PawPrintIcon as Paw, CreditCard, Check } from "lucide-react"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
// import { useParams } from "next/navigation";  // ✅ เพิ่ม import

export default function BookHotelPage() {
  const { id } = useParams()
  const router = useRouter()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const { id: hotelId } = useParams();  // ✅ ดึง hotelId จาก URL

  // Booking state
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [checkInDate, setCheckInDate] = useState(null)
  const [checkOutDate, setCheckOutDate] = useState(null)
  const [petDetails, setPetDetails] = useState({
    petName: "",
    petType: "dog",
    petSize: "small",
    petBreed: "",
    specialNeeds: "",
  })
  const [ownerDetails, setOwnerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("credit_card")

  const [facilitiesLoading, setFacilitiesLoading] = useState(false)
  const [facilities, setFacilities] = useState(null)

  // Update the getAvailableFacilities function to use the dedicated facilities state
  const getAvailableFacilities = () => {
    if (!facilities) return []

    return Object.entries(facilities)
      .filter(([key, value]) => value === true)
      .map(([key]) => key)
  }

  const availableFacilities = getAvailableFacilities()

  // Add a new function to fetch facilities
  const fetchFacilities = async () => {
    if (!id) return

    setFacilitiesLoading(true)
    try {
      console.log(`🔍 Fetching facilities for hotel ID: ${id}`)
      const response = await axiosInstance.get(`/api/hotels/${id}/facilities`)
      console.log("✅ Fetched Facilities:", response.data)

      if (response.data && response.data.facilities) {
        setFacilities(response.data.facilities)
      } else {
        // Initialize with empty facilities if none exist
        setFacilities({})
      }
    } catch (err) {
      console.error("❌ Error fetching facilities:", err.response?.data || err.message)
      toast({
        title: "Warning",
        description: "Failed to load hotel facilities. Some information may be missing.",
        variant: "warning",
      })
      // Set empty facilities on error
      setFacilities({})
    } finally {
      setFacilitiesLoading(false)
    }
  }
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        if (!id) return

        const response = await axiosInstance.get(`/api/hotels/${id}`)
        setHotel(response.data.hotel)

        fetchFacilities()
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

  useEffect(() => {
    const fetchRooms = async () => {
      if (!id) return
      
      try {
        setRoomsLoading(true)
        console.log(`🔍 Fetching rooms for hotel ID: ${id}`)
        const response = await axiosInstance.get(`/api/hotels/${id}/rooms`)
        console.log("✅ Fetched Rooms:", response.data)
        setRooms(response.data)
      } catch (err) {
        console.error("❌ Error fetching rooms:", err.response?.data || err.message)
        toast({
          title: "Error",
          description: "Failed to load available rooms.",
          variant: "destructive",
        })
      } finally {
        setRoomsLoading(false)
      }
    }

    if (activeTab === "rooms") {
      fetchRooms()
    }
  }, [id, activeTab])

  const handleBooking = async (e) => {
    e.preventDefault()

    if (!selectedRoom) {
      toast({
        title: "Error",
        description: "Please select a room to book.",
        variant: "destructive",
      })
      return
    }

    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Error",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      })
      return
    }

    setBooking(true)

    try {
      const bookingData = {
        hotelId: id,
        roomId: selectedRoom.id || selectedRoom.tempId,
        checkInDate: format(checkInDate, "yyyy-MM-dd"),
        checkOutDate: format(checkOutDate, "yyyy-MM-dd"),
        petDetails,
        ownerDetails,
        paymentMethod,
      }

      await axiosInstance.post(`/api/bookings/create`, bookingData)

      toast({
        title: "Success",
        description: "Your booking has been confirmed!",
      })

      router.push("/bookings/confirmation")
    } catch (err) {
      console.error("Error creating booking:", err)
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBooking(false)
    }
  }

  const calculateTotalPrice = () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) return 0

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    return selectedRoom.price_per_night * nights
  }

  const isRoomAvailable = (room) => {
    // This would typically check against existing bookings
    // For now, we'll just use the availability_status field
    return room.availability_status === "available"
  }

  const isDateDisabled = (date) => {
    // Example logic to disable past dates
    return date < new Date()
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
            <Button onClick={() => router.push("/hotels")}>Return to Hotels</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{hotel?.name}</h1>
            <p className="text-muted-foreground mb-4">{hotel?.address}</p>

            {hotel?.imgHotel && (
              <div className="rounded-lg overflow-hidden h-64 md:h-96 mb-6">
                <img
                  src={hotel.imgHotel || "/placeholder.svg"}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="prose max-w-none mb-6">
              <h2 className="text-xl font-semibold mb-2">About this hotel</h2>
              <p>{hotel?.description}</p>
            </div>

            {/* Facilities section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Facilities</h2>

              {facilitiesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <p className="text-muted-foreground">Loading facilities...</p>
                </div>
              ) : availableFacilities.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableFacilities.map((facility) => {
                    // Get the human-readable label for the facility
                    const label = facilityLabels[facility] || facility.replace("has_", "").replace(/_/g, " ")

                    return (
                      <li key={facility} className="flex items-center gap-2 py-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-800">{label}</span>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground">No facilities information available for this hotel.</p>
              )}
            </div>
          </div>

          <div className="md:w-1/3">
            <Card className="sticky top-4 shadow-xl border border-primary">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-center mb-6 text-primary">Book Your Stay</h2>
                <Link href={`/hotels/${hotelId}/reservation`}>
                  <Button
                    className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-yellow-500 to-yellow-600 
                 hover:from-yellow-600 hover:to-yellow-700 shadow-lg transform hover:scale-105 transition-all"
                    onClick={() => setActiveTab("rooms")}
                  >
                    View Available Rooms
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>
        </div>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Hotel Details</TabsTrigger>
            <TabsTrigger value="rooms">Available Rooms</TabsTrigger>
            <TabsTrigger value="booking" disabled={!selectedRoom}>
              Booking Details
            </TabsTrigger>
            <TabsTrigger value="payment" disabled={!selectedRoom || !checkInDate || !checkOutDate}>
              Payment
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleBooking}>
            <TabsContent value="details">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <h2 className="text-xl font-semibold mb-4">About {hotel?.name}</h2>
                    <p>{hotel?.description}</p>

                    <h3 className="text-lg font-medium mt-6 mb-2">Contact Information</h3>
                    <p>
                      <strong>Phone:</strong> {hotel?.phone}
                    </p>
                    <p>
                      <strong>Email:</strong> {hotel?.email}
                    </p>
                    {hotel?.website && (
                      <p>
                        <strong>Website:</strong> {hotel?.website}
                      </p>
                    )}
                    <p>
                      <strong>Address:</strong> {hotel?.address}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rooms">
              {roomsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2">Loading available rooms...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rooms && rooms.length > 0 ? (
                    rooms.map((room, index) => (
                      <Card
                        key={room.id || index}
                        className={`overflow-hidden ${selectedRoom?.id === room.id ? "ring-2 ring-primary" : ""}`}
                      >

                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{room.roomname}</h3>
                            <Badge variant={isRoomAvailable(room) ? "outline" : "secondary"}>
                              {isRoomAvailable(room) ? "Available" : "Unavailable"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>Max Pets: {room.max_pets}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Paw className="h-4 w-4 text-muted-foreground" />
                              <span>Pet Size: {room.allow_pet_size}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <p className="font-semibold text-lg">
                              ${room.price_per_night}{" "}
                              <span className="text-sm font-normal text-muted-foreground">/ night</span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 border rounded-md border-dashed text-muted-foreground">
                      No rooms available at this hotel.
                    </div>
                  )}
                </div>
              )}

              {selectedRoom && (
                <div className="mt-6 flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("booking")}>
                    Continue to Booking Details
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="booking">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Pet Details</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="petName">Pet Name</Label>
                        <Input
                          id="petName"
                          value={petDetails.petName}
                          onChange={(e) => setPetDetails({ ...petDetails, petName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="petBreed">Pet Breed</Label>
                        <Input
                          id="petBreed"
                          value={petDetails.petBreed}
                          onChange={(e) => setPetDetails({ ...petDetails, petBreed: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="petType">Pet Type</Label>
                        <Select
                          value={petDetails.petType}
                          onValueChange={(value) => setPetDetails({ ...petDetails, petType: value })}
                        >
                          <SelectTrigger id="petType">
                            <SelectValue placeholder="Select pet type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dog">Dog</SelectItem>
                            <SelectItem value="cat">Cat</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="petSize">Pet Size</Label>
                        <Select
                          value={petDetails.petSize}
                          onValueChange={(value) => setPetDetails({ ...petDetails, petSize: value })}
                        >
                          <SelectTrigger id="petSize">
                            <SelectValue placeholder="Select pet size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="specialNeeds">Special Needs or Requirements</Label>
                        <Textarea
                          id="specialNeeds"
                          rows={3}
                          value={petDetails.specialNeeds}
                          onChange={(e) => setPetDetails({ ...petDetails, specialNeeds: e.target.value })}
                          placeholder="Any dietary restrictions, medications, or special care instructions"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Owner Details</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="ownerName">Full Name</Label>
                        <Input
                          id="ownerName"
                          value={ownerDetails.name}
                          onChange={(e) => setOwnerDetails({ ...ownerDetails, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="ownerPhone">Phone Number</Label>
                        <Input
                          id="ownerPhone"
                          value={ownerDetails.phone}
                          onChange={(e) => setOwnerDetails({ ...ownerDetails, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="ownerEmail">Email</Label>
                        <Input
                          id="ownerEmail"
                          type="email"
                          value={ownerDetails.email}
                          onChange={(e) => setOwnerDetails({ ...ownerDetails, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("rooms")}>
                    Back to Rooms
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("payment")}>
                    Continue to Payment
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                    <div className="bg-muted p-4 rounded-md space-y-3">
                      <div className="flex justify-between">
                        <span>Hotel:</span>
                        <span className="font-medium">{hotel?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Room:</span>
                        <span className="font-medium">{selectedRoom?.roomname}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span className="font-medium">{checkInDate ? format(checkInDate, "PPP") : ""}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span className="font-medium">{checkOutDate ? format(checkOutDate, "PPP") : ""}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nights:</span>
                        <span className="font-medium">
                          {Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pet:</span>
                        <span className="font-medium">
                          {petDetails.petName} ({petDetails.petType})
                        </span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between">
                        <span className="font-semibold">Total:</span>
                        <span className="font-semibold">${calculateTotalPrice()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card" className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Credit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal">PayPal</Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="pay_at_hotel" id="pay_at_hotel" />
                        <Label htmlFor="pay_at_hotel">Pay at Hotel</Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "credit_card" && (
                      <div className="mt-4 space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input id="cardName" placeholder="John Doe" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input id="expiryDate" placeholder="MM/YY" required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" required />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("booking")}>
                    Back to Booking Details
                  </Button>
                  <Button type="submit" disabled={booking}>
                    {booking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Tabs>
      </div>
    </div>
  )
}

