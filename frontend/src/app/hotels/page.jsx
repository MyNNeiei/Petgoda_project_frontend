import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin, Wifi, Car, Coffee } from "lucide-react"
import Image from "next/image"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// This would be replaced with your actual Django API endpoint
const API_URL = "http://localhost:8000/api/hotels/"

async function getHotels(page = 1, search = "") {
  try {
    const response = await fetch(`${API_URL}?page=${page}&search=${search}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.json()
  } catch (error) {
    console.error("Error fetching hotels:", error)
    return { results: [], count: 0 }
  }
}

export default async function HotelsPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1
  const search = searchParams?.search || ""

  // This would be actual data from your Django backend
  const hotels = [
    {
      id: 1,
      name: "Grand Hotel",
      location: "New York City",
      rating: 4.5,
      price: 299,
      image: "/placeholder.svg",
      amenities: ["wifi", "parking", "restaurant"],
    },
    {
      id: 2,
      name: "Seaside Resort",
      location: "Miami Beach",
      rating: 4.8,
      price: 399,
      image: "/placeholder.svg",
      amenities: ["wifi", "parking", "restaurant"],
    },
    {
      id: 3,
      name: "Mountain Lodge",
      location: "Aspen",
      rating: 4.6,
      price: 499,
      image: "/placeholder.svg",
      amenities: ["wifi", "parking", "restaurant"],
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Find Your Perfect Hotel</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input placeholder="Search hotels..." className="flex-1" defaultValue={search} />
            <Select defaultValue="price">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
            <Button>Search</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{hotel.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hotel.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="ml-1 font-medium">{hotel.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {hotel.amenities.includes("wifi") && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Wifi className="w-4 h-4 mr-1" />
                      Wifi
                    </div>
                  )}
                  {hotel.amenities.includes("parking") && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Car className="w-4 h-4 mr-1" />
                      Parking
                    </div>
                  )}
                  {hotel.amenities.includes("restaurant") && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Coffee className="w-4 h-4 mr-1" />
                      Restaurant
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="text-lg font-bold">
                  ${hotel.price}
                  <span className="text-sm font-normal text-muted-foreground">/night</span>
                </div>
                <Button>Book Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

