"use client";

import { useEffect, useState} from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import PersonProfile from "./person/page";
import PetProfile from "./pet/page";
import AddPetForm from "./add-pet/add-pet";
import Navbar from "@/components/navbar/headernav";
import axiosInstance from "@/utils/axios";
import { fetchProfile } from "@/utils/apiPets";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const response = await axiosInstance.get(`api/profile/`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPets = async () => {
    try {
      const response = await axiosInstance.get("/api/pet/");
      setPets(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pets",
        variant: "destructive",
      });
    }
  };

  // ✅ Load Profile & Pets in parallel
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([loadProfile(), loadPets()]);
      setLoading(false); // ✅ Ensure loading state updates after both calls
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="flex items-center justify-center flex-col">
      
      <main className="container mx-0 py-8 px-4 w-full">
        <h1 className="flex items-center justify-center text-3xl font-bold mb-8">My Profile</h1>

        <Tabs defaultValue="person" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="person">Personal Profile</TabsTrigger>
            <TabsTrigger value="pet">Pet Profiles</TabsTrigger>
          </TabsList>

          <TabsContent value="person">
            {<PersonProfile profile={profile} onUpdate={loadProfile} /> }
          </TabsContent>

          <TabsContent value="pet">
            <div className="space-y-6">
              <div className="flex justify-end">
                <AddPetForm onSuccess={loadPets} />
              </div>
              <PetProfile pets={pets} onUpdate={loadPets} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
    </>
  );
}
