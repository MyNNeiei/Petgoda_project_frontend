'use client'

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import axiosInstance from "@/utils/axios"
import Navbar from "@/components/navbar/headernav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, ArrowLeft, Loader2, Calendar, Clock, Home, User, PawPrint } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { format } from 'date-fns'

const ReservationDetail = () => {
    const [reservation, setReservation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState(null)
    const { id } = useParams();
    const reservationId = id;
    console.log("Reservation ID:", reservationId);  // ✅ Debugging

    const router = useRouter()
    const { toast } = useToast()
    // const reservationId = params.id

    // Fetch reservation details
    useEffect(() => {
        const fetchReservationDetails = async () => {
            try {
                setLoading(true)
                const response = await axiosInstance.get(`/api/reservations/${reservationId}/`)
                setReservation(response.data)
                setLoading(false)
            } catch (err) {
                console.error("Error fetching reservation details:", err)
                setError("Failed to load reservation details. Please try again later.")
                setLoading(false)
                toast({
                    title: "Error",
                    description: "Failed to load reservation details",
                    variant: "destructive"
                })
            }
        }

        if (reservationId) {
            fetchReservationDetails()
        }
    }, [reservationId, toast])

    // Update reservation status
    const updateReservationStatus = async (reservationId, status) => {
        try {
            console.log(`🔍 Updating reservation ${reservationId} to status: ${status}`);

            const token = localStorage.getItem("token");
            const response = await axiosInstance.patch(
                `/api/reservations/${reservationId}/update_status/`,
                { status },  // ✅ ส่งค่า status ไปที่ Backend
                {
                    headers: { "Authorization": `Token ${token}` }, // ✅ ตรวจสอบว่า Token ถูกส่งไป
                }
            );

            console.log("✅ Status updated:", response.data);
            setReservation(prev => ({ ...prev, status }));

            toast({
                title: "Status Updated",
                description: `Reservation #${reservationId} is now ${status}`,
                variant: "default"
            });

        } catch (error) {
            console.error("❌ Error updating reservation status:", error);
            toast({
                title: "Update Failed",
                description: "Could not update reservation status",
                variant: "destructive"
            });
        }
    };


    // Go back to reservations list
    const goBack = () => {
        router.push('/reservations')
    }

    // Render status badge with appropriate color
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-500">Confirmed</Badge>
            case 'pending':
                return <Badge className="bg-yellow-500">Pending</Badge>
            case 'cancelled':
                return <Badge className="bg-red-500">Cancelled</Badge>
            case 'completed':
                return <Badge className="bg-blue-500">Completed</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    // Format date for display
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'PPP')
        } catch (error) {
            return dateString || 'N/A'
        }
    }

    const calculateDuration = (checkIn, checkOut) => {
        try {
            const startDate = new Date(checkIn);
            const endDate = new Date(checkOut);

            // คำนวณจำนวนวัน (เอาค่ามิลลิวินาทีมาลบกันแล้วแปลงเป็นวัน)
            const durationInDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));

            return durationInDays > 0 ? durationInDays : "N/A";
        } catch (error) {
            console.error("❌ Error calculating duration:", error);
            return "N/A";
        }
    };


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Loading reservation details...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-red-500">Error</CardTitle>
                            <CardDescription>We encountered a problem</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>{error}</p>
                            <Button
                                className="mt-4 w-full"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (!reservation) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Reservation Not Found</CardTitle>
                            <CardDescription>The requested reservation could not be found</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="mt-4 w-full"
                                onClick={goBack}
                            >
                                Back to Reservations
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto py-8 px-4">
                <Button
                    variant="outline"
                    className="mb-4"
                    onClick={goBack}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Reservations
                </Button>

                <Card className="w-full max-w-4xl mx-auto">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle className="text-2xl">Reservation #{reservation.id}</CardTitle>
                                <CardDescription>
                                    Created on {formatDate(reservation.created_at)}
                                </CardDescription>
                            </div>
                            <div className="mt-2 md:mt-0">
                                {renderStatusBadge(reservation.status)}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Reservation Details</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Check-in Date</p>
                                            <p className="font-medium">{formatDate(reservation.check_in_date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Check-out Date</p>
                                            <p className="font-medium">{formatDate(reservation.check_out_date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Duration</p>
                                            <p className="font-medium">
                                                {reservation.duration || 'N/A'} {reservation.duration === 1 ? 'day' : 'days'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <Home className="h-5 w-5 mr-2 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Room</p>
                                            <p className="font-medium">
                                                {reservation.room?.number || reservation.room || 'N/A'}
                                                {reservation.room?.type && ` (${reservation.room.type})`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Pet & Owner Information</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <User className="h-5 w-5 mr-2 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Owner</p>
                                            <p className="font-medium">
                                                {reservation.pet_owner?.username || reservation.pet_owner || 'N/A'}
                                            </p>
                                            {reservation.pet_owner?.email && (
                                                <p className="text-sm text-muted-foreground">{reservation.pet_owner.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <PawPrint className="h-5 w-5 mr-2 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Pet</p>
                                            <p className="font-medium">
                                                {reservation.pet?.name || reservation.pet || 'N/A'}
                                            </p>
                                            {reservation.pet?.breed && (
                                                <p className="text-sm text-muted-foreground">
                                                    {reservation.pet.breed}, {reservation.pet.age} years old
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {reservation.special_requests && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">Special Requests</h3>
                                <div className="bg-muted p-4 rounded-md">
                                    <p>{reservation.special_requests}</p>
                                </div>
                            </div>
                        )}

                        {reservation.notes && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                                <div className="bg-muted p-4 rounded-md">
                                    <p>{reservation.notes}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <Separator />

                    <CardFooter className="flex flex-col sm:flex-row justify-between p-6 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                            <p className="text-2xl font-bold">
                                ${reservation.total_price || 'N/A'}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            {reservation.status === 'pending' && (
                                <>
                                    <Button
                                        variant="default"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => {
                                            console.log("🟢 Confirm Button Clicked"); // ✅ Debug ปุ่มถูกกดหรือไม่
                                            updateReservationStatus(reservation.id, "confirmed");
                                        }}
                                        disabled={actionLoading}
                                    >

                                        {actionLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Confirm Reservation
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            console.log("🔴 Cancel Button Clicked"); // ✅ Debug ปุ่มถูกกดหรือไม่
                                            updateReservationStatus(reservation.id, "cancelled");
                                        }}
                                        disabled={actionLoading}
                                    >

                                        {actionLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <XCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Cancel Reservation
                                    </Button>
                                </>
                            )}

                            {reservation.status === 'confirmed' && (
                                <Button
                                    variant="destructive"
                                    onClick={() => updateReservationStatus("cancelled")}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <XCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Cancel Reservation
                                </Button>
                            )}

                            {(reservation.status === 'cancelled' || reservation.status === 'completed')}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default ReservationDetail
