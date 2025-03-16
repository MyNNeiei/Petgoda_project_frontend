"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, User, Building } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import axiosInstance from "@/utils/axios";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isHotelStaff, setIsHotelStaff] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/api/user/", {
          withCredentials: true,
        });

        const userData = response.data;
        console.log("✅ User Data:", userData);

        setIsLoggedIn(true);
        setIsStaff(userData?.is_staff || false);
        setIsHotelStaff(userData?.is_hotel_staff || false);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoggedIn(false);
        setIsStaff(false);
        setIsHotelStaff(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/logout/", {}, { withCredentials: true });

      // Clear user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setIsStaff(false);
      setIsHotelStaff(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log("Logout failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setIsStaff(false);
      setIsHotelStaff(false);
      router.push("/");
      router.refresh();
    }
  };

  const NavLinks = () => (
    <>
      <Link href="/" className="hover:text-primary transition-colors">
        Home
      </Link>
      <Link href="/reservationhistory" className="hover:text-primary transition-colors">
        History
      </Link>
      <Link href="/hotels" className="hover:text-primary transition-colors">
        Hotels
      </Link>
      <Link href="/" className="hover:text-primary transition-colors">
        Contact
      </Link>
    </>
  );

  const AuthLinks = () => (
    <>
      {isLoggedIn ? (
        <>
          {isStaff && (
            <>
              <Link
                href="/adminPage"
                className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 text-sm font-medium transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/mainHotel/manage/"
                className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 text-sm font-medium transition-colors"
              >
                <Building className="w-4 h-4 mr-2" />
                Manage Hotels
              </Link>
            </>
          )}
          <Link
            href="/profile/"
            className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm font-medium transition-colors"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Link>
          <Button onClick={handleLogout} variant="default" className="text-sm">
            Logout
          </Button>
        </>
      ) : (
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors"
        >
          Login
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-white flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="text-xl font-bold">
        <Image src="/logo-petloga.svg" alt="Petgoda Logo" width={220} height={100} priority className="h-12 w-auto" />
      </Link>

      <div className="hidden md:flex md:items-center md:gap-8">
        <NavLinks />
      </div>

      <div className="hidden md:flex md:items-center md:gap-4">
        <AuthLinks />
      </div>

      <Dialog>
        <DialogTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[300px] sm:w-[400px] bg-white p-0">
          <nav className="flex flex-col gap-4 p-6">
            <div className="flex flex-col space-y-4">
              <NavLinks />
            </div>
            <div className="flex flex-col gap-4 mt-4 pt-4 border-t">
              <AuthLinks />
            </div>
          </nav>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
