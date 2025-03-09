"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import Navbar from "@/components/navbar/headernav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore } from "date-fns";

const NewReservation = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetchingRooms, setFetchingRooms] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [pets, setPets] = useState([]);


    const [formData, setFormData] = useState({
        checkInDate: null,
        checkOutDate: null,
        hotel: "",
        room: ""
    });

    // ✅ ดึงรายการโรงแรมเมื่อเลือกวันที่เรียบร้อย
    useEffect(() => {
        if (!formData.checkInDate || !formData.checkOutDate) return;

        const fetchHotels = async () => {
            try {
                const response = await axiosInstance.get("/api/hotels/");
                setHotels(response.data);
            } catch (error) {
                console.error("❌ Error fetching hotels:", error);
                toast({ title: "Error", description: "Failed to fetch hotels", variant: "destructive" });
            }
        };
        fetchHotels();
    }, [formData.checkInDate, formData.checkOutDate]);

    // ✅ ดึงห้องพักเฉพาะช่วงวันที่เลือก
    useEffect(() => {
        if (!formData.hotel || !formData.checkInDate || !formData.checkOutDate) {
            setRooms([]);
            setSelectedRoom(null);
            return;
        }

        const fetchRooms = async () => {
            setFetchingRooms(true);
            try {
                const response = await axiosInstance.get(`/api/hotels/${formData.hotel}/rooms/`, {
                    params: {
                        check_in: format(formData.checkInDate, "yyyy-MM-dd"),
                        check_out: format(formData.checkOutDate, "yyyy-MM-dd")
                    }
                });
                setRooms(response.data);
            } catch (error) {
                console.error("❌ Error fetching rooms:", error);
                toast({ title: "Error", description: "Failed to fetch available rooms", variant: "destructive" });
            } finally {
                setFetchingRooms(false);
            }
        };

        fetchRooms();
    }, [formData.hotel, formData.checkInDate, formData.checkOutDate]);

    // ✅ ดึงรายละเอียดห้องที่เลือก
    useEffect(() => {
        if (!formData.room) {
            setSelectedRoom(null);
            return;
        }

        const roomData = rooms.find((room) => room.id.toString() === formData.room);
        setSelectedRoom(roomData || null);
    }, [formData.room]);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axiosInstance.get("/api/pets/", {
                    headers: { Authorization: `Token ${token}` },
                });
                setPets(response.data);  // ✅ ตั้งค่า pets
            } catch (error) {
                console.error("❌ Error fetching pets:", error);
                toast({ title: "Error", description: "Failed to fetch pets", variant: "destructive" });
            }
        };

        fetchPets();
    }, []);


    const checkAvailability = async () => {
        if (!formData.hotel || !formData.room || !formData.checkInDate || !formData.checkOutDate) {
            return;
        }

        try {
            const response = await axiosInstance.get(`/api/reservations/check_availability/`, {
                params: {
                    hotel: formData.hotel,
                    room: formData.room,
                    check_in: format(formData.checkInDate, "yyyy-MM-dd"),
                    check_out: format(formData.checkOutDate, "yyyy-MM-dd")
                }
            });

            if (!response.data.available) {
                toast({ title: "Room Full", description: "This room is fully booked for the selected dates.", variant: "destructive" });
                setFormData((prev) => ({ ...prev, room: "" }));
            }
        } catch (error) {
            console.error("❌ Error checking room availability:", error);
        }
    };

    // ✅ เช็คว่าห้องเต็มหรือไม่ เมื่อเลือกห้อง
    useEffect(() => {
        if (formData.hotel && formData.room && formData.checkInDate && formData.checkOutDate) {
            checkAvailability();
        }
    }, [formData.hotel, formData.room, formData.checkInDate, formData.checkOutDate]);


    // ✅ จัดการการเลือกวันที่
    const handleDateChange = (name, date) => {
        if (name === "checkOutDate" && isBefore(date, formData.checkInDate)) {
            toast({ title: "Invalid Date", description: "Check-out date must be after check-in date", variant: "destructive" });
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: date, hotel: "", room: "" }));
        setHotels([]);
        setRooms([]);
        setSelectedRoom(null);
    };

    const handleSubmit = async () => {
        if (!formData.hotel || !formData.room || !formData.checkInDate || !formData.checkOutDate) {
            toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");  // ดึง Token ของ User

            // ส่งข้อมูลไปยัง API Django
            const response = await axiosInstance.post("/api/reservations/create/", {
                user_id: 1,  // ✅ ต้องเปลี่ยนเป็น user_id ที่ login จริง
                pet_id: 1,   // ✅ ให้ผู้ใช้เลือกสัตว์เลี้ยงที่ต้องการจอง
                room_id: formData.room,
                check_in: format(formData.checkInDate, "yyyy-MM-dd"),
                check_out: format(formData.checkOutDate, "yyyy-MM-dd"),
                special_request: "No special request",  // เปลี่ยนได้ตามต้องการ
            }, {
                headers: { Authorization: `Token ${token}` },
            });

            toast({ title: "Success", description: "Your reservation has been saved!", variant: "success" });
            router.push("/reservationhistory"); // ไปที่หน้าประวัติการจอง
        } catch (error) {
            console.error("❌ Error making reservation:", error);
            toast({ title: "Error", description: "Failed to save reservation.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto py-8 px-4">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl">New Reservation</CardTitle>
                        <CardDescription>Book a stay for your pet at our hotel</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* ✅ เลือกวันที่ก่อน */}
                        <div className="space-y-2">
                            <Label>Check-in Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">
                                        {formData.checkInDate ? format(formData.checkInDate, "PPP") : "Select a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start">
                                    <Calendar mode="single" selected={formData.checkInDate} onSelect={(date) => handleDateChange("checkInDate", date)} />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Check-out Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">
                                        {formData.checkOutDate ? format(formData.checkOutDate, "PPP") : "Select a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start">
                                    <Calendar mode="single" selected={formData.checkOutDate} onSelect={(date) => handleDateChange("checkOutDate", date)} />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {formData.hotel && (
                            <div className="space-y-2">
                                <Label>Select Pet</Label>
                                <Select onValueChange={(value) => setFormData({ ...formData, pet: value })} value={formData.pet}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a pet" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pets.length > 0 ? (
                                            pets.map((pet) => (
                                                <SelectItem key={pet.id} value={pet.id.toString()}>
                                                    {pet.name} ({pet.pettype})
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 p-2">No pets found</p>  // ✅ เพิ่มข้อความเมื่อไม่มีสัตว์เลี้ยง
                                        )}
                                    </SelectContent>

                                </Select>
                            </div>
                        )}


                        {/* ✅ เลือกโรงแรม */}
                        {formData.checkInDate && formData.checkOutDate && (
                            <div className="space-y-2">
                                <Label>Select Hotel</Label>
                                <Select onValueChange={(value) => setFormData({ ...formData, hotel: value, room: "" })} value={formData.hotel}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a hotel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hotels.map((hotel) => (
                                            <SelectItem key={hotel.id} value={hotel.id.toString()}>
                                                {hotel.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* ✅ เลือกห้องพัก */}
                        {formData.hotel && rooms.length > 0 && (
                            <div className="space-y-2">
                                <Label>Select Room</Label>
                                <Select onValueChange={(value) => setFormData({ ...formData, room: value })} value={formData.room}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a room" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms
                                            .filter((room) => room.current_pets_count_int < room.max_pets) // ✅ แสดงเฉพาะห้องที่ยังว่าง
                                            .map((room) => (
                                                <SelectItem key={room.id} value={room.id.toString()}>
                                                    {room.roomname} - ฿{room.price_per_night} - 🐾 Available: {room.max_pets - room.current_pets_count_int}
                                                </SelectItem>
                                            ))}

                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* ✅ แสดงรายละเอียดห้องที่เลือก */}
                        {selectedRoom && (
                            <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                                <h3 className="text-lg font-semibold">Room Details</h3>
                                <p><strong>Room Type:</strong> {selectedRoom.roomname}</p>
                                <p><strong>Size:</strong> {selectedRoom.size} sqm</p>
                                <p><strong>Price per Night:</strong> ฿{selectedRoom.price_per_night}</p>
                                <p><strong>Pets Allowed:</strong> {selectedRoom.max_pets}</p>
                            </div>
                        )}
                        <Button onClick={handleSubmit} disabled={loading || !formData.hotel || !formData.room} className="w-full">
                            {loading ? <Loader2 className="animate-spin" /> : "Confirm Reservation"}
                        </Button>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default NewReservation;
