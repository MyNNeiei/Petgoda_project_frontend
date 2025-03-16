"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import PersonProfile from "./person/page"
import PetProfile from "./pet/page"
import AddPetForm from "./add-pet/add-pet"
import Navbar from "@/components/navbar/headernav"
import axiosInstance from "@/utils/axios"

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [isStaff, setIsStaff] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)

        // ✅ Fetch logged-in user details
        const userResponse = await axiosInstance.get("/api/users/me/")
        const user = userResponse.data

        setIsStaff(user?.is_staff || false)

        // ✅ Fetch Profile & Pets (only if NOT staff)
        const profilePromise = axiosInstance.get("api/profile/")
        const petsPromise = isStaff ? Promise.resolve([]) : axiosInstance.get("/api/pet/")

        const [profileResponse, petsResponse] = await Promise.all([profilePromise, petsPromise])

        setProfile(profileResponse.data)
        setPets(isStaff ? [] : petsResponse.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Error fetching user data")
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center flex-col">
        <main className="container mx-0 py-8 px-4 w-full">
          <h1 className="flex items-center justify-center text-3xl font-bold mb-8">My Profile</h1>

          {isStaff ? (
            // ✅ Staff: Show only Personal Profile
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">Personal Profile</h2>
              <PersonProfile profile={profile} />
            </div>
          ) : (
            // ✅ Regular Users: Show Tabs for Personal & Pet Profiles
            <Tabs defaultValue="person" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="person">Personal Profile</TabsTrigger>
                <TabsTrigger value="pet">Pet Profiles</TabsTrigger>
              </TabsList>

              <TabsContent value="person">
                <PersonProfile profile={profile} />
              </TabsContent>

              <TabsContent value="pet">
                <div className="space-y-6">
                  <div className="flex justify-end">
                    <AddPetForm onSuccess={() => fetchUserData()} />
                  </div>
                  <PetProfile pets={pets} onUpdate={() => fetchUserData()} />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </>
  )
}
