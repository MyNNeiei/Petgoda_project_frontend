// components/ui/card-hotel.jsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin } from "lucide-react"

export default function CardHotel({ hotel }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={hotel.image || "/placeholder.svg?height=200&width=400"}
          alt={hotel.name}
          width={400}
          height={200}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
        />
        {hotel.availability ? (
          <Badge className="absolute top-2 right-2 bg-green-500">Available</Badge>
        ) : (
          <Badge className="absolute top-2 right-2 bg-red-500">Fully Booked</Badge>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-[#886551]">{hotel.name}</CardTitle>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-semibold">{hotel.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{hotel.location}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <CardDescription className="text-sm line-clamp-2 mb-3">{hotel.description}</CardDescription>

        <div className="flex flex-wrap gap-1 mt-2">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="bg-[#f8f5f2] text-[#886551]">
              {amenity}
            </Badge>
          ))}
          {hotel.amenities.length > 3 && (
            <Badge variant="outline" className="bg-[#f8f5f2] text-[#886551]">
              +{hotel.amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="font-bold text-lg">
          ฿{typeof hotel.pricePerNight === "number" ? hotel.pricePerNight.toLocaleString() : hotel.pricePerNight}
          <span className="text-sm font-normal text-gray-500">/night</span>
        </div>
        <Button className="bg-[#886551] hover:bg-[#6e5141]">Book Now</Button>
      </CardFooter>
    </Card>
  )
}

