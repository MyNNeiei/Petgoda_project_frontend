import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Plus } from "lucide-react";
import AddPetForm from "../add-pet/add-pet"; // ✅ Import AddPetForm

export default function PetProfile({ pets, onUpdate }) {
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
          <div className="flex justify-end">
            <AddPetForm onSuccess={onUpdate} /> {/* ✅ "Add Pet" Button */}
          </div>
          {pets.map((pet) => (
            <Card key={pet.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={pet.avatar || "/default-pet.png"} alt={pet.name} />
                  <AvatarFallback>{pet.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{pet.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {pet.pettype} • {pet.birth_date}
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
                  <p className="text-sm text-muted-foreground">
                    {pet.allegic || "No allergies recorded"}
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Pet
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
