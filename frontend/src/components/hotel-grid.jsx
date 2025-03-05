"use client"

import { useState, useEffect } from "react"
import CardHotel from "@/components/ui/card-hotel";
import { hotelData } from "@/utils/mockData"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, MapPin, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function HotelGrid() {
  const [filteredHotels, setFilteredHotels] = useState(hotelData)
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedLocation, setSelectedLocation] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Get unique locations for filter
  const locations = [...new Set(hotelData.map((hotel) => hotel.location.split(",")[0].trim()))]

  const applyFilters = () => {
    let filtered = hotelData

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply price range filter
    filtered = filtered.filter((hotel) => hotel.pricePerNight >= priceRange[0] && hotel.pricePerNight <= priceRange[1])

    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter((hotel) => hotel.location.split(",")[0].trim() === selectedLocation)
    }

    // Apply tab filter
    if (activeTab === "featured") {
      filtered = filtered.filter((hotel) => hotel.rating >= 4.7)
    } else if (activeTab === "special") {
      filtered = filtered.filter((hotel) =>
        hotel.amenities.some((a) => a.includes("Medical") || a.includes("Special") || a.includes("Rehabilitation")),
      )
    } else if (activeTab === "luxury") {
      filtered = filtered.filter((hotel) => hotel.pricePerNight >= 1200)
    }

    setFilteredHotels(filtered)
  }

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters()
  }, [searchQuery, priceRange, selectedLocation, activeTab])

  const resetFilters = () => {
    setSearchQuery("")
    setPriceRange([0, 2000])
    setSelectedLocation("")
    setFilteredHotels(hotelData)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10 border-[#D2C8BC] focus:border-[#886551] focus:ring-[#886551]"
            placeholder="Search for pet hotels"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="border-[#D2C8BC] w-full md:w-auto"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-[#D2C8BC] rounded-md bg-[#F9F7F5]">
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" /> Location
            </Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all locations">All locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" /> Price Range (฿{priceRange[0]} - ฿{priceRange[1]})
            </Label>
            <Slider min={0} max={2000} step={100} value={priceRange} onValueChange={setPriceRange} className="py-4" />
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full border-[#886551] text-[#886551] hover:bg-[#f8f5f2]"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full bg-[#F9F7F5] grid grid-cols-4">
          <TabsTrigger value="all">All Hotels</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="special">Special Needs</TabsTrigger>
          <TabsTrigger value="luxury">Luxury</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {filteredHotels.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">Showing {filteredHotels.length} hotels</p>
                <div className="flex gap-2">
                  {searchQuery && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Search: {searchQuery}
                      <button className="ml-1 text-xs" onClick={() => setSearchQuery("")}>
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedLocation && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Location: {selectedLocation}
                      <button className="ml-1 text-xs" onClick={() => setSelectedLocation("")}>
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <CardHotel key={hotel.id} hotel={hotel} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">No hotels found matching your criteria.</p>
              <Button variant="link" className="text-[#886551] mt-2" onClick={resetFilters}>
                Reset filters
              </Button>
            </div>
          )}
        </div>
      </Tabs>

      {filteredHotels.length > 0 && (
        <div className="flex justify-center mt-10">
          <Button variant="outline" className="mx-auto border-[#886551] text-[#886551] hover:bg-[#f8f5f2]">
            Load More Hotels
          </Button>
        </div>
      )}
    </div>
  )
}

