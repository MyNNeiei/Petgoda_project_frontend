"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axiosInstance from "@/utils/axios"
import Navbar from "@/components/navbar/headernav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const NewReservation = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [petOptions, setPetOptions] = useState([
    { id: 1, name: "Max" },
    { id: 2, name: "Bella" },
    { id: 3, name: "Charlie" },
  ])
  const [roomOptions, setRoomOptions] = useState([
    { id: 1, number: "101", type: "Standard" },
    { id: 2, number: "102", type: "Deluxe" },
    { id: 3, number: "103", type: "Suite" },
  ])

  const [formData, setFormData] = useState({
    pet: "",
    room: "",
    checkInDate: null,
    checkOutDate: null,
    specialRequests: "",
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }))
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.pet || !formData.room || !formData.checkInDate || !formData.checkOutDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const payload = {
        pet: formData.pet,
        room: formData.room,
        check_in_date: format(formData.checkInDate, "yyyy-MM-dd"),
        check_out_date: format(formData.checkOutDate, "yyyy-MM-dd"),
        special_requests: formData.specialRequests,
        status: "pending",
      }

      const response = await axiosInstance.post("/api/reservations/", payload)

      toast({
        title: "Reservation Created",
        description: "Your reservation has been successfully created",
        variant: "default",
      })

      router.push("/reservations")
    } catch (error) {
      console.error("Error creating reservation:", error)
      toast({
        title: "Error",
        description: "Failed to create reservation. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">New Reservation</CardTitle>
            <CardDescription>Book a stay for your pet at our hotel</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pet">Select Pet</Label>
                <Select onValueChange={(value) => handleSelectChange("pet", value)} value={formData.pet}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {petOptions.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id.toString()}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Select Room</Label>
                <Select onValueChange={(value) => handleSelectChange("room", value)} value={formData.room}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomOptions.map((room) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        Room {room.number} - {room.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.checkInDate ? format(formData.checkInDate, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.checkInDate}
                        onSelect={(date) => handleDateChange("checkInDate", date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Check-out Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.checkOutDate ? format(formData.checkOutDate, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.checkOutDate}
                        onSelect={(date) => handleDateChange("checkOutDate", date)}
                        initialFocus
                        disabled={(date) => date < new Date() || (formData.checkInDate && date <= formData.checkInDate)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  name="specialRequests"
                  placeholder="Any special requirements for your pet's stay"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/reservations")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Reservation"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default NewReservation

