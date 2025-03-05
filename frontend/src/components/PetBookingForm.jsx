"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function PetBookingForm({ hotelId }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pets, setPets] = useState([])
  const [selectedPets, setSelectedPets] = useState([])
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [additionalServices, setAdditionalServices] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  const [specialRequests, setSpecialRequests] = useState("")
  const [error, setError] = useState("")
  const [hotelDetails, setHotelDetails] = useState(null)

  // Fetch user data, pets, and hotel details on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)

        // In a real app, this would be a call to your Next.js API route that communicates with Django
        const userResponse = await fetch("/api/auth/user")

        if (!userResponse.ok) {
          // If user is not authenticated, redirect to login
          router.push(`/login?redirect=/hotels/${hotelId}/booking`)
          return
        }

        const userData = await userResponse.json()
        setUser(userData)

        // Fetch user's pets from Django backend
        const petsResponse = await fetch(`/api/pets?userId=${userData.id}`)
        const petsData = await petsResponse.json()
        setPets(petsData)

        // Fetch hotel details
        const hotelResponse = await fetch(`/api/hotels/${hotelId}`)
        const hotelData = await hotelResponse.json()
        setHotelDetails(hotelData)

        // Fetch available additional services for this hotel
        const servicesResponse = await fetch(`/api/hotels/${hotelId}/services`)
        const servicesData = await servicesResponse.json()
        setAdditionalServices(servicesData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load necessary data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [hotelId, router])

  // Toggle pet selection
  const togglePetSelection = (petId) => {
    setSelectedPets((prev) => (prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]))
  }

  // Toggle service selection
  const toggleServiceSelection = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  // Calculate number of nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0
    const start = new Date(checkInDate)
    const end = new Date(checkOutDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!hotelDetails) return 0

    const nights = calculateNights()
    const basePrice = hotelDetails.price * nights * selectedPets.length

    // Calculate additional services cost
    const servicesPrice = selectedServices.reduce((total, serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId)
      return total + (service ? service.price : 0)
    }, 0)

    return basePrice + servicesPrice
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (selectedPets.length === 0) {
      setError("Please select at least one pet")
      return
    }

    if (!checkInDate || !checkOutDate) {
      setError("Please select check-in and check-out dates")
      return
    }

    try {
      setIsLoading(true)

      // Prepare booking data to send to Django backend
      const bookingData = {
        user_id: user.id,
        hotel_id: hotelId,
        pets: selectedPets,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        services: selectedServices,
        special_requests: specialRequests,
      }

      // Send booking data to your Next.js API route that will forward to Django
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking")
      }

      // Redirect to booking confirmation page
      router.push(`/bookings/${data.booking_id}/confirmation`)
    } catch (err) {
      console.error("Error creating booking:", err)
      setError(err.message || "Failed to create booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
        <p>{error}</p>
        <button
          onClick={() => router.push(`/login?redirect=/hotels/${hotelId}/booking`)}
          className="mt-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Pet's Stay</h2>

      {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* User Information (Read-only) */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user?.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-medium">{user?.id}</p>
            </div>
          </div>
        </div>

        {/* Pet Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Your Pets</h3>

          {pets.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">You haven't added any pets to your profile yet.</p>
              <a href="/pets/add" className="text-blue-600 hover:text-blue-800 font-medium">
                + Add a Pet
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedPets.includes(pet.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => togglePetSelection(pet.id)}
                >
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
                      {pet.image ? (
                        <img
                          src={pet.image || "/placeholder.svg"}
                          alt={pet.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19.44 10c-.79-2.83-3.16-5-6.44-5s-5.65 2.17-6.44 5m12.88 0c.35.63.44 1.3.44 2 0 1.66-.67 3.16-1.76 4.24l-1.45 1.45a5.5 5.5 0 0 1-7.77 0l-1.45-1.45A5.5 5.5 0 0 1 5 12c0-.7.09-1.37.44-2"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{pet.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {pet.species}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {pet.breed}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {pet.age} years
                        </span>
                      </div>
                    </div>
                    <div className="ml-2">
                      <div
                        className={`h-5 w-5 rounded-full border ${
                          selectedPets.includes(pet.id) ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}
                      >
                        {selectedPets.includes(pet.id) && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 text-right">
            <a href="/pets/add" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              + Add Another Pet
            </a>
          </div>
        </div>

        {/* Booking Dates */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date
              </label>
              <input
                type="date"
                id="check-in"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div>
              <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date
              </label>
              <input
                type="date"
                id="check-out"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate || new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>
        </div>

        {/* Additional Services */}
        {additionalServices.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalServices.map((service) => (
                <div
                  key={service.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedServices.includes(service.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => toggleServiceSelection(service.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-500">{service.description}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 mr-3">${service.price}</span>
                      <div
                        className={`h-5 w-5 rounded-full border ${
                          selectedServices.includes(service.id) ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}
                      >
                        {selectedServices.includes(service.id) && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Requests */}
        <div className="mb-6">
          <label htmlFor="special-requests" className="block text-lg font-medium text-gray-900 mb-2">
            Special Requests
          </label>
          <textarea
            id="special-requests"
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any special requirements or notes for your pet's stay?"
          ></textarea>
        </div>

        {/* Price Summary */}
        {selectedPets.length > 0 && calculateNights() > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Price Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {hotelDetails?.name}: ${hotelDetails?.price} x {calculateNights()} nights x {selectedPets.length}{" "}
                  pet(s)
                </span>
                <span className="font-medium">${hotelDetails?.price * calculateNights() * selectedPets.length}</span>
              </div>

              {selectedServices.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Additional services</span>
                  <span className="font-medium">
                    $
                    {selectedServices.reduce((total, serviceId) => {
                      const service = additionalServices.find((s) => s.id === serviceId)
                      return total + (service ? service.price : 0)
                    }, 0)}
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                <span>Total</span>
                <span>${calculateTotalPrice()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 ${
              isLoading || selectedPets.length === 0 || !checkInDate || !checkOutDate
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading || selectedPets.length === 0 || !checkInDate || !checkOutDate}
          >
            {isLoading ? "Processing..." : "Confirm Booking"}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            By confirming, you agree to our terms and conditions for pet boarding services.
          </p>
        </div>
      </form>
    </div>
  )
}

