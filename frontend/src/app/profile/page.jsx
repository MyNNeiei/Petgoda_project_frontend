"use client"

import { useEffect, useState, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Mail, MapPin, Phone, User2 } from "lucide-react"
import { AddPetForm } from "./add_pet/add-pet-form"
import { fetchProfile, fetchPets } from "@/utils/apiPets"
import { toast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    try {
      // Assuming we're loading profile ID 1 for this example
      const profileData = await fetchProfile(1)
      setProfile(profileData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    }
  }, [])

  const loadPets = useCallback(async () => {
    try {
      const petsData = await fetchPets()
      setPets(petsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
    loadPets()
  }, [loadProfile, loadPets])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto my-10 py-10 px-4">
      <Navbar />
      <Tabs defaultValue="person" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="person">Person Profile</TabsTrigger>
          <TabsTrigger value="pet">Pet Profile</TabsTrigger>
        </TabsList>

        <div className="flex justify-end mb-4">
          <AddPetForm profileId={profile?.id} onSuccess={loadPets} />
        </div>

        <TabsContent value="person">
          <Card>
            <CardHeader className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profile?.avatar || "/placeholder.svg?height=128&width=128"} alt="Person profile" />
                  <AvatarFallback>
                    <User2 className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-2">
                  <CardTitle className="text-2xl">{profile?.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {profile?.location}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {profile?.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {profile?.phone}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">About</h3>
                  <p className="text-sm text-muted-foreground">{profile?.about}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pet">
          {pets.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No pets added yet. Click the "Add Pet" button to add your first pet.
              </CardContent>
            </Card>
          ) : (
            pets.map((pet) => (
              <Card key={pet.id} className="mb-6">
                <CardHeader className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage
                        src={pet.image || "/placeholder.svg?height=128&width=128"}
                        alt={`${pet.name}'s profile`}
                      />
                      <AvatarFallback>🐾</AvatarFallback>
                    </Avatar>
                    <div className="text-center space-y-2">
                      <CardTitle className="text-2xl">{pet.name}</CardTitle>
                      <CardDescription>
                        {pet.breed} • {pet.age}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Breed</div>
                        <div>{pet.breed}</div>
                        <div className="text-muted-foreground">Age</div>
                        <div>{pet.age}</div>
                        <div className="text-muted-foreground">Weight</div>
                        <div>{pet.weight}</div>
                        <div className="text-muted-foreground">Color</div>
                        <div>{pet.color}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">About {pet.name}</h3>
                      <p className="text-sm text-muted-foreground">{pet.about}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Medical Info</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Vaccinated</div>
                        <div>{pet.vaccinated ? "Yes" : "No"}</div>
                        <div className="text-muted-foreground">Neutered</div>
                        <div>{pet.neutered ? "Yes" : "No"}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Emergency Contact</h3>
                      <div className="text-sm text-muted-foreground">{pet.emergency_contact}</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Pet Profile</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

