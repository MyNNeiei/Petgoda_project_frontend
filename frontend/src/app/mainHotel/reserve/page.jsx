"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function ReservationPage() {
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    pet: "",
    room: "",
    check_in_date: "",
    check_out_date: "",
    totalprice: "",
    special_request: "",
  });

  const fetchReservations = async () => {
    try {
      const response = await axiosInstance.get("/api/reservations/");
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast({
        title: "Error",
        description: "Could not fetch reservations.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/reservations/", formData);
      toast({
        title: "Success",
        description: "Reservation created successfully!",
      });

      setReservations([...reservations, response.data]); // Update the list
      setFormData({
        pet: "",
        room: "",
        check_in_date: "",
        check_out_date: "",
        totalprice: "",
        special_request: "",
      });
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast({
        title: "Error",
        description: "Failed to create reservation.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Make a Reservation</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="pet">Pet</Label>
          <Input
            type="text"
            id="pet"
            value={formData.pet}
            onChange={(e) => setFormData({ ...formData, pet: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="room">Room</Label>
          <Input
            type="text"
            id="room"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="check_in_date">Check-In Date</Label>
          <Input
            type="date"
            id="check_in_date"
            value={formData.check_in_date}
            onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="check_out_date">Check-Out Date</Label>
          <Input
            type="date"
            id="check_out_date"
            value={formData.check_out_date}
            onChange={(e) => setFormData({ ...formData, check_out_date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="totalprice">Total Price</Label>
          <Input
            type="number"
            id="totalprice"
            value={formData.totalprice}
            onChange={(e) => setFormData({ ...formData, totalprice: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="special_request">Special Requests</Label>
          <Input
            type="text"
            id="special_request"
            value={formData.special_request}
            onChange={(e) => setFormData({ ...formData, special_request: e.target.value })}
          />
        </div>
        <Button type="submit">Submit Reservation</Button>
      </form>

      <h2 className="text-xl font-bold mt-8">Your Reservations</h2>
      <ul className="mt-4">
        {reservations.map((reservation) => (
          <li key={reservation.id} className="border p-4 rounded-md my-2">
            <strong>{reservation.room_name}</strong> <br />
            {reservation.check_in_date} - {reservation.check_out_date} <br />
            Guests: {reservation.pet_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
