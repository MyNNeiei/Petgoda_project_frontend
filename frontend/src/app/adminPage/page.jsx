"use client"; // Make sure this file is treated as a client component in Next.js

import { useEffect, useState } from "react";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import { Sniglet } from "next/font/google";
import './styles.css';
import { HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import axiosInstance from "@/utils/axios";

const sniglet = Sniglet({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

const DataTable = () => {
  const [userData, setUserData] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reasonData, setReasonData] = useState({});



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userResponse = await axiosInstance.get("http://127.0.0.1:8000/api/users/");
        setUserData(userResponse.data);

        const hotelResponse = await axiosInstance.get("http://127.0.0.1:8000/api/hotels/");
        console.log("🔄 Loaded Hotel Data:", hotelResponse.data); // ✅ Debugging Reason
        setHotelData(hotelResponse.data);

      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Update User Status
  const updateUserStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.patch(
        `http://127.0.0.1:8000/api/users/${userId}/update_status/`,
        { status },
        { headers: { Authorization: `Token ${token}` } }
      );

      const updatedUserData = userData.map(user =>
        user.id === userId ? { ...user, status } : user
      );
      setUserData(updatedUserData); // Update table with the new status
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    }
  };

  const updateHotelApprovalStatus = async (hotelId, status) => {
    try {
      const token = localStorage.getItem('token');

      await axiosInstance.patch(
        `http://127.0.0.1:8000/api/hotels/${hotelId}/update_status/`,
        { status },
        { headers: { Authorization: `Token ${token}` } }
      );

      // ✅ ตรวจสอบว่าถ้าเป็น "cancelled" ต้องให้เหตุผล
      let newReason = "";
      if (status === "cancelled") {
        newReason = prompt("Please enter a reason for cancellation:") || "No reason provided";
      }

      if (newReason) {
        await axiosInstance.patch(
          `http://127.0.0.1:8000/api/hotels/${hotelId}/update_reason/`,
          { reason: newReason },
          { headers: { Authorization: `Token ${token}` } }
        );
      }

      // ✅ อัปเดต State ให้ reason เปลี่ยนแปลงได้
      setHotelData((prev) =>
        prev.map((hotel) =>
          hotel.id === hotelId
            ? { ...hotel, status, reason: newReason } // ✅ แก้ status และ reason พร้อมกัน
            : hotel
        )
      );

    } catch (error) {
      console.error("Error updating hotel approval status:", error);
      alert("Error updating hotel approval status");
    }
  };


  const updateHotelReason = async (hotelId, reason) => {
    try {
      const token = localStorage.getItem('token');
  
      await axiosInstance.patch(
        `http://127.0.0.1:8000/api/hotels/${hotelId}/update_reason/`,
        { reason },
        { headers: { Authorization: `Token ${token}` } }
      );
  
      // ✅ อัปเดตค่า reason ใน hotelData ให้แสดงผลทันที
      setHotelData((prev) =>
        prev.map((hotel) =>
          hotel.id === hotelId ? { ...hotel, reason } : hotel
        )
      );
  
    } catch (error) {
      console.error("🚨 Error updating hotel reason:", error);
      alert("Error updating hotel reason");
    }
  };
  



  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main className={`${sniglet.className} flex min-h-screen bg-neutral-100 text-sm`}>
      {/* Sidebar */}
      <div id="hs-sidebar-basic-usage" className="fixed top-0 start-0 bottom-0 w-64 bg-white border-r border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
        <div className="p-4 flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo-petloga-lightmodel.svg" alt="Petgoda Logo" width={220} height={100} priority className="h-12 w-auto" />
          </Link>
        </div>

        <nav className="h-full overflow-y-auto">
          <ul className="space-y-1 p-2">
            <li>
              <a className="flex items-center gap-x-3 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-neutral-700 dark:text-white" href="#">
                <HomeIcon className="w-6 h-6" />
                Dashboard
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Content Area */}
      <div className="ml-64 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* User Management */}
        <div className="bg-white p-6 rounded shadow rounded-xl w-full max-w-xl">
          <h1 className="maintopic">User Management</h1>
          <div className="overflow-x-auto h-[450px]">
            <table className="display stripe hover w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Birth Date</th>
                  <th>Gender</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Created At</th>
                  <th>Edit At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.profile ? user.profile.birth_date : "N/A"}</td>
                    <td>{user.profile ? user.profile.gender : "N/A"}</td>
                    <td>{user.profile ? user.profile.role : "N/A"}</td>
                    <td>{user.profile ? user.profile.phone_number : "N/A"}</td>
                    <td>{user.profile ? user.profile.created_at : "N/A"}</td>
                    <td>{user.profile ? user.profile.updated_at : "N/A"}</td>
                    <td>
                      <select
                        value={user.status}
                        onChange={(e) => updateUserStatus(user.id, e.target.value)}
                      >
                        <option value="Active">Active</option>
                        <option value="Banned">Banned</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hotel Approve */}
        <div className="bg-white p-6 rounded shadow rounded-xl w-full max-w-xl">
          <h1 className="maintopic">Hotel Approve</h1>
          <div className="overflow-x-auto h-[450px]">
            <table className="display stripe hover w-full">
              <thead>
              <tr>
                  <th>ID</th>
                  <th>Hotel</th>
                  <th>Registrant</th>
                  <th>Status</th>
                  <th>Approved By</th>
                  <th>Approved At</th>
                  <th>Reason</th> {/* ✅ เพิ่มคอลัม Reason */}
                </tr>
              </thead>
              <tbody>
                {hotelData.map((hotel) => (
                  <tr key={hotel.id}>
                    <td>{hotel.id}</td>
                    <td>{hotel.name}</td>
                    <td>{hotel.registrant}</td>
                    <td>
                      <select
                        value={hotel.is_verified ? "confirmed" : hotel.status}
                        onChange={(e) => updateHotelApprovalStatus(hotel.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{hotel.approved_by}</td>
                    <td>{hotel.approved_at}</td>
                    <td>
                      <input
                        type="text"
                        value={reasonData[hotel.id] ?? hotel.reason ?? ""}
                        onChange={(e) =>
                          setReasonData((prev) => ({
                            ...prev,
                            [hotel.id]: e.target.value,
                          }))
                        }
                        onBlur={() => updateHotelReason(hotel.id, reasonData[hotel.id] ?? hotel.reason)}
                        className="border rounded px-2 py-1 w-full"
                        placeholder="Enter reason..."
                        disabled={hotel.status !== "cancelled"} // ✅ ให้แก้ได้เฉพาะเมื่อ status เป็น "cancelled"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DataTable;


