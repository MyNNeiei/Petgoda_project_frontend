"use client"

import { useState } from "react"
import PropTypes from "prop-types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createPet } from "@/utils/apiPets"
import { PlusCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function AddPetForm({ profileId, onSuccess }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      formData.append("profile", profileId.toString())

      await createPet(formData)
      toast({
        title: "Success",
        description: "Pet added successfully",
      })
      setOpen(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add pet",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-[#D2C8BC] hover:bg-[#c4bab0] text-black">
          <PlusCircle className="h-4 w-4" />
          Add Pet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]" style={{ backgroundColor: "#D2C8BC" }}>
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl text-black">Add New Pet</DialogTitle>
          <DialogDescription className="text-gray-700">
            Fill in your pet's information. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-medium text-black">
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Pet's name"
                className="bg-white/90 border-gray-300 text-black placeholder:text-gray-500"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="breed" className="font-medium text-black">
                Breed *
              </Label>
              <Input
                id="breed"
                name="breed"
                placeholder="Pet's breed"
                className="bg-white/90 border-gray-300 text-black placeholder:text-gray-500"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="age" className="font-medium text-black">
                Age *
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Years"
                className="bg-white/90 border-gray-300 text-black placeholder:text-gray-500"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight" className="font-medium text-black">
                Weight (kg) *
              </Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                placeholder="0.0"
                className="bg-white/90 border-gray-300 text-black placeholder:text-gray-500"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color" className="font-medium text-black">
                Color *
              </Label>
              <Input
                id="color"
                name="color"
                placeholder="Pet's color"
                className="bg-white/90 border-gray-300 text-black placeholder:text-gray-500"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="about" className="font-medium text-black">
              About
            </Label>
            <Textarea
              id="about"
              name="about"
              placeholder="Tell us about your pet..."
              className="bg-white/90 border-gray-300 text-black placeholder:text-gray-500 resize-none min-h-[100px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="emergency_contact" className="font-medium text-black">
              Emergency Contact *
            </Label>
            <Input
              id="emergency_contact"
              name="emergency_contact"
              placeholder="Contact information"
              className="bg-white/90 border-gray-300 text-black placeholder:text-gray-500"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-row items-center justify-between rounded-lg border border-gray-300 bg-white/90 p-4">
              <div className="space-y-0.5">
                <Label htmlFor="vaccinated" className="font-medium text-black">
                  Vaccinated
                </Label>
                <div className="text-sm text-gray-600">Has your pet been vaccinated?</div>
              </div>
              <Switch id="vaccinated" name="vaccinated" />
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border border-gray-300 bg-white/90 p-4">
              <div className="space-y-0.5">
                <Label htmlFor="neutered" className="font-medium text-black">
                  Neutered
                </Label>
                <div className="text-sm text-gray-600">Has your pet been neutered?</div>
              </div>
              <Switch id="neutered" name="neutered" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image" className="font-medium text-black">
              Pet Image
            </Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="bg-white/90 border-gray-300 text-black cursor-pointer file:bg-[#D2C8BC] file:text-black file:border-0"
            />
            <p className="text-sm text-gray-600">Supported formats: JPG, PNG, GIF (max 5MB)</p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-white text-black border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[100px] bg-[#D2C8BC] hover:bg-[#c4bab0] text-black"
            >
              {loading ? "Adding..." : "Add Pet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

AddPetForm.propTypes = {
  profileId: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
}

