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
  const [mode, setMode] = useState("create"); // ตั้งค่าเริ่มต้นเป็น create
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      try {
        const hotelResponse = await axiosInstance.get(`/api/hotels/${id}`);
        const roomsResponse = await axiosInstance.get(`/api/hotels/${id}/rooms`);

        setHotel({ ...hotelResponse.data.hotel, rooms: roomsResponse.data });
        setMode(id ? "edit" : "create");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelAndRooms();
  }, [id]);

  const handleSave = async () => {
    try {
      if (mode === "create") {
        console.log("this is sent info: ", hotel)
        await axiosInstance.post(`/api/hotels/rooms/${id}/create`, hotel);
        toast({ title: "Room Created Successfully!" });
      } else {
        await axiosInstance.put(`/api/hotels/rooms/${id}/update`, hotel);
        toast({ title: "Room Updated Successfully!" });
      }

      router.push("/rooms");
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
          {mode === "create" ? "CREATE" : "UPDATE"}
        </h1>

        <RoomsTab hotel={hotel} setHotel={setHotel} />

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => router.push("/rooms")}>
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
