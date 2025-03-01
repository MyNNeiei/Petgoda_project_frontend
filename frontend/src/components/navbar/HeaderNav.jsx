"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, User } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isStaff, setIsStaff] = useState(false) // Add state for staff status
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      })

      if (res.ok) {
        setIsLoggedIn(false)
        router.refresh()
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const NavLinks = () => (
    <>
      <Link href="/" className="hover:text-primary transition-colors">
        Home
      </Link>
      <Link href="/about" className="hover:text-primary transition-colors">
        About
      </Link>
      <Link href="/hotels" className="hover:text-primary transition-colors">
        Hotels
      </Link>
      <Link href="/contact" className="hover:text-primary transition-colors">
        Contact
      </Link>
    </>
  )

  const AuthLinks = () => (
    <>
      {isLoggedIn ? (
        <>
          {isStaff && (
            <Link
              href="/admin-dashboard"
              className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 text-sm font-medium transition-colors"
            >
              Admin Dashboard
            </Link>
          )}
          <Link
            href="/profile"
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
  )

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="text-xl font-bold">
        <Image src="/logo-petloga.svg" alt="Petgoda Logo" width={220} height={100} priority className="h-12 w-auto" />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center md:gap-8">
        <NavLinks />
      </div>

      {/* Desktop Auth */}
      <div className="hidden md:flex md:items-center md:gap-4">
        <AuthLinks />
      </div>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4">
            <NavLinks />
            <div className="flex flex-col gap-4 mt-4">
              <AuthLinks />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </nav>
  )
}

