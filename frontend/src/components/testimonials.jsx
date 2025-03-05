// components/testimonials.jsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Somchai L.",
    avatar: "/avatar1.jpg", // Replace with actual image path or use placeholder
    pet: "Golden Retriever",
    comment:
      "My Bingo had the best time at Pawsome Paradise! The staff treated him like royalty, and the daily photos kept me updated. He came back happy and well-groomed.",
    rating: 5,
  },
  {
    id: 2,
    name: "Nattaporn K.",
    avatar: "/avatar2.jpg",
    pet: "Persian Cat",
    comment:
      "Elegant Whiskers was perfect for my picky Persian. The special cat accommodations and quiet environment made her stay stress-free. Will definitely book again!",
    rating: 5,
  },
  {
    id: 3,
    name: "Thanawat J.",
    avatar: "/avatar3.jpg",
    pet: "Pomeranian",
    comment:
      "Furry Friends Inn was amazing! They accommodated my Pom's special diet needs and sent me videos of his playtime. The grooming service was a nice bonus too.",
    rating: 4,
  },
  {
    id: 4,
    name: "Pitchaya S.",
    avatar: "/avatar4.jpg",
    pet: "French Bulldog",
    comment:
      "The Waggin' Wellness Center was exactly what my senior Frenchie needed. Their medical staff was attentive to his arthritis, and he received proper care.",
    rating: 5,
  },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="py-16 bg-[#f8f5f2]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">What Pet Parents Say</h2>

        <div className="flex overflow-hidden relative">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="relative w-12 h-12 mr-4 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg?height=100&width=100"}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">Pet: {testimonial.pet}</p>
                      </div>
                    </div>

                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-500" : "text-gray-300"}`}
                          fill={i < testimonial.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`mx-1 w-3 h-3 rounded-full ${index === activeIndex ? "bg-[#886551]" : "bg-[#D2C8BC]"}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

