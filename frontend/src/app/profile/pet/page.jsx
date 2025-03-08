"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import axiosInstance from "@/utils/axios"
import AddPetForm from "../add-pet/add-pet" // ✅ Import AddPetForm

export default function PetProfile({ pets, onUpdate }) {
  const [deletingPetId, setDeletingPetId] = useState(null)

  const handleDelete = async (petId) => {
    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this pet?")) {
      return
    }

    setDeletingPetId(petId)

    try {
      await axiosInstance.delete(`api/pet/delete/${petId}`, {
        withCredentials: true,
      })

      toast({
        title: "Success",
        description: "Pet deleted successfully",
      })

      // Call the onUpdate callback to refresh the pet list
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error("Error deleting pet:", error)
      toast({
        title: "Error",
        description: "Failed to delete pet",
        variant: "destructive",
      })
    } finally {
      setDeletingPetId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* ✅ Show "No Pets" message with Add Pet button */}
      {pets.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <p>No pets added yet. Click "Add Pet" to register your first pet.</p>
            <div className="mt-4 flex justify-center">
              <AddPetForm onSuccess={onUpdate} /> {/* ✅ "Add Pet" Button */}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {pets.map((pet) => (
            <Card key={pet.id} className="bg-[#D2C8BC]">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={pet.avatar || "/default-pet.png"} alt={pet.name} />
                  <AvatarFallback>{pet.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{pet.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {pet.pettype === "D" ? "Dog" : pet.pettype === "C" ? "Cat" : pet.pettype} • {pet.birth_date}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Age</p>
                    <p className="text-sm text-muted-foreground">{pet.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Weight</p>
                    <p className="text-sm text-muted-foreground">{pet.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Height</p>
                    <p className="text-sm text-muted-foreground">{pet.height} cm</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Medical History</p>
                  <p className="text-sm text-muted-foreground">{pet.allegic || "No allergies recorded"}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleDelete(pet.id)}
                  disabled={deletingPetId === pet.id}
                >
                  {deletingPetId === pet.id ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </>
      )}
    </div>
  )
}

