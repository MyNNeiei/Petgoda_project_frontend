import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function FacilitiesTab({ hotel, setHotel }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Facilities</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="wifi"
              checked={hotel?.facilities?.has_wifi || false}
              onCheckedChange={(checked) =>
                setHotel({
                  ...hotel,
                  facilities: {
                    ...hotel.facilities,
                    has_wifi: checked,
                  },
                })
              }
            />
            <Label htmlFor="wifi">WiFi</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="pool"
              checked={hotel?.facilities?.has_swimming_pool || false}
              onCheckedChange={(checked) =>
                setHotel({
                  ...hotel,
                  facilities: {
                    ...hotel.facilities,
                    has_swimming_pool: checked,
                  },
                })
              }
            />
            <Label htmlFor="pool">Swimming Pool</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="veterinary"
              checked={hotel?.facilities?.has_veterinary_services || false}
              onCheckedChange={(checked) =>
                setHotel({
                  ...hotel,
                  facilities: {
                    ...hotel.facilities,
                    has_veterinary_services: checked,
                  },
                })
              }
            />
            <Label htmlFor="veterinary">Veterinary Services</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="grooming"
              checked={hotel?.facilities?.has_grooming_services || false}
              onCheckedChange={(checked) =>
                setHotel({
                  ...hotel,
                  facilities: {
                    ...hotel.facilities,
                    has_grooming_services: checked,
                  },
                })
              }
            />
            <Label htmlFor="grooming">Grooming Services</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="training"
              checked={hotel?.facilities?.has_training_services || false}
              onCheckedChange={(checked) =>
                setHotel({
                  ...hotel,
                  facilities: {
                    ...hotel.facilities,
                    has_training_services: checked,
                  },
                })
              }
            />
            <Label htmlFor="training">Training Services</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="playground"
              checked={hotel?.facilities?.has_playground || false}
              onCheckedChange={(checked) =>
                setHotel({
                  ...hotel,
                  facilities: {
                    ...hotel.facilities,
                    has_playground: checked,
                  },
                })
              }
            />
            <Label htmlFor="playground">Playground</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="outdoor"
              checked={hotel?.facilities?.has_outdoor_area || false}
              onCheckedChange={(checked) =>
                setHotel({
                  ...hotel,
                  facilities: {
                    ...hotel.facilities,
                    has_outdoor_area: checked,
                  },
                })
              }
            />
            <Label htmlFor="outdoor">Outdoor Area</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="transport"
              checked={hotel?.facilities?.has_transport_services || false}
              onCheckedChange={(checked) =>
                setHotel({
                  ...hotel,
                  facilities: {
                    ...hotel.facilities,
                    has_transport_services: checked,
                  },
                })
              }
            />
            <Label htmlFor="transport">Transport Services</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="emergency"
              checked={hotel?.facilities?.has_emergency_services || false}
              onCheckedChange={(checked) =>
                setHotel({
                  ...hotel,
                  facilities: {
                    ...hotel.facilities,
                    has_emergency_services: checked,
                  },
                })
              }
            />
            <Label htmlFor="emergency">Emergency Services</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="cafe"
              checked={hotel?.facilities?.has_pet_friendly_cafe || false}
              onCheckedChange={(checked) =>
                setHotel({
                  ...hotel,
                  facilities: {
                    ...hotel.facilities,
                    has_pet_friendly_cafe: checked,
                  },
                })
              }
            />
            <Label htmlFor="cafe">Pet-Friendly Cafe</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="spa"
              checked={hotel?.facilities?.has_pet_spa || false}
              onCheckedChange={(checked) =>
                setHotel({
                  ...hotel,
                  facilities: {
                    ...hotel.facilities,
                    has_pet_spa: checked,
                  },
                })
              }
            />
            <Label htmlFor="spa">Pet Spa</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="diet"
              checked={hotel?.facilities?.has_special_diet_options || false}
              onCheckedChange={(checked) =>
                setHotel({
                  ...hotel,
                  facilities: {
                    ...hotel.facilities,
                    has_special_diet_options: checked,
                  },
                })
              }
            />
            <Label htmlFor="diet">Special Diet Options</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

