"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar/headernav";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import RoomsTab from "@/components/hotel-edit/rooms-tab";

export default function EditCreateRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState(null);
  const [mode, setMode] = useState("create"); 
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      try {
        const hotelResponse = await axiosInstance.get(`/api/hotels/${id}`);
        const roomsResponse = await axiosInstance.get(`/api/hotels/${id}/rooms`);

        setHotel({ ...hotelResponse.data.hotel, rooms: roomsResponse.data });

        // ✅ Fixing Mode Detection
        if (roomsResponse.data.length > 0) {
          setMode("edit");
        } else {
          setMode("create");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({ title: "Error", description: "Failed to fetch hotel details.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchHotelAndRooms();
  }, [id]);

  const handleSave = async () => {
    try {
      if (!hotel || !hotel.rooms || hotel.rooms.length === 0) {
        toast({ title: "Error", description: "No room data available.", variant: "destructive" });
        return;
      }

      const room = hotel.rooms[0]; // ✅ Assume we're editing/creating the first room

      if (mode === "create") {
        console.log("Creating Room: ", room);
        await axiosInstance.post(`/api/hotels/rooms/${id}/create/`, room);
        toast({ title: "Room Created Successfully!" });
      } else {
        console.log("Updating Room: ", room);
        const roomWithId = {
          ...room,
          room_id: room.id // เพิ่ม room_id เข้าไปในข้อมูลที่ส่ง
        };
        console.log("Updating Room with ID:", roomWithId);
        await axiosInstance.put(`/api/hotels/rooms/${id}/update/`, roomWithId);
        toast({ title: "Room Updated Successfully!" });
      }

      router.push("/mainHotel/manage/");
    } catch (error) {
      console.error("Error saving room:", error);
      toast({ title: "Error", description: "Failed to save room.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading hotel details...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-6">
          {mode === "create" ? "CREATE ROOM" : "UPDATE ROOM"}
        </h1>

        <RoomsTab hotel={hotel} setHotel={setHotel} />

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => router.push("/mainHotel/manage/")}>
            Cancel
          </Button>

          <Button onClick={handleSave} className="flex items-center gap-2">
            {mode === "create" ? "Create Room" : "Update Room"}
          </Button>
        </div>
      </div>
    </div>
  );
}
