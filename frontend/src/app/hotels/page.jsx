"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { Search, Star, MapPin, Filter, ChevronDown } from "lucide-react";
import Navbar from "@/components/navbar/headernav";
import Footer from "@/components/ui/footer";
export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedPetTypes, setSelectedPetTypes] = useState([]);
  const [allPetTypes, setAllPetTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/hotels");

        if (!response.ok) {
          throw new Error("Failed to fetch hotels");
        }

        const data = await response.json();
        if (data?.length) {
          setHotels(data);
          setAllPetTypes(Array.from(new Set(data.flatMap((hotel) => hotel.pet_types || []))));
        }
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError("Failed to load hotels. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Memoized Filtering Logic (for better performance)
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
      const matchesPetTypes =
        selectedPetTypes.length === 0 || selectedPetTypes.some((type) => hotel.pet_types?.includes(type));

      return matchesSearch && matchesPrice && matchesPetTypes;
    });
  }, [searchTerm, priceRange, selectedPetTypes, hotels]);

  const togglePetType = (type) => {
    setSelectedPetTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 500]);
    setSelectedPetTypes([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Head>
        <title>Pet Hotels | Find the Perfect Stay for Your Furry Friend</title>
        <meta
          name="description"
          content="Browse and book the best pet hotels for your dogs, cats, and other pets. Filter by amenities, location, and price."
        />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">{filteredHotels.length} Pet Hotels Available</h2>
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-md mx-auto mb-6">
          <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
          <input
            type="search"
            className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search pet hotels by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtered Hotels List */}
        {filteredHotels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <div key={hotel.id} className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition">
                <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="h-48 w-full object-cover rounded" />
                <h3 className="font-semibold text-lg mt-2">{hotel.name}</h3>
                <p className="text-gray-600">{hotel.location}</p>
                <p className="text-gray-900 font-bold">${hotel.price} / night</p>
                <p className="text-sm text-gray-500">⭐ {hotel.rating} ({hotel.reviews} reviews)</p>

                <Link href={`/hotels/${hotel.id}`} passHref>
                  <a className="block mt-3 bg-blue-600 text-white p-2 text-center rounded hover:bg-blue-700 transition">
                    View Details
                  </a>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-8">
            <p>No pet hotels found.</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredHotels.length > 8 && (
          <div className="mt-8 flex justify-center">
            <button className="border px-4 py-2 rounded-lg bg-white hover:bg-gray-100 flex items-center gap-2">
              Load More <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
