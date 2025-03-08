"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import { Star, MapPin } from "lucide-react"

export default function HotelDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [hotel, setHotel] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeImage, setActiveImage] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/user")
        setIsAuthenticated(response.ok)
      } catch (err) {
        console.error("Error checking authentication:", err)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    // Only fetch hotel data when we have the ID from the URL
    if (!id) return

    const fetchHotelData = async () => {
      try {
        setIsLoading(true)

        // In a real app, this would be a call to your Next.js API route that communicates with Django
        const response = await fetch(`/api/hotels/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch hotel details")
        }

        const data = await response.json()
        setHotel(data)
      } catch (err) {
        console.error("Error fetching hotel data:", err)
        setError("Failed to load hotel details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotelData()
  }, [id])

  const handleBookNow = () => {
    if (isAuthenticated) {
      router.push(`/hotels/${id}/booking`)
    } else {
      router.push(`/login?redirect=/hotels/${id}/booking`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || "Hotel not found"}</p>
          <Link href="/hotels">
            <a className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
              Back to Hotels
            </a>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{hotel.name} | PetStay</title>
        <meta name="description" content={hotel.description} />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/hotels">
              <a className="text-blue-600 hover:text-blue-800 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </Link>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
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
              <h1 className="text-xl font-bold text-gray-900">PetStay</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{hotel.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-gray-900 font-medium">{hotel.rating}</span>
              <span className="ml-1 text-gray-500">({hotel.reviews} reviews)</span>
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="h-5 w-5" />
              <span className="ml-1">{hotel.location}</span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative h-[400px] rounded-lg overflow-hidden mb-2">
              <img
                src={hotel.images?.[activeImage] || hotel.image || "/placeholder.svg?height=600&width=800"}
                alt={`${hotel.name} - View ${activeImage + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            {hotel.images && hotel.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {hotel.images.map((image, index) => (
                  <div
                    key={index}
                    className={`h-20 rounded-md overflow-hidden cursor-pointer ${activeImage === index ? "ring-2 ring-blue-600" : ""}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${hotel.name} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Hotel Details */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About {hotel.name}</h2>
                <p className="text-gray-700 mb-6">{hotel.description}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
                    <ul className="space-y-2">
                      {hotel.amenities?.map((amenity, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Pet Types</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.pet_types?.map((type, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 mt-4">Policies</h3>
                    <ul className="space-y-2">
                      {hotel.policies?.map((policy, index) => (
                        <li key={index} className="flex items-start text-gray-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {policy}
                        </li>
                      ))}
                      {!hotel.policies && (
                        <li className="text-gray-700">
                          Check-in time: 2:00 PM - 6:00 PM
                          <br />
                          Check-out time: 10:00 AM - 12:00 PM
                          <br />
                          Pets must be up-to-date on vaccinations
                          <br />
                          Cancellation policy: Full refund if cancelled 48 hours before check-in
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Guest Reviews</h2>

                {hotel.top_reviews ? (
                  <div className="space-y-6">
                    {hotel.top_reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                              {review.user_image ? (
                                <img
                                  src={review.user_image || "/placeholder.svg"}
                                  alt={review.user_name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <svg
                                  className="h-full w-full text-gray-400 p-2"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{review.user_name}</h4>
                              <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 font-medium">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No reviews yet. Be the first to review this hotel after your stay!</p>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                    View all {hotel.reviews} reviews
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Your Pet's Stay</h2>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Price per night</span>
                    <span className="text-2xl font-bold text-gray-900">${hotel.price}</span>
                  </div>
                  <p className="text-sm text-gray-500">Price is per pet, per night</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      id="check-in"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min={new Date().toISOString().split("T")[0]}
                      disabled
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
                      min={new Date().toISOString().split("T")[0]}
                      disabled
                    />
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  Book Now
                </button>

                <p className="text-xs text-gray-500 text-center mt-2">
                  You won't be charged yet. Complete your booking on the next page.
                </p>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Why Book with PetStay?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700">Verified pet-friendly accommodations</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700">24/7 customer support</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700">Free cancellation up to 48 hours before check-in</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
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
                <h3 className="text-xl font-bold text-gray-900">PetStay</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Find the perfect accommodation for your furry friends while you're away.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Pet Care Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Become a Partner
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Contact Us</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Email: support@petstay.com</li>
                <li>Phone: (123) 456-7890</li>
                <li>Address: 123 Pet Street, Pawville, CA 94103</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} PetStay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

