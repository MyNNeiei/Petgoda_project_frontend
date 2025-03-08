"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios"; // ✅ Use API data
import CardHotel from "@/components/ui/card-hotel";
import { Button } from "@/components/ui/button";

export default function HotelGrid() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/hotels/");
        // ✅ Remove rating from the hotel data
        const hotelsWithoutRating = response.data.map((hotel) => {
          const { rating, ...hotelWithoutRating } = hotel;
          return hotelWithoutRating;
        });

        setHotels(hotelsWithoutRating);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError("Failed to load hotels. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="space-y-6">
      {/* ✅ Page Heading */}

      {/* ✅ Hotel Grid */}
      <div className="container mx-auto">
        {loading ? (
          <p className="text-center text-gray-600">Loading hotels...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <CardHotel key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500">No hotels found.</p>
        )}
      </div>

      {/* ✅ Load More Button (If needed in the future) */}
      {hotels.length > 0 && (
        <div className="flex justify-center mt-10">
          <Button variant="outline" className="border-[#886551] text-[#886551] hover:bg-[#f8f5f2]">
            Load More Hotels
          </Button>
        </div>
      )}
    </div>
  );
}
