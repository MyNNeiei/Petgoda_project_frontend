"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axios";
import { Loader2 } from "lucide-react";

export default function FacilitiesTab({ hotel, setHotel }) {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!hotel || !hotel.id) return;

    const fetchFacilities = async () => {
      try {
        console.log(`🔍 Fetching facilities for hotel ID: ${hotel.id}`);
        const response = await axiosInstance.get(`/hotels/${hotel.id}/facilities/`);
        console.log("✅ Fetched Facilities:", response.data);

        setHotel((prevHotel) => ({
          ...prevHotel,
          facilities: response.data,
        }));
      } catch (err) {
        console.error("❌ Error fetching facilities:", err.response?.data || err.message);
        toast({
          title: "Error",
          description:
            err.response?.data?.message || "Failed to load facilities.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [hotel?.id, setHotel]); // Added setHotel to the dependency array

  const handleUpdateFacilities = async () => {
    if (!hotel || !hotel.id) {
      toast({
        title: "Error",
        description: "Hotel ID is missing. Cannot update facilities.",
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);

    try {
      console.log(`🔄 Updating facilities for hotel ID: ${hotel.id}`);
      const response = await axiosInstance.put(
        `/hotels/${hotel.id}/facilities/update/`,
        hotel.facilities
      );
      console.log("✅ Updated Facilities:", response.data);

      toast({
        title: "Success",
        description: "Facilities updated successfully!",
      });

       // Update the local hotel state with the updated facilities.
       setHotel((prevHotel) => ({
          ...prevHotel,
          facilities: response.data,
        }));

    } catch (err) {
      console.log("❌ Error updating facilities:", err.response?.data || err.message);
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to update facilities.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Facilities</h2>

        {loading ? (
          <div className="text-center py-8">Loading facilities...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: "wifi", key: "has_wifi", label: "WiFi" },
              { id: "pool", key: "has_swimming_pool", label: "Swimming Pool" },
              {
                id: "veterinary",
                key: "has_veterinary_services",
                label: "Veterinary Services",
              },
              {
                id: "grooming",
                key: "has_grooming_services",
                label: "Grooming Services",
              },
              {
                id: "training",
                key: "has_training_services",
                label: "Training Services",
              },
              { id: "playground", key: "has_playground", label: "Playground" },
              {
                id: "outdoor",
                key: "has_outdoor_area",
                label: "Outdoor Area",
              },
              {
                id: "transport",
                key: "has_transport_services",
                label: "Transport Services",
              },
              {
                id: "emergency",
                key: "has_emergency_services",
                label: "Emergency Services",
              },
              {
                id: "cafe",
                key: "has_pet_friendly_cafe",
                label: "Pet-Friendly Cafe",
              },
              { id: "spa", key: "has_pet_spa", label: "Pet Spa" },
              {
                id: "diet",
                key: "has_special_diet_options",
                label: "Special Diet Options",
              },
              { id: "24h_support", key: "has_24h_support", label: "24H Support" },
              {
                id: "group_play",
                key: "has_group_play_sessions",
                label: "Group Play Sessions",
              },
              {
                id: "taxi",
                key: "has_pet_taxi_service",
                label: "Pet Taxi Service",
              },
              {
                id: "fitness",
                key: "has_pet_fitness_center",
                label: "Pet Fitness Center",
              },
              {
                id: "photo",
                key: "has_pet_photography",
                label: "Pet Photography",
              },
              {
                id: "party",
                key: "has_pet_party_services",
                label: "Pet Party Services",
              },
            ].map((facility) => (
              <div key={facility.id} className="flex items-center gap-2">
                <Checkbox
                  id={facility.id}
                  checked={hotel?.facilities?.[facility.key] || false}
                  onCheckedChange={(checked) =>
                    setHotel((prevHotel) => ({
                      ...prevHotel,
                      facilities: {
                        ...prevHotel.facilities,
                        [facility.key]: checked,
                      },
                    }))
                  }
                />
                <Label htmlFor={facility.id}>{facility.label}</Label>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={handleUpdateFacilities} disabled={updating}>
            {updating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}