"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import axiosInstance from "@/utils/axios";
import { Calendar, Check, Hotel, PawPrintIcon as Paw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function BookingSidebar({ hotelId, onViewRooms, onSelectRoom }) {
  const [activeTab, setActiveTab] = useState("dates");
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 ดึงข้อมูลโรงแรม
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axiosInstance.get(`/api/hotels/${hotelId}`);
        setHotel(response.data);
      } catch (error) {
        console.error("❌ Error fetching hotel data:", error);
      }
    };

    // 🔹 ดึงข้อมูลห้องพัก
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get(`/api/hotels/${hotelId}/rooms`);
        setRooms(response.data);
      } catch (error) {
        console.error("❌ Error fetching rooms:", error);
      }
    };

    // 🔹 ดึงข้อมูลสัตว์เลี้ยงของผู้ใช้
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/api/pets", {
          headers: { Authorization: `Token ${token}` },
        });
        setPets(response.data);
      } catch (error) {
        console.error("❌ Error fetching pets:", error);
      }
    };

    if (hotelId) {
      setLoading(true);
      fetchHotelData();
      fetchRooms();
      fetchPets();
      setLoading(false);
    }
  }, [hotelId]);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return nights;
  };

  const handleSelectRoom = (roomId) => {
    setSelectedRoom(roomId);
    const room = rooms.find((r) => r.id === roomId);
    if (room && onSelectRoom) {
      onSelectRoom(room);
    }
  };

  const handleContinue = () => {
    if (activeTab === "dates") {
      if (checkInDate && checkOutDate) {
        setActiveTab("details");
      }
    } else {
      if (selectedRoom && onSelectRoom) {
        const room = rooms.find((r) => r.id === selectedRoom);
        if (room) {
          onSelectRoom(room);
        }
      }
    }
  };

  if (loading) {
    return (
      <Card className="sticky top-4 shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4 shadow-lg border-primary/10">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Hotel className="h-5 w-5" />
          Book Your Stay
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
          <TabsList className="grid grid-cols-2 w-full rounded-none">
            <TabsTrigger value="dates" className="rounded-none">
              <Calendar className="h-4 w-4 mr-2" />
              Dates
            </TabsTrigger>
            <TabsTrigger value="details" className="rounded-none" disabled={!checkInDate || !checkOutDate}>
              <Users className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
          </TabsList>

          {/* 🔹 Tab: เลือกวันเข้าพัก */}
          <TabsContent value="dates" className="p-4 space-y-4">
            <Label>Check-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {checkInDate ? format(checkInDate, "MMMM do, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <CalendarComponent mode="single" selected={checkInDate} onSelect={setCheckInDate} />
              </PopoverContent>
            </Popover>

            <Label>Check-out Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {checkOutDate ? format(checkOutDate, "MMMM do, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <CalendarComponent mode="single" selected={checkOutDate} onSelect={setCheckOutDate} />
              </PopoverContent>
            </Popover>

            <Button className="w-full mt-4" onClick={handleContinue} disabled={!checkInDate || !checkOutDate}>
              Continue to Details
            </Button>
          </TabsContent>

          {/* 🔹 Tab: รายละเอียดการจอง */}
          <TabsContent value="details" className="p-4 space-y-4">
            <Label>Select Your Pet</Label>
            <Select value={selectedPet} onValueChange={setSelectedPet}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a pet" />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name} ({pet.pet_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>Select Room</Label>
            <Select value={selectedRoom} onValueChange={handleSelectRoom}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.roomname} - ${room.price_per_night}/night
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
