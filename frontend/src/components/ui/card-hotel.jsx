"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";

export default function CardHotel({ hotel }) {
  const [isHovered, setIsHovered] = useState(false);

  // Handle missing data with defaults
  const {
    id = "",
    name = "Hotel Name",
    image,
    availability = true,
    rating = "N/A",
    location = "Location not available",
    description = "No description available",
    amenities = [],
    pricePerNight = "N/A",
  } = hotel || {};

  // ✅ Ensure image URLs are properly formatted
  const formattedImage = image
    ? image.startsWith("http")
      ? image
      : `http://localhost:8000${image}`
    : "/placeholder.svg?height=200&width=400";

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-[#886551]">{name}</CardTitle>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-semibold">{rating}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
      </CardHeader>

      <CardContent className="p-2">
        <CardDescription className="text-sm line-clamp-2 mb-3">{description}</CardDescription>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {Array.isArray(amenities) && amenities.length > 0 && (
            <>
              {amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="outline" className="bg-[#f8f5f2] text-[#886551]">
                  {amenity}
                </Badge>
              ))}
              {amenities.length > 3 && (
                <Badge variant="outline" className="bg-[#f8f5f2] text-[#886551]">
                  +{amenities.length - 3} more
                </Badge>
              )}
            </>
          )}
        </div>
        <div className="relative w-full">
        {availability ? (
          <Badge className="absolute bottom-2 right-2 bg-green-500 text-white">Available</Badge>
        ) : (
          <Badge className="absolute bottom-2 right-2 bg-red-500 text-white">Fully Booked</Badge>
        )}
      </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="font-bold text-lg">
          ฿{typeof pricePerNight === "number" ? pricePerNight.toLocaleString() : pricePerNight}
          <span className="text-sm font-normal text-gray-500">/night</span>
        </div>
        <Button className="bg-[#886551] hover:bg-[#6e5141]" asChild>
          <Link href={`/hotels/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
