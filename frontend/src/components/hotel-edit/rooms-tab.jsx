import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";
import axiosInstance from "@/utils/axios";
import RoomItem from "./room-item";

export default function RoomsTab({
    hotel,
    setHotel,
    handleAddRoom,
    handleRemoveRoom,
    roomImagePreviews,
    handleRoomImageChange,
    handleRemoveRoomImage,
    handleRoomImageDescriptionChange,
}) {
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showNewRoomForm, setShowNewRoomForm] = useState(false);
    
    // สเตทสำหรับเก็บข้อมูลห้องใหม่
    const [newRoom, setNewRoom] = useState({
        roomname: "New Room",
        price_per_night: 1000,
        size: 20,
        max_pets: 2,
        current_pets_count_int: 0,
        rating_decimal: 5.0,
        total_review: 0,
        availability_status: "available",
        room_type: "standard",
        allow_pet_size: "medium",
        allow_pet_type: "dog",
    });
    
    // ฟังก์ชันสำหรับอัปเดตข้อมูลห้องใหม่เมื่อผู้ใช้กรอกข้อมูล
    const handleNewRoomChange = (e) => {
        const { name, value, type } = e.target;
        
        // แปลงค่าตัวเลขให้ถูกต้อง
        const processedValue = type === 'number' ? Number(value) : value;
        
        setNewRoom((prev) => ({
            ...prev,
            [name]: processedValue,
        }));
    };
    
    useEffect(() => {
        const fetchRooms = async () => {
            if (!hotel || !hotel.id) return;
            setLoading(true);

            try {
                console.log(`Fetching rooms for hotel ID: ${hotel.id}`);
                const response = await axiosInstance.get(`api/hotels/${hotel.id}/rooms/`);
                console.log("✅ Fetched Rooms:", response.data);

                setHotel((prevHotel) => ({
                    ...prevHotel,
                    rooms: response.data, // ✅ Set the old rooms
                }));
            } catch (err) {
                console.log("❌ Error fetching rooms:", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [hotel?.id]);

    // ✅ สร้างห้องใหม่จากข้อมูลในฟอร์ม
    const handleCreateRoom = async () => {
        if (!hotel || !hotel.id) {
            toast({
                title: "Error",
                description: "Hotel ID is missing. Cannot create a room.",
                variant: "destructive",
            });
            return;
        }
    
        setCreating(true);
    
        try {
            // ใช้ข้อมูลจากสเตท newRoom
            const apiEndpoint = `api/hotels/rooms/${hotel.id}/create/`;
            console.log(`Sending POST request to:`, newRoom);
    
            const response = await axiosInstance.post(apiEndpoint, newRoom);
            console.log("✅ API Response:", response.data);
    
            const createdRoom = response.data;
    
            // อัปเดตสเตทของโรงแรมโดยเพิ่มห้องใหม่เข้าไป
            setHotel((prevHotel) => ({
                ...prevHotel,
                rooms: [...(prevHotel?.rooms || []), createdRoom], 
            }));
    
            // ซ่อนฟอร์มและรีเซ็ตข้อมูลห้องใหม่
            setShowNewRoomForm(false);
            setNewRoom({
                roomname: "New Room",
                price_per_night: 1000,
                size: 20,
                max_pets: 2,
                current_pets_count_int: 0,
                rating_decimal: 5.0,
                total_review: 0,
                availability_status: "available",
                room_type: "standard",
                allow_pet_size: "medium",
                allow_pet_type: "dog",
            });
    
            toast({
                title: "Success",
                description: "Room created successfully!",
            });
        } catch (err) {
            console.log("❌ Error creating room:", err.response?.data || err.message);
            toast({
                title: "Error",
                description: err.response?.data?.message || "Failed to create room.",
                variant: "destructive",
            });
    
            // ✅ ตรวจสอบก่อนเรียกใช้ `handleAddRoom`
            if (typeof handleAddRoom === "function") {
                handleAddRoom();
            }
        } finally {
            setCreating(false);
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Rooms</h2>
                    <Button 
                      type="button" 
                      onClick={() => setShowNewRoomForm(true)} 
                      disabled={creating || showNewRoomForm}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Room
                    </Button>
                </div>

                {/* ฟอร์มสำหรับสร้างห้องใหม่ */}
                {showNewRoomForm && (
                    <div className="border p-6 rounded-md mb-6 relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowNewRoomForm(false)}
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Cancel</span>
                        </Button>
                        
                        <h3 className="text-lg font-medium mb-4">Create New Room</h3>
                        
                        <div className="grid gap-6">
                            {/* Room Basic Info */}
                            <div>
                                <h4 className="text-md font-medium mb-3 pb-2 border-b">Basic Information</h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="new-room-name">Room Name</Label>
                                        <Input
                                            id="new-room-name"
                                            name="roomname"
                                            value={newRoom.roomname}
                                            onChange={handleNewRoomChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="new-room-price">Price per Night</Label>
                                        <Input
                                            id="new-room-price"
                                            name="price_per_night"
                                            type="number"
                                            step="0.01"
                                            value={newRoom.price_per_night}
                                            onChange={handleNewRoomChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Room Details */}
                            <div>
                                <h4 className="text-md font-medium mb-3 pb-2 border-b">Room Details</h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="new-room-size">Room Size (sq.m)</Label>
                                        <Input
                                            id="new-room-size"
                                            name="size"
                                            type="number"
                                            step="0.01"
                                            value={newRoom.size}
                                            onChange={handleNewRoomChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="new-room-type">Room Type</Label>
                                        <select
                                            id="new-room-type"
                                            name="room_type"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={newRoom.room_type}
                                            onChange={handleNewRoomChange}
                                        >
                                            <option value="standard">Standard</option>
                                            <option value="deluxe">Deluxe</option>
                                            <option value="suite">Suite</option>
                                            <option value="premium">Premium</option>
                                        </select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="new-room-status">Availability Status</Label>
                                        <select
                                            id="new-room-status"
                                            name="availability_status"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={newRoom.availability_status}
                                            onChange={handleNewRoomChange}
                                        >
                                            <option value="available">Available</option>
                                            <option value="partially_reserved">Partially Reserved</option>
                                            <option value="fully_reserved">Fully Reserved</option>
                                            <option value="maintenance">Under Maintenance</option>
                                        </select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="new-room-rating">Initial Rating</Label>
                                        <Input
                                            id="new-room-rating"
                                            name="rating_decimal"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            value={newRoom.rating_decimal}
                                            onChange={handleNewRoomChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pet Accommodation */}
                            <div>
                                <h4 className="text-md font-medium mb-3 pb-2 border-b">Pet Accommodation</h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="new-room-max-pets">Maximum Pets</Label>
                                        <Input
                                            id="new-room-max-pets"
                                            name="max_pets"
                                            type="number"
                                            min="1"
                                            value={newRoom.max_pets}
                                            onChange={handleNewRoomChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="new-room-current-pets">Current Pets Count</Label>
                                        <Input
                                            id="new-room-current-pets"
                                            name="current_pets_count_int"
                                            type="number"
                                            min="0"
                                            value={newRoom.current_pets_count_int}
                                            onChange={handleNewRoomChange}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="new-room-pet-size">Allowed Pet Size</Label>
                                        <select
                                            id="new-room-pet-size"
                                            name="allow_pet_size"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={newRoom.allow_pet_size}
                                            onChange={handleNewRoomChange}
                                        >
                                            <option value="small">Small</option>
                                            <option value="medium">Medium</option>
                                            <option value="large">Large</option>
                                            <option value="all">All Sizes</option>
                                        </select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="new-room-pet-type">Allowed Pet Type</Label>
                                        <select
                                            id="new-room-pet-type"
                                            name="allow_pet_type"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={newRoom.allow_pet_type}
                                            onChange={handleNewRoomChange}
                                        >
                                            <option value="dog">Dog</option>
                                            <option value="cat">Cat</option>
                                            <option value="all">All Pets</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end space-x-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setShowNewRoomForm(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="button" 
                                onClick={handleCreateRoom} 
                                disabled={creating}
                            >
                                {creating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Room"
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin inline" />
                        Loading existing rooms...
                    </div>
                ) : hotel?.rooms?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No rooms found. Click "Add Room" to create one.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {hotel?.rooms?.map((room, index) => (
                            <RoomItem
                                key={room.id || room.tempId || index}
                                room={room}
                                index={index}
                                hotel={hotel}
                                setHotel={setHotel}
                                handleRemoveRoom={handleRemoveRoom}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
