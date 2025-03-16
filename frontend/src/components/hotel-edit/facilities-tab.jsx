"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2 } from "lucide-react"
import axiosInstance from "@/utils/axios"
import { useToast } from "@/hooks/use-toast"

export default function FacilitiesTab({ hotel, setHotel }) {
  const [loading, setLoading] = useState(true)
  const [facilities, setFacilities] = useState(null)
  const [error, setError] = useState(null)
  const [updatingFacilities, setUpdatingFacilities] = useState({})
  const { toast } = useToast()

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        if (!hotel || !hotel.id) return

        const response = await axiosInstance.get(`/api/hotels/${hotel.id}/facilities`)

        if (response.data) {
          setFacilities(response.data) // ✅ Fixed setting facilities correctly
        } else {
          setFacilities(null)
        }
        setLoading(false)
      } catch (err) {
        console.error("❌ Error fetching facilities:", err)
        setError("Failed to load hotel facilities.")
        setLoading(false)
      }
    }

    fetchFacilities()
  }, [hotel])

  const handleFacilityChange = async (facilityKey, isChecked) => {
    if (!facilities || !hotel || !hotel.id) return

    setUpdatingFacilities((prev) => ({
      ...prev,
      [facilityKey]: true,
    }))

    const updatedFacilities = {
      ...facilities,
      [facilityKey]: isChecked,
    }

    setFacilities(updatedFacilities)

    try {
      await axiosInstance.put(`/api/hotels/facilities/${hotel.id}/update`, updatedFacilities)

      setHotel((prevHotel) => ({
        ...prevHotel,
        facilities: updatedFacilities,
      }))

      toast({
        title: "Success",
        description: `${facilityLabels[facilityKey]} updated successfully!`,
      })
    } catch (err) {
      console.error("❌ Error updating facility:", err)

      setFacilities((prev) => ({
        ...prev,
        [facilityKey]: !isChecked,
      }))

      toast({
        title: "Error",
        description: "Failed to update facility. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingFacilities((prev) => ({
        ...prev,
        [facilityKey]: false,
      }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <p>Loading facilities...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  if (!facilities) {
    return (
      <div className="text-center text-gray-600 py-6">
        <p>No facilities available for this hotel.</p>
      </div>
    )
  }

  // Facility labels with descriptions
  const facilityLabels = {
    has_veterinary_services: "Veterinary Services",
    has_grooming_services: "Grooming Services",
    has_training_services: "Training Services",
    has_swimming_pool: "Swimming Pool",
    has_playground: "Playground",
    has_outdoor_area: "Outdoor Area",
    has_transport_services: "Transport Services",
    has_emergency_services: "Emergency Services",
    has_pet_friendly_cafe: "Pet-Friendly Cafe",
    has_pet_spa: "Pet Spa",
    has_special_diet_options: "Special Diet Options",
    has_24h_support: "24-Hour Support",
    has_group_play_sessions: "Group Play Sessions",
    has_pet_taxi_service: "Pet Taxi Service",
    has_pet_fitness_center: "Pet Fitness Center",
    has_pet_photography: "Pet Photography",
    has_pet_party_services: "Pet Party Services",
  }

  return (
    <div className="bg-white border rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Hotel Facilities</h2>
      <p className="text-muted-foreground mb-4">
        Select the facilities your hotel offers. Changes are saved automatically.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(facilityLabels).map((facilityKey) => (
          <div
            key={facilityKey}
            className={`flex items-start space-x-2 p-3 rounded-md transition-all ${
              facilities[facilityKey] ? "bg-primary/5" : "bg-gray-100"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {updatingFacilities[facilityKey] ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Checkbox
                  id={facilityKey}
                  checked={facilities[facilityKey] || false}
                  onCheckedChange={(checked) => handleFacilityChange(facilityKey, checked)}
                  disabled={Object.values(updatingFacilities).some(Boolean)}
                />
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor={facilityKey} className="font-medium cursor-pointer">
                {facilityLabels[facilityKey]}
              </Label>
              {facilities[facilityKey] && !updatingFacilities[facilityKey] && (
                <div className="flex items-center text-xs text-primary mt-1">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  <span>Enabled</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
