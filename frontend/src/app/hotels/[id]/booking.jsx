"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/navbar/headernav";
import Footer from "@/components/ui/footer";

export default function BookingPage() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [pets, setPets] = useState([]);
  const [selectedPets, setSelectedPets] = useState([]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [additionalServices, setAdditionalServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [specialRequests, setSpecialRequests] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch User Data
        const userResponse = await fetch("/api/auth/user");
        if (userResponse.status === 401) {
          router.push(`/login?redirect=/hotels/${id}/booking`);
          return;
        }
        if (!userResponse.ok) throw new Error("Failed to fetch user data");

        const userData = await userResponse.json();
        setUser(userData);

        // Fetch Pets
        const petsResponse = await fetch(`/api/pets?userId=${userData.id}`);
        if (!petsResponse.ok) throw new Error("Failed to fetch pets");
        setPets(await petsResponse.json());

        // Fetch Hotel Details
        const hotelResponse = await fetch(`/api/hotels/${id}`);
        if (!hotelResponse.ok) throw new Error("Failed to fetch hotel details");
        setHotel(await hotelResponse.json());

        // Fetch Additional Services
        const servicesResponse = await fetch(`/api/hotels/${id}/services`);
        if (!servicesResponse.ok) throw new Error("Failed to fetch services");
        setAdditionalServices(await servicesResponse.json());
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load necessary data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Toggle pet selection
  const togglePetSelection = (petId) => {
    setSelectedPets((prev) => 
      prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]
    );
  };

  // Toggle service selection
  const toggleServiceSelection = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  // Calculate number of nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!hotel) return 0;

    const nights = calculateNights();
    const basePrice = hotel.price * nights * selectedPets.length;
    const servicesPrice = selectedServices.reduce((total, serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);

    return basePrice + servicesPrice;
  };

  // Handle Booking Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPets.length) return setError("Please select at least one pet");
    if (!checkInDate || !checkOutDate) return setError("Please select check-in and check-out dates");

    try {
      setIsLoading(true);
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          hotel_id: Number(id),
          pets: selectedPets,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          services: selectedServices,
          special_requests: specialRequests,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create booking");

      router.push(`/bookings/${data.id}/confirmation`);
    } catch (err) {
      console.error("Error creating booking:", err);
      setError(err.message || "Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Head>
        <title>Book Your Stay at {hotel?.name || "Pet Hotel"} | PetStay</title>
        <meta name="description" content={`Book a stay for your pet at ${hotel?.name || "our pet hotel"}.`} />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Booking: {hotel?.name}</h1>

        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mt-4">
          <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
          <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="w-full border p-2 rounded-lg" required />

          <label className="block mt-4 text-sm font-medium text-gray-700">Check-out Date</label>
          <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="w-full border p-2 rounded-lg" required />

          <h3 className="mt-6 text-lg font-semibold">Total Price: ${calculateTotalPrice()}</h3>

          <button type="submit" className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Confirm Booking
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
