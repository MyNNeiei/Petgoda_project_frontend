import Image from "next/image";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/navbar/headernav";
import HotelGrid from "@/components/hotel-grid";
import Testimonials from "@/components/testimonials";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, PawPrint, Clock, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen m-0">
      <Navbar />
      <div className="bg-[#D2C8BC] px-4 py-10 w-full mx-auto">
        <span className="flex flex-col md:flex-row items-center justify-center py-5 mt-10">
          <h1 className="text-[#5c3925] text-4xl md:text-6xl font-bold text-center mb-8">Hotel, For Your Love</h1>
        </span>
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="text-lg text-[#4a3a2e]">
            Premium pet accommodations with personalized care. Your furry friend deserves a vacation too!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button className="bg-[#886551] hover:bg-[#6e5141] text-white px-6 py-4 text-sm md:text-lg">
              Reserve Now
            </Button>
            <Button variant="outline" className="border-[#886551] text-[#886551] hover:bg-[#f8f5f2] px-6 py-4 text-sm md:text-lg">
              View Our Hotels
            </Button>
          </div>
        </div>
        <div className="flex justify-center mt-10 space-x-4 relative z-10">
          <Image 
            src="/pngegg.png" 
            alt="Dog" 
            width={800} 
            height={400} 
            className="h-auto max-w-full mb-[-155px] md:none" 
            priority
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="my-20 px-4 container mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-8">How It Works</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[{
            title: "Booking Services",
            icon: <PawPrint className="h-5 w-5 mr-2 text-[#886551]" />,
            details: ["Select accommodations, dates, and services for your pet", "Provide necessary details (dietary needs, special care)"]
          }, {
            title: "Select a location",
            icon: <MapPin className="h-5 w-5 mr-2 text-[#886551]" />,
            details: ["Find the nearest and highest-quality pet hotels", "Choose from available dates and room types"]
          }, {
            title: "Tracking Pet Stay",
            icon: <Clock className="h-5 w-5 mr-2 text-[#886551]" />,
            details: ["Get real-time updates on your pet's activities", "Check live updates, photos, or camera feeds"]
          }].map((item, index) => (
            <div key={index} className="bg-[#f8f5f2] p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-[#886551] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-center font-semibold text-xl text-[#262721] mb-4">{item.title}</h3>
              <ul className="space-y-2 text-gray-700">
                {item.details.map((detail, i) => (
                  <li key={i} className="flex items-start">
                    {item.icon}
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Hotels Section */}
      <div className="my-20 px-4 container mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-8">Recommended Hotels</h1>
        <HotelGrid />
      </div>

      {/* CTA Section */}
      <div className="bg-[#f8f5f2] py-12 px-6">
        <div className="container mx-0 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Reservation Your Pet's Getaway?</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Give your furry friend the vacation they deserve. Our pet hotels provide comfort, care, and fun activities while you're away.
          </p>
          <Button className="bg-[#886551] hover:bg-[#6e5141] text-lg px-6 py-4 md:px-8 md:py-6 sm:px-2 sm:py-2 sm:text-sm">
          Reservation Stay Now
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
