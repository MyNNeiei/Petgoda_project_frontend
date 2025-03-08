"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import axiosInstance from "@/utils/axios";
import Navbar from "@/components/navbar/headernav";

export default function AllHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/hotels/");
        console.log("✅ Fetched Hotels:", response.data); // ✅ Debugging API response

        // ✅ Filter only verified hotels
        const verifiedHotels = response.data.filter((hotel) => hotel.is_verified);
        setHotels(verifiedHotels);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError("Failed to load hotels. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading hotels...</p>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
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
          {hotels
            .filter((hotel) => hotel.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/hotels/${hotel.id}`} className="block">
                  <div className="relative h-48">
                    <img
                      src={hotel.image_url || "/placeholder.svg"} // ✅ Fixed `hotel.image_url`
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{hotel.name}</h3>
                  <p className="text-muted-foreground text-sm">{hotel.address}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{hotel.rating}</span>
                    <span className="text-muted-foreground">({hotel.total_review} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="h-3 w-3" />
                    <span>{hotel.address}</span> {/* ✅ Updated to use `hotel.address` */}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-lg">${hotel.price_per_night}</span> {/* ✅ Fixed price field */}
                    <span className="text-muted-foreground text-sm"> / night</span>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/hotels/${hotel.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>

        {/* No Results Message */}
        {hotels.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No verified pet hotels found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
