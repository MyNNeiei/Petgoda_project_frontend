"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import axiosInstance from "@/utils/axios" // Make sure this path is correct
import Navbar from "@/components/navbar/headernav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  // Fetch reservations on component mount
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          setError("No authentication token found. Please log in.")
          setLoading(false)
          toast({
            title: "Authentication Error",
            description: "Please log in to view your reservations",
            variant: "destructive",
          })
          return
        }

        // Since we're using the interceptor in axiosInstance, we don't need to manually set the token here
        const response = await axiosInstance.get("/api/reservations/")

        setReservations(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching reservations:", err)
        setError("Failed to load reservations. Please try again later.")
        setLoading(false)
        toast({
          title: "Error",
          description: "Failed to load reservations",
          variant: "destructive",
        })
      }
    }

    fetchReservations()
  }, [toast])

  // Update reservation status
  const updateReservationStatus = useCallback(
    async (reservationId, status) => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          toast({
            title: "Authentication Error",
            description: "Please log in to update reservations",
            variant: "destructive",
          })
          return
        }

        setReservations((prev) => prev.map((res) => (res.id === reservationId ? { ...res, statusLoading: true } : res)))

        // Using axiosInstance with interceptor, so no need to manually set the token
        const response = await axiosInstance.patch(`/api/reservations/${reservationId}/update_status/`, { status })

        setReservations((prev) =>
          prev.map((res) => (res.id === reservationId ? { ...res, status, statusLoading: false } : res)),
        )

        toast({
          title: "Status Updated",
          description: `Reservation #${reservationId} is now ${status}`,
          variant: "default",
        })
      } catch (error) {
        console.error("Error updating reservation status:", error)

        setReservations((prev) =>
          prev.map((res) => (res.id === reservationId ? { ...res, statusLoading: false } : res)),
        )

        toast({
          title: "Update Failed",
          description: "Could not update reservation status",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  // View reservation details
  const viewReservationDetails = useCallback(
    (reservationId) => {
      router.push(`/reservations/${reservationId}/`) // ✅ เพิ่ม `/` ท้ายสุด
    },
    [router]
  );
  

  // Render status badge with appropriate color
  const renderStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading reservations...</p>
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
              <Button className="mt-4 w-full" onClick={() => window.location.reload()}>
                Try Again
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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reservation History</CardTitle>
            <CardDescription>Manage and view your pet hotel reservations</CardDescription>
          </CardHeader>
          <CardContent>
            {reservations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reservations found.</p>
                <Button className="mt-4" onClick={() => router.push("/reservations/new")}>
                  Make a Reservation
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Pet</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">#{reservation.id}</TableCell>
                        <TableCell>{reservation.pet_owner?.username || reservation.pet_owner || "N/A"}</TableCell>
                        <TableCell>{reservation.pet?.name || reservation.pet || "N/A"}</TableCell>
                        <TableCell>{reservation.room?.number || reservation.room || "N/A"}</TableCell>
                        <TableCell>{renderStatusBadge(reservation.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => viewReservationDetails(reservation.id)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>

                            {reservation.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => updateReservationStatus(reservation.id, "confirmed")}
                                  disabled={reservation.statusLoading}
                                >
                                  {reservation.statusLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Confirm
                                    </>
                                  )}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                                  disabled={reservation.statusLoading}
                                >
                                  {reservation.statusLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Cancel
                                    </>
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ReservationHistory

